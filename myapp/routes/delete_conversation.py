from flask import Blueprint, request
from myapp import db
from myapp.services.conversation_service import ConversationService
from myapp.services.firebase_service import FirebaseService

delete_conversation_route = Blueprint('delete_conversation', __name__)
firebase_service = FirebaseService()

@delete_conversation_route.route('/delete_conversation/<string:conversation_id>', methods=['DELETE'])
def delete_conversation(conversation_id):
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)
    
    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    uid = decoded_token['uid']
    conversation_service = ConversationService(db)
    conversation_service.delete_conversation(uid, conversation_id)
    return {'message': 'Conversation deleted'}, 200