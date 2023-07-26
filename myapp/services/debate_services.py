from myapp.agents.master_agent import MasterAgent
from myapp.services.message_service import MessageService

class DebateManager:
    def __init__(self, uid, conversation_id, role1, role2, app, num_rounds=4):
        self.uid = uid
        self.conversation_id = conversation_id
        self.role1 = role1
        self.role2 = role2
        self.num_rounds = num_rounds
        self.response_content = None

        # Initialize MessageService
        self.message_service = None
        if app is not None:
            db = app.config['db']
            self.message_service = MessageService(db)


        # Initialize two agents
        self.agent1 = MasterAgent(self.message_service, self.uid, system_message_content=self.role1)
        self.agent2 = MasterAgent(self.message_service, self.uid, system_message_content=self.role2)


    def start_debate(self, topic, turn):
        if turn == 0:  # Start of the debate
            opening_argument_content = self.agent1.pass_to_debateAI({'message_content': f"You are in a debate and have been chosen to go first. The topic to be debated is: {topic}. Please make your opening argument."})
            self.response_content = opening_argument_content
        else:
            if turn % 2 == 0:  # Even round
                self.response_content = self.agent1.pass_to_debateAI({'message_content': self.response_content})
            else:  # Odd round
                self.response_content = self.agent2.pass_to_debateAI({'message_content': f"You are in a debate, based on the role you were given respond to your opponents message: {self.response_content}" })
                

        # Create a new message for each response
        self.message_service.create_message(conversation_id=self.conversation_id, user_id=self.uid, message_content=self.response_content, message_from='chatbot', chatbot_id='333')

        return self.response_content, turn < self.num_rounds
