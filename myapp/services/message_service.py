from flask import current_app
from datetime import datetime
from google.cloud import firestore


class MessageService:
    def __init__(self, db):
        self.db = db
        
    def select_model(self, agent_model):
        # Choose the appropriate model based on the bot_name
        if agent_model == 'GPT-4':
            model = 'gpt-4-0613'
        elif agent_model == 'GPT-3.5':
            model = 'gpt-3.5-turbo-0613'
        else:
            raise ValueError("Invalid bot name")

        return model

    def create_message(
            self,
            conversation_id,
            user_id,
            message_from,
            message_content,
            ):
        new_message = {
            'message_from': message_from,
            'content': message_content,
            'type': 'database',
            'time_stamp': datetime.utcnow()
        }
        self.db.collection('users').document(user_id).collection('conversations').document(conversation_id).collection('messages').add(new_message)
        return new_message

    def get_all_messages(self, user_id, conversation_id):
        # Get the reference to the conversation document
        conversation_ref = self.db.collection('users').document(user_id).collection('conversations').document(conversation_id)

        # Fetch the conversation document
        conversation = conversation_ref.get()

        # Fetch bot_name from the conversation document
        agent_model = conversation.get('agent_model') if conversation.exists else None

        # Fetch the messages from the conversation
        messages = conversation_ref.collection('messages').order_by('time_stamp', direction=firestore.Query.ASCENDING).stream()

        # Return the bot_name along with the messages
        return {"agent_model": agent_model, "messages": [msg.to_dict() for msg in messages]}
    
    def delete_all_messages(self, user_id, conversation_id):
        master_agent_service = current_app.master_agent_service
        messages_ref = self.db.collection('users').document(user_id).collection('conversations').document(conversation_id).collection('messages')
        
        batch = self.db.batch()
        for doc in messages_ref.stream():
            batch.delete(doc.reference)
        batch.commit()

        agent_ref = master_agent_service.get_agent_by_key(user_id, conversation_id)
        
        agent_ref.clear_memory()  # Use "await" here to correctly await the asynchronous function

