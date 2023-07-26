from flask import current_app
import langchain
from langchain import (
    LLMMathChain,
    SerpAPIWrapper,
)
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from langchain.chat_models import ChatOpenAI
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler 
from langchain.memory import ConversationBufferWindowMemory
from langchain.agents import initialize_agent, AgentType, Tool
from myapp.agents.tools.tools import SaveMessageTool




class MasterAgent:
    def __init__(self, message_service, uid, model="gpt-3.5-turbo-0613", system_message_content='You are a friendly expert in tech'):
        langchain.debug = True
        user_service = current_app.user_service
        encrypted_openai_key, encrypted_serp_key = user_service.get_keys(uid)
        self.openai_api_key = user_service.decrypt(encrypted_openai_key)
        self.serp_key = user_service.decrypt(encrypted_serp_key)
        self.uid = uid
        self.search = SerpAPIWrapper(serpapi_api_key=self.serp_key)
        self.llm = ChatOpenAI(streaming=True, callbacks=[StreamingStdOutCallbackHandler()], temperature=0, model=model, openai_api_key=self.openai_api_key)
        self.llm_math_chain = LLMMathChain.from_llm(llm=self.llm, verbose=True)
        self.memory=ConversationBufferWindowMemory(memory_key='memory', return_messages=True, k=5)
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
    
    def load_history_to_memory(self, conversation):
        """ 
        Takes a conversation object and loads the last 10 messages into memory
        """
        # Return out of method if memory already exists
        memory_variables = self.memory.load_memory_variables({})
        if memory_variables and memory_variables.get('memory'):
            return
        
        # load the 5 most recent exchanges into memory
        messages = conversation['messages']
        pairs = []
        for i in range(len(messages)-1, -1, -1):
            message = messages[i]
            message_from = message['message_from']
            if message_from == 'user':
                if i != 0:
                    next_message = messages[i-1]
                    next_message_from = next_message['message_from']
                    if next_message_from == 'chatbot':
                        pairs.append((message, next_message))
                else:
                    pairs.append((message, {"message_content": "This is not a part of your conversation, end of buffer", "message_from": "chatbot"}))
            if len(pairs) == 5:
                break
        pairs.reverse()
        for pair in pairs:
            self.memory.save_context({"input": pair[0]['message_content']}, {"output": pair[1]['message_content']})