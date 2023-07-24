from myapp.agents.master_ai import MasterAI
from collections import OrderedDict

class MasterAIService:
    def __init__(self, app, message_service):
        self.master_ais = OrderedDict()
        self.app = app
        self.message_service = message_service
        self.max_ai_instances = 1000

    def check_and_set_ai_instance(self, uid, conversation_id, bot_name):
        model = self.message_service.select_model(bot_name)
        key = (uid, conversation_id)

        if key not in self.master_ais:
            if len(self.master_ais) >= self.max_ai_instances:
                self.master_ais.popitem(last=False)

            self.master_ais[key] = MasterAI(self.message_service, uid, model=model)
        else:
            self.master_ais[key].model = model
            self.master_ais.move_to_end(key)
        
        return self.master_ais[key]