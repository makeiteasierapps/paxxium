import os
import base64
from flask import Blueprint, request, jsonify, current_app
from dotenv import load_dotenv
from google.cloud import kms

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


    @staticmethod
    def encrypt(input_str):
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


    @staticmethod
    def decrypt(key):
        load_dotenv()
        os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

        # Use the KMS API to encrypt the data.
        kms_client = kms.KeyManagementServiceClient()
        kms_key_name = 'projects/paxxium/locations/global/keyRings/agentKeys/cryptoKeys/agents'

        decrypted_key = kms_client.decrypt(request={'name': kms_key_name, 'ciphertext': key,})

        return decrypted_key.plaintext



