from datetime import datetime
from google.cloud import firestore

class ChatService:
    def __init__(self, db):
        self.db = db

    def create_chat(self, user_id, chat_name, agent_model, system_prompt, chat_constants, use_profile_data):
        """
        Creates a new chat in the database
        """
        new_chat = {
            'chat_name': chat_name,
            'agent_model': agent_model,
            'system_prompt': system_prompt,
            'chat_constants': chat_constants,
            'use_profile_data': use_profile_data,
            'is_open': True,
            'created_at': datetime.utcnow()
        }
        new_chat_ref = self.db.collection('users').document(user_id).collection('conversations').add(new_chat)
        new_chat_id = new_chat_ref[1].id
        return  new_chat_id

    def get_all_chats(self, user_id):
        """
        Returns a list of conversation ids for a given user
        """
        conversations = self.db.collection('users').document(user_id).collection('conversations').order_by('created_at', direction=firestore.Query.DESCENDING).stream()
        return [{**conv.to_dict(), 'id': conv.id} for conv in conversations]
    
    def get_single_chat(self, user_id, chat_id):
        """
        Returns a dictionary of chat data for a given user and chat id
        """
        chat = self.db.collection('users').document(user_id).collection('conversations').document(chat_id).get()
        return chat.to_dict()
    
    def update_visibility(self, uid, chat_id, is_open):
        """
        Updates the visibility of a chat in the database
        """
        chat_ref = self.db.collection('users').document(uid).collection('conversations').document(chat_id)
        chat_ref.update({'is_open': is_open})

    def delete_conversation(self, user_id, conversation_id):
        """
        Deletes a conversation from the database
        """
        conversation = self.db.collection('users').document(user_id).collection('conversations').document(conversation_id)
        conversation.delete()
        return conversation

    def update_settings(self, user_id, chat_id, chat_name, agent_model, system_prompt, chat_constants, use_profile_data):
        """
        Updates a chat in the database
        """
        chat_ref = self.db.collection('users').document(user_id).collection('conversations').document(chat_id)
        chat_ref.update({
            'chat_name': chat_name,
            'agent_model': agent_model,
            'system_prompt': system_prompt,
            'chat_constants': chat_constants,
            'use_profile_data': use_profile_data
        })
        return chat_ref