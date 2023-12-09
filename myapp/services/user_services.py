import os
import base64
from dotenv import load_dotenv
from google.cloud import kms
from google.cloud import firestore
from langchain.chains import LLMChain
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.chat_models import ChatOpenAI

from myapp.services.profile_services import ProfileService as ps

class UserService:
    def __init__(self, db):
        self.db = db


    def check_authorization(self, user_id):
        user_doc = self.db.collection('users').document(user_id).get()
        
        return user_doc.to_dict()['authorized']


    def get_keys(self, user_id):
        user_doc = self.db.collection('users').document(user_id).get()
        
        return user_doc.to_dict()['open_key'], user_doc.to_dict()['serp_key']


    @staticmethod
    def crc32c(data: bytes) -> int:
        """
        Calculates the CRC32C checksum of the provided data.

        Args:
            data: the bytes over which the checksum should be calculated.

        Returns:
            An int representing the CRC32C checksum of the provided bytes.
        """
        import crcmod  # type: ignore
        import six  # type: ignore

        crc32c_fun = crcmod.predefined.mkPredefinedCrcFun("crc-32c")
        
        return crc32c_fun(six.ensure_binary(data))

    def encrypt(self, input_str):
        load_dotenv()
        os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

        # Convert the input string to bytes
        plaintext_bytes = input_str.encode('utf-8')
        plaintext_crc32c = UserService.crc32c(plaintext_bytes)

        # Use the KMS API to encrypt the data.
        kms_client = kms.KeyManagementServiceClient()
        kms_key_name = 'projects/paxxium/locations/global/keyRings/agentKeys/cryptoKeys/agents/cryptoKeyVersions/1'
        encrypt_response = kms_client.encrypt(request={'name': kms_key_name, 'plaintext': plaintext_bytes, 'plaintext_crc32c': plaintext_crc32c})
      
        # Integrity verification on encrypt_response.
        if not encrypt_response.verified_plaintext_crc32c:
            raise Exception("The request sent to the server was corrupted in-transit.")
        if not encrypt_response.ciphertext_crc32c == UserService.crc32c(encrypt_response.ciphertext):
            raise Exception("The response received from the server was corrupted in-transit.")

        # Parse it to a type that firebase likes, plus make decrypting easier
        ciphertext = encrypt_response.ciphertext
        ciphertext_str = base64.b64encode(ciphertext).decode('utf-8')

        return ciphertext_str


    def decrypt(self, key):
        load_dotenv()
        os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        
        # Use the KMS API to encrypt the data.
        kms_client = kms.KeyManagementServiceClient()
        kms_key_name = os.environ.get("KMS_KEY_NAME")
        decrypted_key = kms_client.decrypt(request={'name': kms_key_name, 'ciphertext': key,})

        return decrypted_key.plaintext

    def update_profile_db(self, uid, updates):
        self.db.collection('users').document(uid).set(updates, merge=True)
        
        return {'message': 'User updated successfully'}, 200


    def get_profile(self, uid):
        user_doc = self.db.collection('users').document(uid).get(['first_name', 'last_name', 'username'])
        
        return user_doc.to_dict()

    @staticmethod
    def extract_data_for_prompt(answers):
        """ 
        Extracts the data from the answers dictionary and formats it for the prompt
        """
        prompt = ''
        for category, questions in answers.items():
            for question, answer in questions.items():
                prompt += f'{category}: {question} - Answer: {answer}\n'
        
        return prompt
    
    @staticmethod
    def analyze_profile(uid):
        """
        Generates an analysis of the user's profile
        """
        
        q_a = ps.load_profile_questions(uid)
        prompt = UserService.extract_data_for_prompt(q_a)


        model = ChatOpenAI(temperature=0.7, model='gpt-4-0613')
        response_schemas = [
            ResponseSchema(name="analysis", description="provide a personality analysis of the user based on their answers to the questions. Do not simply summarize the answers, but provide a unique analysis of the user."),
            ResponseSchema(name="news_topics", description="Should be a list of queries that are one or two words and be a good query parameter for calling a news API. Your topics should be derived from your analyis. Example formats: 2 words - Rock climbing - 1 word -AI"),
            # ResponseSchema(name="skills_assessment", description="Based on the user's answers around things they are learning, provide a list of 10 questions to gauge their skill level in the topic. Example: If the user says they are learning *Skill*, ask them to rate their skill level from 1-10.")
        ]
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)

        format_instructions = output_parser.get_format_instructions()

        chat_prompt_template = ChatPromptTemplate(
            messages=[HumanMessagePromptTemplate.from_template("Here are the users answers to the questions:\n{format_instructions}\n{q_a}")],
            partial_variables={"format_instructions": format_instructions},
            output_parser=output_parser,
        )

        llm_chain = LLMChain(llm=model, prompt=chat_prompt_template, output_parser=output_parser)

        response = llm_chain({"q_a": prompt, "format_instructions": format_instructions})

        parsed_response = response['text']
        return parsed_response
    
    def get_profile_analysis(self, uid):
        user_doc = self.db.collection('users').document(uid).get(['analysis'])
        
        return user_doc.to_dict()
    
    def update_user_profile(self, uid, analysis=None, news_topics=None):
        user_ref = self.db.collection('users').document(uid)
        updates = {}
        if analysis:
            updates['analysis'] = analysis
        if news_topics:
            news_topics_list = [topic.lower().strip() for topic in news_topics.split(',')]
            updates['news_topics'] = firestore.ArrayUnion(news_topics_list)
        user_ref.update(updates)