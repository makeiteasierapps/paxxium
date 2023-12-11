from flask import Blueprint, request, current_app, jsonify

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


    master_agent_service = current_app.master_agent_service
    chat_service = current_app.chat_service

    user_analysis = None
    if use_profile_data:
        us = current_app.user_service
        profile_analysis = us.get_profile_analysis(uid)
        user_analysis = profile_analysis['analysis']

    new_chat_id = chat_service.create_chat_in_db(uid, chat_name, agent_model, system_prompt, chat_constants, use_profile_data)
    master_agent_service.check_and_set_agent_instance(uid, new_chat_id, system_prompt, chat_constants, agent_model, user_analysis)
    
    chat_data = {
        'id': new_chat_id,
        'chat_name': chat_name,
        'agent_model': agent_model,
        'system_prompt': system_prompt,
        'chat_constants': chat_constants,
        'use_profile_data': use_profile_data,
        'is_open': True
    }
    return chat_data, 200

@chat.route('/chat', methods=['GET'])
def get_chat_data():
    """
    Fetches all chat data for a given user
    """
    uid = authenticate_request()

    if not uid:
        return {'message': 'Invalid token'}, 403

    chat_service = current_app.chat_service
    chat_data_list = chat_service.get_all_chats(uid)
    
    return chat_data_list, 200

@chat.route('/chat/<string:chat_id>/delete', methods=['DELETE'])
def delete_chat(chat_id):
    uid = authenticate_request()
    
    if not uid:
        return {'message': 'Invalid token'}, 403

    chat_service = current_app.chat_service
    chat_service.delete_conversation(uid, chat_id)
    
    return {'message': 'Conversation deleted'}, 200

@chat.route('/chat/update_visibility', methods=['POST'])
def update_visibility():
    uid = authenticate_request()
    
    if not uid:
        return {'message': 'Invalid token'}, 403

    data = request.get_json()
    chat_id = data.get('id')
    is_open = data.get('is_open')

    chat_service = current_app.chat_service
    chat_service.update_visibility(uid, chat_id, is_open)
    
    return jsonify({'message': 'Conversation updated'}), 200

@chat.route('/chat/update_settings', methods=['POST'])
def update_settings():
    uid = authenticate_request()

    if not uid:
        return {'message': 'Invalid token'}, 403
    
    data = request.get_json()
    chat_service = current_app.chat_service
    use_profile_data = data.get('use_profile_data')
    chat_name = data.get('chat_name')
    new_chat_id = data.get('id')
    agent_model = data.get('agent_model')
    system_prompt = data.get('system_prompt')
    chat_constants = data.get('chat_constants')

    # Update the database
    chat_service.update_settings(uid, new_chat_id, chat_name, agent_model, system_prompt, chat_constants, use_profile_data)

    user_analysis = None
    us = current_app.user_service
    profile_analysis = us.get_profile_analysis(uid)
    
    if use_profile_data:
        user_analysis = profile_analysis['analysis']
    
    # Update the agent instance
    master_agent_service = current_app.master_agent_service
    master_agent_service.check_and_set_agent_instance(uid, new_chat_id, system_prompt, chat_constants, agent_model, user_analysis)

    return jsonify({'message': 'Conversation updated'}), 200