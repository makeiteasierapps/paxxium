from flask import Blueprint, current_app, request
from myapp.services.debate_services import DebateManager
from myapp.services.firebase_service import FirebaseService
from myapp.services.conversation_service import ConversationService

debate = Blueprint('start_debate', __name__)
firebase_service = FirebaseService()

debate_managers = {}
@debate.route('/start_debate', methods=['POST'])
def handle_debate():
    db = current_app.config['db']
    conversation_service = ConversationService(db)
    # Authenticates user
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)
    uid = decoded_token['uid']
    
    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    # Extract data from request
    data = request.get_json()
    role_1 = data.get('role_1')
    role_2 = data.get('role_2')
    topic = data.get('topic')
    turn = data.get('turn')
   
    # Create a new conversation if it's the start of the debate
    if turn == 0:
        new_conversation_id = conversation_service.create_chat(uid, '333', 'AgentDebate')
        debate_manager = DebateManager(uid, new_conversation_id, role_1, role_2, current_app)
        debate_managers[uid] = debate_manager
    else:
        debate_manager = debate_managers[uid]
    
    response_content, has_more_turns = debate_manager.start_debate(topic, turn)

    return {'message': response_content, 'hasMoreTurns': has_more_turns, 'conversation': {
            'id': debate_manager.conversation_id,
            'user_id': uid,
            'agent_id': 333,
            'agent_name': 'AgentDebate',
        }}, 200