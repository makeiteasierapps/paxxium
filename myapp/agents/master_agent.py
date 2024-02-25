from openai import OpenAI
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


class StreamResponse(BaseCallbackHandler):
    def __init__(self, chat_id):
        self.chat_id = chat_id

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        from myapp import socketio
        join_room(self.chat_id)
        socketio.emit('token', {'message_from': 'agent', 'content': token, 'chat_id': self.chat_id, 'type': 'stream',}, room=self.chat_id)
        socketio.sleep(0)

class MasterAgent:
    def __init__(self, message_service, uid, chat_id, model="gpt-3.5-turbo-1106", system_prompt="You are a friendly but genuine AI Agent. Don't be annoyingly nice, but don't be rude either.", chat_constants='', user_analysis=''):
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
        self.llm = ChatOpenAI(streaming=True, callbacks=[StreamResponse(self.chat_id)], temperature=0, model=self.model, openai_api_key=self.openai_api_key)
        self.memory=ConversationBufferWindowMemory(memory_key='memory', return_messages=True, k=3)
        self.tools = [
            Tool(
                name="Search",
                func=self.search.run,
                description="Useful for when you need to answer questions about current events.",
            ),
        ]

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

    def __repr__(self):
        return f"<MasterAgent id={self.uid} memory={self.memory.load_memory_variables({})}>"

    def update_llm_instance(self, model, system_prompt):
        self.model = model
        self.system_prompt = system_prompt
        self.llm = ChatOpenAI(streaming=True, callbacks=[StreamResponse(self.chat_id)], temperature=0, model=self.model, openai_api_key=self.openai_api_key)
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
        content = message_obj['content']
        message_content = f'***USER ANALYSIS***\n{self.user_analysis}\n***THINGS TO REMEMBER***\n{self.chat_constants}\n**************\n{content}'
        response = self.master_ai.run(message_content)                                 
        response_obj = self.message_service.create_message(conversation_id=conversation_id, message_from='agent', user_id=user_id, message_content=response)
        
        return response_obj
    
    def pass_to_vision_model(self, new_message, conversation_id, uid):
        from myapp import socketio
        client = OpenAI()

        image_url = new_message['image_url']
        user_message = new_message['content']
        response = client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_message},
                        {
                            "type": "image_url",
                            "image_url": image_url,
                        },
                    ],
                }
            ],
            max_tokens=300,
            stream=True,
        )

        complete_response = ""
        join_room(self.chat_id)
        for chunk in response:
            for choice in chunk.choices:
                if choice.delta.content is None:
                    continue
                complete_response += choice.delta.content
                socketio.emit('token', {'message_from': 'agent', 'content': choice.delta.content, 'chat_id': self.chat_id, 'type': 'stream',}, room=self.chat_id)
                socketio.sleep(0)
        
        response_obj = self.message_service.create_message(conversation_id=conversation_id, message_from='agent', user_id=uid, message_content=complete_response)
        # add memory to agent
        self.memory.save_context({"input": new_message['content']}, {"output": complete_response})
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

        # Get the last 6 messages, maintaining their natural order
        last_six_messages = conversation['messages'][-6:]

        for index in range(0, len(last_six_messages), 2):
            if index + 1 < len(last_six_messages):
                input_message = last_six_messages[index]['content']
                output_message = last_six_messages[index + 1]['content']
                self.memory.save_context({"input": input_message}, {"output": output_message})
        print("Last 6 messages loaded into memory")

