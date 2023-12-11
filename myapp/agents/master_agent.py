from flask import current_app
from flask_socketio import join_room

import langchain

from langchain.utilities.serpapi import SerpAPIWrapper

from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from langchain.chat_models import ChatOpenAI
from langchain.callbacks.base import BaseCallbackHandler 
from langchain.memory import ConversationBufferWindowMemory
from langchain.agents import initialize_agent, AgentType, Tool
from myapp.agents.tools.tools import SaveMessageTool


class StreamResponse(BaseCallbackHandler):
    def __init__(self, chat_id, agent_name: str):
        self.chat_id = chat_id
        self.agent_name = agent_name

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        from myapp import socketio
        join_room(self.chat_id)
        socketio.emit('token', {'message_from': self.agent_name, 'content': token, 'chat_id': self.chat_id, 'type': 'stream',}, room=self.chat_id)
        socketio.sleep(0)

class MasterAgent:
    def __init__(self, message_service, uid, chat_id, agent_name,  model="gpt-3.5-turbo-0613", system_prompt="You are a friendly but genuine AI Agent. Don't be annoyingly nice, but don't be rude either.", chat_constants='', user_analysis=''):
        langchain.debug = True
        user_service = current_app.user_service
        encrypted_openai_key, encrypted_serp_key = user_service.get_keys(uid)
        self.openai_api_key = user_service.decrypt(encrypted_openai_key)
        self.serp_key = user_service.decrypt(encrypted_serp_key)
        self.uid = uid
        self.chat_id = chat_id
        self.model = model
        self.system_prompt = system_prompt
        self.chat_constants = chat_constants
        self.user_analysis = user_analysis
        self.search = SerpAPIWrapper(serpapi_api_key=self.serp_key)
        self.llm = ChatOpenAI(streaming=True, callbacks=[StreamResponse(self.chat_id, agent_name)], temperature=0, model=self.model, openai_api_key=self.openai_api_key)
        self.memory=ConversationBufferWindowMemory(memory_key='memory', return_messages=True, k=3)
        self.save_message = SaveMessageTool(memory=self.memory)
        self.tools = [
            Tool(
                name="Search",
                func=self.search.run,
                description="useful for when you need to answer questions about current events. You should ask targeted questions",
            ),
        ]
        self.tools.append(self.save_message)

        custom_system_message = SystemMessage(content=self.system_prompt)
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

    def update_llm_instance(self, model, system_prompt, agent_name):
        self.model = model
        self.system_prompt = system_prompt
        self.llm = ChatOpenAI(streaming=True, callbacks=[StreamResponse(self.chat_id, agent_name)], temperature=0, model=self.model, openai_api_key=self.openai_api_key)
        custom_system_message = SystemMessage(content=self.system_prompt)
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
    
    def pass_to_master_agent(self, message_obj, conversation_id, user_id):
        print(self.user_analysis)
        content = message_obj['content']
        message_content = f'***USER ANALYSIS***\n{self.user_analysis}\n***THINGS TO REMEMBER***\n{self.chat_constants}\n**************\n{content}'
        response = self.master_ai.run(message_content)                                 
        response_obj = self.message_service.create_message(conversation_id=conversation_id, message_from='agent', user_id=user_id, message_content=response)
        
        return response_obj
    
    def pass_to_debateAI(self, message_obj):
        message_content = message_obj['content']
        response = self.master_ai.run(message_content)
        return response
    
    def clear_memory(self):
        self.memory = ConversationBufferWindowMemory(memory_key='memory', return_messages=True, k=3)
        self.master_ai = initialize_agent(
            self.tools,
            self.llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            memory=self.memory,
            verbose=True,
            agent_kwargs=self.agent_kwargs
        )
    
    def load_history_to_memory(self, conversation):
        """ 
        Takes a conversation object and loads the last 6 messages into memory
        """
        # Return out of method if memory already exists
        memory_variables = self.memory.load_memory_variables({})
        if memory_variables and memory_variables.get('memory'):
            return
        
        # load the 3 most recent exchanges into memory
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
                    pairs.append((message, {"content": "This is not a part of your conversation, end of buffer", "message_from": "chatbot"}))
            if len(pairs) == 3:
                break
        pairs.reverse()
        for pair in pairs:
            self.memory.save_context({"input": pair[0]['content']}, {"output": pair[1]['content']})