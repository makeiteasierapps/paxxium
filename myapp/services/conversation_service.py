from datetime import datetime
from google.cloud import firestore

class ConversationService:
    def __init__(self, db):
        self.db = db

    def create_conversation(self, user_id, bot_profile_id, bot_name):
        new_conversation = {
            'bot_profile_id': bot_profile_id,
            'bot_name': bot_name,
            'created_at': datetime.utcnow()
        }
        new_conversation_ref = self.db.collection('users').document(user_id).collection('conversations').add(new_conversation)
        new_conversation__id = new_conversation_ref[1].id
        return  new_conversation__id 

    def get_conversations(self, user_id):
        conversations = self.db.collection('users').document(user_id).collection('conversations').order_by('created_at', direction=firestore.Query.DESCENDING).stream()
        return [{**conv.to_dict(), 'id': conv.id} for conv in conversations]


    def delete_conversation(self, user_id, conversation_id):
        conversation = self.db.collection('users').document(user_id).collection('conversations').document(conversation_id)
        conversation.delete()
        return conversation
