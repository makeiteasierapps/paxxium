from flask import Blueprint, request, current_app
from myapp.services.debate_services import DebateManager

debate = Blueprint('debate', __name__)

def authenticate_request():
    firebase_service = current_app.firebase_service
    id_token = request.headers.get('Authorization')
    decoded_token = firebase_service.verify_id_token(id_token)
    
    if not decoded_token:
        return None
    return decoded_token['uid']

debate_managers = {}
@debate.route('/debate/create', methods=['POST'])
def create_debate():
    uid = authenticate_request()

    # Extract data from request
    data = request.get_json()
    role1 = data.get('role_1')
    role2 = data.get('role_2')
    topic = data.get('topic')

    # Create a new debate
    new_debate_id = DebateManager.create_debate(uid)
    debate_manager = DebateManager(uid=uid, conversation_id=new_debate_id, role1=role1, role2=role2)
    debate_managers[uid] = debate_manager
    debate_data = {
        'id': new_debate_id,
        'role1': role1,
        'role2': role2,
        'topic': topic,
        'chat_name': 'Debate',
        'agent_model': 'AgentDebate',
    }

    return debate_data, 200

@debate.route('/debate/start_debate', methods=['POST'])
def start_debate():
    print('start_debate called')
    uid = authenticate_request()

    # Extract data from request
    data = request.get_json()
    topic = data.get('topic')
    turn = data.get('turn')
   
    debate_manager = debate_managers[uid]
    response_content, has_more_turns, agent_responding = debate_manager.start_debate(topic, turn)

    return {'hasMoreTurns': has_more_turns, 'message': {
            'message_content': response_content,
            'message_from': agent_responding,
            'agent_model': 'AgentDebate',
            'topic': topic,
            'id': debate_manager.conversation_id,
            'user_id': uid,
        }}, 200
