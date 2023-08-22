from flask import Blueprint, request, current_app


chat = Blueprint('chat', __name__)

def authenticate_request():
    firebase_service = current_app.firebase_service
    id_token = request.headers.get('Authorization')
    decoded_token = firebase_service.verify_id_token(id_token)
    
    if not decoded_token:
        return None
    return decoded_token['uid']

@chat.route('/chat/create', methods=['POST'])
def create_chat():
    uid = authenticate_request()
    
    if not uid:
        return {'message': 'Invalid token'}, 403

    data = request.get_json()
    chat_name = data['chatName']
    agent_model = data['agentModel']
    system_prompt = data['systemPrompt']
    chat_constants = data['chatConstants']
    use_profile_data = data['useProfileData']
    
    conversation_service = current_app.conversation_service
    new_chat_id = conversation_service.create_chat(uid, chat_name, agent_model, system_prompt, chat_constants, use_profile_data)
    
    master_agent_service = current_app.master_agent_service
    master_agent_service.check_and_set_agent_instance(uid, new_chat_id, agent_model, system_prompt, chat_constants)
    chat_data = {
        'id': new_chat_id,
        'chat_name': chat_name,
        'agent_model': agent_model,
        'system_prompt': system_prompt,
        'chat_constants': chat_constants,
        'use_profile_data': use_profile_data
    }
    return chat_data, 200

@chat.route('/chat', methods=['GET'])
def get_chat_data():
    uid = authenticate_request()

    if not uid:
        return {'message': 'Invalid token'}, 403

    conversation_service = current_app.conversation_service
    conversations = conversation_service.get_chat_ids(uid)
    chat_data_list = []
    
    for conversation in conversations:
        chat_id = conversation['id']
        chat_data = conversation_service.chat_data(uid, chat_id)
        chat_data['id'] = chat_id
        chat_data_list.append(chat_data)
    
    return chat_data_list, 200

@chat.route('/chat/<string:chat_id>/delete', methods=['DELETE'])
def delete_chat(chat_id):
    uid = authenticate_request()
    
    if not uid:
        return {'message': 'Invalid token'}, 403

    conversation_service = current_app.conversation_service
    conversation_service.delete_conversation(uid, chat_id)
    
    return {'message': 'Conversation deleted'}, 200

