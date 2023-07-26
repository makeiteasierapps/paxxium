from flask import Blueprint, request, current_app
from myapp.services.firebase_service import FirebaseService


start_conversation = Blueprint('start_conversation', __name__)
firebase_service = FirebaseService()

@start_conversation.route('/start_conversation', methods=['POST'])
def conversation_start():
    bot_service = current_app.bot_service
    conversation_service = current_app.conversation_service
        
    # Authenticates user
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)

    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    # Gathers requested bots information
    data = request.get_json()
    bot_profile_id = data['bot_profile_id']
    bot_name = data['bot_name']

    # Validate received data
    uid = decoded_token['uid']
    if not uid or not bot_profile_id:
        return {'message': 'User ID and Bot Profile ID are required'}, 400

    # Create a new chatbot in the database
    chatbot, chatbot_id = bot_service.create_chatbot(bot_profile_id)
    
    # Create a new conversation in the database
    new_conversation_id = conversation_service.create_conversation(uid, chatbot['bot_profile_id'], bot_name)

    return {
        'message': f'A conversation has been started with bot {chatbot["bot_profile_id"]}.',
        'conversation': {
            'id': new_conversation_id,
            'user_id': uid,
            'agent_id': chatbot_id,
            'agent_name': bot_name,
        },

    }, 201
