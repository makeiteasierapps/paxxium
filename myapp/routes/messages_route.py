from myapp import socketio
from flask import Blueprint, request, jsonify, current_app
from myapp.services.message_service import MessageService
from myapp.services.firebase_service import FirebaseService

messages = Blueprint('messages', __name__)
firebase_service = FirebaseService()


@messages.route('/<string:conversation_id>/messages', methods=['GET'])
def get_messages(conversation_id):

    message_service = current_app.message_service
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)
    uid = decoded_token['uid']
    
    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    conversation_data = message_service.get_all_messages(uid, conversation_id)
    agent_name = conversation_data['bot_name']

    # If the conversation requested is a debate no need to set an Agent instance
    if agent_name == 'AgentDebate':
        return jsonify(conversation_data), 200
    
    # Check if there is an instance in memory, if not create one and add memory
    agent = current_app.master_ai_service.check_and_set_ai_instance(uid, conversation_id, agent_name)
    agent.load_history_to_memory(conversation_data)
    return jsonify(conversation_data), 200


@socketio.on('message')
def handle_message(data):
    id_token = data['idToken']
    decoded_token = firebase_service.verify_id_token(id_token)
    uid = decoded_token['uid']
    conversation_id = data['conversationId']
    
    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    return process_message(data, uid, conversation_id)

def process_message(data, uid, conversation_id):
    db = current_app.config['db']
    message_service = MessageService(db)
    # Extrtact data from request
    message_content = data.get('message_content')
    message_from = data.get('message_from')
    agent_name = data.get('agent_name')
    chatbot_id = data.get('agent_id')

    # Create a new message in the database
    new_message = message_service.create_message(conversation_id=conversation_id, message_content=message_content, message_from=message_from, user_id=uid, chatbot_id=chatbot_id)
    
    agent = current_app.master_ai_service.check_and_set_ai_instance(uid, conversation_id, agent_name )
    
    # Pass message to Agent
    response_from_llm = agent.pass_to_master_agent(message_obj=new_message, conversation_id=conversation_id, chatbot_id=chatbot_id, user_id=uid)
    
    # Convert the timestamp to a string
    time_stamp_str = str(response_from_llm['time_stamp'])

    # Add the string timestamp back to the dictionary   
    response_from_llm['time_stamp'] = time_stamp_str
    # Emit the new message to the client over the WebSocket connection
    socketio.emit('message', response_from_llm)



