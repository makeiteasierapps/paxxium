from flask import Blueprint, current_app
from flask_socketio import join_room, emit
from myapp import socketio
from myapp.services.debate_services import DebateManager
from myapp.services.firebase_service import FirebaseService
from myapp.services.conversation_service import ConversationService

debate = Blueprint('debate', __name__)
firebase_service = FirebaseService()


@socketio.on('start_debate')
def handle_start_debate(data):
    db = current_app.config['db']
    conversation_service = ConversationService(db)
    id_token = data['idToken']
    decoded_token = firebase_service.verify_id_token(id_token)
    if not decoded_token:
        return
    uid = decoded_token['uid']

    role_1 = data.get('role_1')
    role_2 = data.get('role_2')
    topic = data.get('topic')

    # Create a new conversation
    new_conversation_id = conversation_service.create_conversation(uid, '333', 'AgentDebate')
    debate_manager = DebateManager(uid, new_conversation_id, role_1, role_2, current_app)
   
    # Emit the new conversation details back to the client
    emit('debate_started', {
        'message': 'A conversation has been started with bot "333"',
        'conversation': {
            'id': new_conversation_id,
            'user_id': uid,
            'agent_id': '333',
            'agent_name': 'AgentDebate',
        },
    })
    
    # start debate in a different thread
    socketio.start_background_task(debate_manager.start_debate, topic)

@socketio.on('join')
def on_join(data):
    print('Join event triggered')
    room = data['room']
    join_room(room)
    emit('new_message', {'content': 'Welcome to the room!'}, room=room)