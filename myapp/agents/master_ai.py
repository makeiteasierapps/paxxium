from flask import current_app
from langchain import (
    LLMMathChain,
    SerpAPIWrapper,
)
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.agents import initialize_agent, AgentType, Tool
from myapp.agents.tools.tools import SaveMessageTool
from myapp.services.user_services import UserService

class MasterAI:
    def __init__(self, message_service, uid, model="gpt-3.5-turbo-0613", system_message_content='You are a friendly expert in tech'):
        # langchain.debug = True
        db = current_app.config['db']
        user_service = UserService(db)
        user_service.check_authorization(uid)
        encrypted_openai_key, encrypted_serp_key = user_service.get_keys(uid)
        self.openai_api_key = user_service.decrypt(encrypted_openai_key)
        self.serp_key = user_service.decrypt(encrypted_serp_key)
        self.uid = uid
        self.search = SerpAPIWrapper(serpapi_api_key=self.serp_key)
        self.llm = ChatOpenAI(temperature=0, model=model, openai_api_key=self.openai_api_key)
        self.llm_math_chain = LLMMathChain.from_llm(llm=self.llm, verbose=True)
        self.memory=ConversationBufferMemory(memory_key='memory', return_messages=True)
        self.save_message = SaveMessageTool(memory=self.memory)
        
        self.tools = [
            Tool(
                name="Search",
                func=self.search.run,
                description="useful for when you need to answer questions about current events. You should ask targeted questions",
            ),
            Tool(
                name="Calculator",
                func=self.llm_math_chain.run,
                description="useful for when you need to answer questions about math",
            ),
        ]
        self.tools.append(self.save_message)
        custom_system_message = SystemMessage(content=system_message_content)
        self.agent_kwargs = {
            "extra_prompt_messages": [MessagesPlaceholder(variable_name="memory")],
            "system_message": custom_system_message,
        }
        self.master_ai = initialize_agent(
            self.tools,
            self.llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            memory=self.memory,
            verbose=True,
            agent_kwargs=self.agent_kwargs
            )
        self.message_service = message_service

    def pass_to_masterAI(self, message_obj, conversation_id, chatbot_id, user_id):
        message_content = message_obj['message_content']
        response = self.master_ai.run(message_content)                                 
        response_obj = self.message_service.create_message(conversation_id=conversation_id, message_from='chatbot', chatbot_id=chatbot_id, user_id=user_id, message_content=response)
    
        return response_obj
    
    def pass_to_debateAI(self, message_obj):
        message_content = message_obj['message_content']
        response = self.master_ai.run(message_content)
        return response
