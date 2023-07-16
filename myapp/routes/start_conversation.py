from flask import Blueprint, request
from myapp.services.firebase_service import FirebaseService
from myapp import db
from myapp.services.bot_service import BotService
from myapp.services.conversation_service import ConversationService
from myapp.services.message_service import MessageService
from myapp.agents.master_ai import MasterAI

start_conversation = Blueprint('start_conversation', __name__)
bot_service = BotService(db)
conversation_service = ConversationService(db)
message_service = MessageService(db)
firebase_service = FirebaseService()

@start_conversation.route('/start_conversation', methods=['POST'])
def conversation_start():
    # Authenticates user
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)

    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    data = request.get_json()
    bot_profile_id = data['bot_profile_id']
    bot_name = data['bot_name']

    # Validate received data
    uid = decoded_token['uid']
    if not uid or not bot_profile_id:
        return {'message': 'User ID and Bot Profile ID are required'}, 400




    # Verify bot profile exists
    # bot_profile = bot_service.get_bot_profile(bot_profile_id)
    # if not bot_profile:
    #     return {'message': f'Bot profile {bot_profile_id} does not exist'}, 404

    # Create a new chatbot in the database
    chatbot, chatbot_id = bot_service.create_chatbot(bot_profile_id)
    
    # Create a new conversation in the database
    new_conversation_id = conversation_service.create_conversation(uid, chatbot['bot_profile_id'], bot_name)
    starter_prompt = '''
    You are a friendly helpfuly Ai that specializes in tutoring. You are an expert on all subjects. 
    The user has just initiated a conversation with you, provide a welcome message and guidance on how you can help them.
    '''
    
    master_ai = MasterAI(message_service)
    master_ai.pass_to_masterAI(message_obj={'message_content': starter_prompt}, conversation_id=new_conversation_id, user_id=uid, chatbot_id=chatbot_id)
    
    return {
        'message': f'A conversation has been started with bot {chatbot["bot_profile_id"]}.',
        'conversation': {
            'id': new_conversation_id,
            'user_id': uid,
            'agent_id': chatbot_id,
            'agent_name': bot_name,
        },

    }, 201
