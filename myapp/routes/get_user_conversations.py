from flask import Blueprint, request, current_app
from myapp.services.conversation_service import ConversationService
from myapp.services.firebase_service import FirebaseService

get_user_conversations = Blueprint('get_user_conversations', __name__)
firebase_service = FirebaseService()

@get_user_conversations.route('/get_user_conversations', methods=['GET'])
def get_user_convos():
    db = current_app.config['db']
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)
    
    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    uid = decoded_token['uid']
    conversation_service = ConversationService(db)
    conversations = conversation_service.get_conversations(uid)
    convos = []
    for conversation in conversations:
        convos.append({'id': conversation['id'], 'agent_name': conversation.get('bot_name')})

    return convos, 200
