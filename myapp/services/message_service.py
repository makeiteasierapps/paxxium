from datetime import datetime
from google.cloud import firestore


class MessageService:
    def __init__(self, db):
        self.db = db
        
    def select_model(self, bot_name):
        # Choose the appropriate model based on the bot_name
        if bot_name == 'GPT-4':
            model = 'gpt-4-0613'
        elif bot_name == 'GPT-3.5':
            model = 'gpt-3.5-turbo-0613'
        else:
            raise ValueError("Invalid bot name")

        return model

    def create_message(
            self,
            conversation_id,
            user_id,
            chatbot_id,
            message_from,
            message_content,
            room_id=None
            ):
        new_message = {
            'room_id': room_id,
            'chatbot_id': chatbot_id,
            'message_from': message_from,
            'message_content': message_content,
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
        bot_name = conversation.get('bot_name') if conversation.exists else None

        # Fetch the messages from the conversation
        messages = conversation_ref.collection('messages').order_by('time_stamp', direction=firestore.Query.ASCENDING).stream()

        # Return the bot_name along with the messages
        return {"bot_name": bot_name, "messages": [msg.to_dict() for msg in messages]}
    
    

