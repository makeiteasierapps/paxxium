from flask import Blueprint, request, jsonify, current_app
from myapp import socketio


messages = Blueprint('messages', __name__)

def authenticate_request(id_token=None):
    firebase_service = current_app.firebase_service
    if id_token:
        decoded_token = firebase_service.verify_id_token(id_token)
        if not decoded_token:
            return None
        return decoded_token['uid']
    
    # Handle the case when idToken is not provided (e.g., for fetch requests)
    id_token = request.headers.get('Authorization')
    decoded_token = firebase_service.verify_id_token(id_token)
    if not decoded_token:
        return None
    return decoded_token['uid']


@messages.route('/<string:conversation_id>/messages', methods=['POST'])
def get_messages(conversation_id):
    uid = authenticate_request()
    ms = current_app.message_service
    chat_data = request.get_json()
    conversation_data = ms.get_all_messages(uid, conversation_id)
    agent_model = chat_data['agentModel']

    # If the conversation requested is a debate no need to set an Agent instance
    if agent_model == 'AgentDebate':
        return jsonify(conversation_data), 200
    
    # Check if there is an instance in memory, if not create one and add memory
    agent, key = current_app.master_agent_service.check_and_set_agent_instance(uid=uid, chat_id=conversation_id, agent_model=agent_model, system_prompt=chat_data['systemPrompt'], chat_constants=chat_data['chatConstants'])
    agent.load_history_to_memory(conversation_data)
    return jsonify(conversation_data), 200


@socketio.on('message')
def handle_message(data):
    id_token = data.get('idToken')
    uid = authenticate_request(id_token)
    
    chat_id = data['chatId']
    return process_message(data, uid, chat_id)

def process_message(data, uid, chat_id):
    ms = current_app.message_service
    # Extrtact data from request
    message_content = data.get('message_content')
    message_from = data.get('message_from')

    # Create a new message in the database
    new_message = ms.create_message(conversation_id=chat_id, message_content=message_content, message_from=message_from, user_id=uid)
    
    agent = current_app.master_agent_service.get_agent_by_key(uid, chat_id)
    
    # Pass message to Agent
    response_from_llm = agent.pass_to_master_agent(message_obj=new_message, conversation_id=chat_id, user_id=uid)
    
    # Convert the timestamp to a string
    time_stamp_str = str(response_from_llm['time_stamp'])

    # Add the string timestamp back to the dictionary   
    response_from_llm['time_stamp'] = time_stamp_str
    # Emit the new message to the client over the WebSocket connection
    socketio.emit('message', response_from_llm)

@messages.route('/<string:conversation_id>/messages/clear', methods=['DELETE'])
def clear_memory(conversation_id):
    uid = authenticate_request()
    message_service = current_app.message_service
    message_service.delete_all_messages(uid, conversation_id)
    return {'message': 'Memory cleared'}, 200
