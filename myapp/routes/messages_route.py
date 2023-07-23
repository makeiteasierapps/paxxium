from collections import OrderedDict
from flask import Blueprint, request, jsonify, current_app
from myapp.services.message_service import MessageService
from myapp.services.firebase_service import FirebaseService
from myapp.agents.master_ai import MasterAI

messages = Blueprint('messages', __name__)
firebase_service = FirebaseService()

# This is the OrderedDict where we'll store the MasterAI instances
master_ais = OrderedDict()

# Max number of MasterAI instances that can be stored
MAX_AI_INSTANCES = 1000  # This can be adjusted as per your requirements

@messages.route('/<string:conversation_id>/messages', methods=['GET'])
def get_messages(conversation_id):
    db = current_app.config['db']
    message_service = MessageService(db)
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)
    uid = decoded_token['uid']
    if not decoded_token:
        return {'message': 'Invalid token'}, 403
    conversation_data = message_service.get_all_messages(uid, conversation_id)
    return jsonify(conversation_data), 200

@messages.route('/<string:conversation_id>/messages', methods=['POST'])
def send_message(conversation_id):
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)
    uid = decoded_token['uid']

    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    try:
        validate_message(data, uid, conversation_id)
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

    user = firebase_service.get_user(uid)
    if not user:
        return jsonify({'message': 'No user found with that id'}), 404

    return process_message(data, uid, conversation_id)

def validate_message(data, uid, conversation_id):
    message_content = data.get('message_content')
    message_from = data.get('message_from')
    bot_name = data.get('agent_name')
    chatbot_id = data.get('agent_id')

    if not all([message_content, message_from, uid, bot_name, chatbot_id, conversation_id]):
        raise ValueError("Message content, user id, chatbot id, and conversation id are required")

def process_message(data, uid, conversation_id):
    db = current_app.config['db']
    message_service = MessageService(db)
    # Extrtact data from request
    message_content = data.get('message_content')
    message_from = data.get('message_from')
    bot_name = data.get('agent_name')
    chatbot_id = data.get('agent_id')

    # Create a new message in the database
    new_message = message_service.create_message(conversation_id=conversation_id, message_content=message_content, message_from=message_from, user_id=uid, chatbot_id=chatbot_id)
    
    # Set up Agent
    model = message_service.select_model(bot_name)
    # Use (uid, conversation_id) as the key
    key = (uid, conversation_id)


    # If we don't have a MasterAI for this conversation, create a new one
    if key not in master_ais:
        # If we've reached the max number of instances, remove the oldest one
        if len(master_ais) >= MAX_AI_INSTANCES:
            master_ais.popitem(last=False)
        
        master_ais[key] = MasterAI(message_service, uid, model=model)
    else:
        # If we do have a MasterAI for this conversation, make sure it's using the correct model and move it to end
        master_ais[key].model = model
        master_ais.move_to_end(key)  # Moves the key to the end, meaning it is the most recently used
    
    # Pass message to Agent 
    response_from_llm = master_ais[key].pass_to_masterAI(message_obj=new_message, conversation_id=conversation_id, chatbot_id=chatbot_id, user_id=uid)
    
    return jsonify(new_message, response_from_llm), 201


