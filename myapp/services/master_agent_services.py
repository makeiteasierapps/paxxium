from myapp.agents.master_agent import MasterAgent
from collections import OrderedDict

class MasterAIService:
    def __init__(self, app, message_service):
        self.master_agents = OrderedDict()
        self.app = app
        self.message_service = message_service
        self.max_agent_instances = 1000

    def check_and_set_ai_instance(self, uid, conversation_id, bot_name):
        model = self.message_service.select_model(bot_name)
        key = (uid, conversation_id)

        if key not in self.master_agents:
            if len(self.master_agents) >= self.max_agent_instances:
                self.master_agents.popitem(last=False)

            self.master_agents[key] = MasterAgent(self.message_service, uid, model=model)
        else:
            self.master_agents[key].model = model
            self.master_agents.move_to_end(key)
        
        return self.master_agents[key]