from datetime import datetime
from google.cloud import firestore

class ConversationService:
    def __init__(self, db):
        self.db = db

    def create_chat(self, user_id, chat_name, agent_model, system_prompt, chat_constants, use_profile_data):
        new_chat = {
            'chat_name': chat_name,
            'agent_model': agent_model,
            'system_prompt': system_prompt,
            'chat_constants': chat_constants,
            'use_profile_data': use_profile_data,
            'created_at': datetime.utcnow()
        }
        new_chat_ref = self.db.collection('users').document(user_id).collection('conversations').add(new_chat)
        new_chat_id = new_chat_ref[1].id
        return  new_chat_id

    def get_chat_ids(self, user_id):
        conversations = self.db.collection('users').document(user_id).collection('conversations').order_by('created_at', direction=firestore.Query.DESCENDING).stream()
        return [{**conv.to_dict(), 'id': conv.id} for conv in conversations]
    
    def chat_data(self, user_id, chat_id):
        chat = self.db.collection('users').document(user_id).collection('conversations').document(chat_id).get()
        return chat.to_dict()


    def delete_conversation(self, user_id, conversation_id):
        conversation = self.db.collection('users').document(user_id).collection('conversations').document(conversation_id)
        conversation.delete()
        return conversation
