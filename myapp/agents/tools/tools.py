from typing import Optional, Type
from langchain.callbacks.manager import CallbackManagerForToolRun
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

class SaveMessageSchema(BaseModel):
    value: str = Field(description="should be the message the user wants to save, get the message from your memory")
    memory: str = Field(description="The chat history to be passed to the tool")

class SaveMessageTool(BaseTool):
    name = "save_message"
    description = "Takes the conversation history from the memory in the chain, and saves it"
    args_schema: Type[SaveMessageSchema] = SaveMessageSchema
    memory: Optional[str] = Field(None, description="The chat history to be passed to the tool")

    def __init__(self, memory):
        super().__init__()
        self.memory = memory

    def _run(
        self,
        value: str,
        memory: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
        ) -> str:
        """Use the tool."""
        loaded_memory = self.memory.load_memory_variables({})
        print(value)
        print(loaded_memory)
        return 'Processed memory'
    
    async def _arun(
        self,
        value: str,
        memory: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
        ) -> str:
        """Use the tool asynchronously."""
        loaded_memory = self.memory.load_memory_variables({})
        print(value)
        print(loaded_memory)
        raise NotImplementedError("custom_search does not support async")






# from pydantic import BaseModel, Field
# from langchain.tools import tool
# from langchain import OpenAI
# from typing import List, Tuple
# from langchain import debug



# @tool("save_message", return_direct=True, args_schema=ConversationMemoryInput)
# def save_message(value: str) -> str:
#     """Takes the conversation history from the memory in the chain."""
#     print(value)
#     return "Processed memory"


# class PrintMemoryTool():
#     input_schema = ConversationMemoryInput

#     def run(self, tool_input):
#         value = tool_input.value
#         memory = tool_input.memory
#         print(value)
#         print(memory)