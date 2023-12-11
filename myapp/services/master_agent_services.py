from myapp.agents.master_agent import MasterAgent
from collections import OrderedDict

class MasterAgentService:
    def __init__(self, app, message_service):
        self.master_agents = OrderedDict()
        self.app = app
        self.message_service = message_service
        self.max_agent_instances = 1000

    def check_and_set_agent_instance(self, uid, chat_id, system_prompt, chat_constants, agent_model, user_analysis=None):
        key = (uid, chat_id)

        if agent_model == 'GPT-4':
            agent_model = 'gpt-4-0613'
        else:
            agent_model = 'gpt-3.5-turbo-0613'
        
        # Check if the AI instance for the given key exists in the master_agents dictionary
        if key not in self.master_agents:
            # If the number of master_agents has reached the maximum allowed instances,
            # remove the oldest one (FIFO) to make space for a new instance
            if len(self.master_agents) >= self.max_agent_instances:
                self.master_agents.popitem(last=False)

            self.master_agents[key] = MasterAgent(self.message_service, uid, chat_id, 'agent', model=agent_model, system_prompt=system_prompt, chat_constants=chat_constants, user_analysis=user_analysis)
        else:
            self.master_agents[key].user_analysis = user_analysis
            self.master_agents[key].chat_constants = chat_constants
            self.master_agents[key].update_llm_instance(agent_model, system_prompt, 'agent')
            # Move the key to the end of the dictionary to indicate it was most recently used
            self.master_agents.move_to_end(key)
        
        # Return the MasterAgent instance associated with the provided key
        return self.master_agents[key], key
    
    def get_agent_by_key(self, uid, chat_id):
        key = (uid, chat_id)
        
        if key in self.master_agents:
            return self.master_agents[key]
        
        raise KeyError(f"Agent with key {key} not found.")

