from flask import current_app
from datetime import datetime
from myapp.agents.master_agent import MasterAgent

class DebateManager:
    def __init__(self, uid, conversation_id, role1, role2, num_rounds=3):
        self.uid = uid
        self.conversation_id = conversation_id
        self.role1 = role1
        self.role2 = role2
        self.num_rounds = num_rounds
        self.response_content = None

        message_service = current_app.message_service
        
        # Initialize two agents
        self.agent1 = MasterAgent(message_service, self.uid, self.conversation_id, 'agent1', system_prompt=self.role1)
        self.agent2 = MasterAgent(message_service, self.uid, self.conversation_id, 'agent2', system_prompt=self.role2)

    @staticmethod
    def create_debate(user_id):
        """
        Creates a new debate in the database and returns the id of the debate
        Returning the ID allows me to create a component in the UI for the debate.
        When that component mounts it will start the debate by calling the start_debate endpoint.
        """
        db = current_app.config['db']
        new_chat = {
            'chat_name': 'Debate',
            'agent_model': 'AgentDebate',
            'created_at': datetime.utcnow(),
            'is_open': True,
        }
        new_chat_ref = db.collection('users').document(user_id).collection('conversations').add(new_chat)
        new_chat_id = new_chat_ref[1].id
        return  new_chat_id
    
    def start_debate(self, topic, turn):
        message_service = current_app.message_service
        agent_responding = None
        if turn == 0:  # Start of the debate
            opening_argument_content = self.agent1.pass_to_debateAI({'message_content': f"You are in a debate and have been chosen to go first. The topic to be debated is: {topic}. Please make your opening argument."})
            self.response_content = opening_argument_content
            agent_responding = 'agent1'
        else:
            if turn % 2 == 0:  # Even round
                self.response_content = self.agent1.pass_to_debateAI({'message_content': self.response_content})
                agent_responding = 'agent1'
            else:  # Odd round
                self.response_content = self.agent2.pass_to_debateAI({'message_content': f"You are in a debate, based on the role you were given respond to your opponents message: {self.response_content}" })
                agent_responding = 'agent2'

        # Create a new message for each response
        message_service.create_message(conversation_id=self.conversation_id, user_id=self.uid, message_content=self.response_content, message_from=agent_responding)

        return self.response_content, turn < self.num_rounds, agent_responding
