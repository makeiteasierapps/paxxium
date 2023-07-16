from myapp.agents.master_ai import MasterAI
from myapp.services.message_service import MessageService
from myapp import socketio

class DebateManager:
    def __init__(self, uid, conversation_id, role1, role2, app, num_rounds=4):
        self.uid = uid
        self.conversation_id = conversation_id
        self.role1 = role1
        self.role2 = role2
        self.num_rounds = num_rounds

        # Initialize MessageService
        self.message_service = None
        if app is not None:
            db = app.config['db']
            self.message_service = MessageService(db)


        # Initialize two agents
        self.agent1 = MasterAI(self.message_service, system_message_content=self.role1)
        self.agent2 = MasterAI(self.message_service, system_message_content=self.role2)


    def start_debate(self, topic):

        # Generate the opening argument
        opening_argument_content = self.agent1.pass_to_debateAI({'message_content': f"You are in a debate and have been chosen to go first. The topic to be debated is: {topic}. Please make your opening argument."})

        # Create a new message for the opening argument
        self.message_service.create_message(conversation_id=self.conversation_id, user_id=self.uid, message_content=opening_argument_content, message_from='chatbot', chatbot_id='333')

        # Emit the opening argument
        opening_argument = {"content": opening_argument_content}
        socketio.emit('new_message', opening_argument, room=self.conversation_id)

        response_content = opening_argument_content
        for i in range(self.num_rounds):
            if i % 2 == 0:  # Even round
                response_content = self.agent2.pass_to_debateAI({'message_content': f"You are in a debate, based on the role you were given respond to your opponents message: {response_content}" })
            else:  # Odd round
                response_content = self.agent1.pass_to_debateAI({'message_content': response_content})

            # Create a new message for each response
            self.message_service.create_message(conversation_id=self.conversation_id, user_id=self.uid, message_content=response_content, message_from='chatbot', chatbot_id='333')

            # Emit the response
            response = {"content": response_content}
            socketio.emit('new_message', response, room=self.conversation_id)



            

