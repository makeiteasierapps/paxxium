import os
import base64
from flask import Blueprint, request, jsonify, current_app
from dotenv import load_dotenv
from google.cloud import kms

signup = Blueprint('signup', __name__)


def encrypt(input_str):
    print("Encrypting")
    load_dotenv()
    os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

    # Convert the input string to bytes
    plaintext_bytes = input_str.encode('utf-8')
    plaintext_crc32c = crc32c(plaintext_bytes)

    # Use the KMS API to encrypt the data.
    kms_client = kms.KeyManagementServiceClient()
    kms_key_name = 'projects/paxxium/locations/global/keyRings/agentKeys/cryptoKeys/agents/cryptoKeyVersions/1'
    encrypt_response = kms_client.encrypt(request={'name': kms_key_name, 'plaintext': plaintext_bytes, 'plaintext_crc32c': plaintext_crc32c})

    # Integrity verification on encrypt_response.
    if not encrypt_response.verified_plaintext_crc32c:
        raise Exception("The request sent to the server was corrupted in-transit.")
    if not encrypt_response.ciphertext_crc32c == crc32c(encrypt_response.ciphertext):
        raise Exception(
            "The response received from the server was corrupted in-transit."

        )

    # Parse it to a type that firebase likes, plus make decrypting easier
    ciphertext = encrypt_response.ciphertext
    ciphertext_str = base64.b64encode(ciphertext).decode('utf-8')

    return ciphertext_str



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


@signup.route('/signup', methods=['POST'])
def add_user():
    """
    Add a user to Firestore Database
    """

    db = current_app.config['db']
    # Get the request data
    req_data = request.get_json()
    username = req_data.get('username')
    uid = req_data.get('uid')
    openai_api_key = req_data.get('openAiApiKey')
    serp_api_key = req_data.get('serpApiKey')
    authorized = req_data.get('authorized')

    # Encrypt the keys
    encrypted_openai_api_key = encrypt(openai_api_key)

    encrypted_serp_api_key = encrypt(serp_api_key)

    db.collection('users').document(uid).set({
        'username': username,
        'openAiApiKey': encrypted_openai_api_key,
        'serpApiKey': encrypted_serp_api_key,
        'authorized': authorized,
    })

    return jsonify({'message': 'User added successfully'}), 200

