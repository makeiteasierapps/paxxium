from datetime import datetime


class BotService:
    def __init__(self, db):
        self.db = db

    def get_profile(self, bot_profile_id):
        bot_profile_doc = self.db.collection('bot_profiles').document(bot_profile_id).get()
        if not bot_profile_doc.exists:
            return None
        bot_profile = bot_profile_doc.to_dict()
        bot_profile['id'] = bot_profile_doc.id
        return bot_profile

    def get_bot_profiles(self):
        bot_profiles = self.db.collection('bot_profiles').stream()
        output = []
        for bot_profile in bot_profiles:
            bot_data = bot_profile.to_dict()
            bot_data['id'] = bot_profile.id
            output.append(bot_data)
        return {'bot_profiles': output}

    def create_chatbot(self, bot_profile_id):
        new_chatbot = {
            'bot_profile_id': bot_profile_id,
            'response_time': 0,
            'usage_count': 0,
            'created_at': datetime.now(),
            'updated_at': datetime.now(),
        }
        new_chatbot_ref = self.db.collection('chatbots').add(new_chatbot)
        # Access the document ID from the response object
        document_id = new_chatbot_ref[1].id
        # Retrieve the document reference using the ID
        document_ref = self.db.collection('chatbots').document(document_id)
        # Access the data fields of the document reference
        chatbot_data = document_ref.get().to_dict()

        return chatbot_data, document_id