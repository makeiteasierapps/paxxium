from flask import Blueprint, request, jsonify, current_app
from myapp.services.user_services import UserService
signup = Blueprint('signup', __name__)

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
    encrypted_openai_api_key = UserService.encrypt(openai_api_key)
    encrypted_serp_api_key = UserService.encrypt(serp_api_key)

    db.collection('users').document(uid).set({
        'username': username,
        'open_key': encrypted_openai_api_key,
        'serp_key': encrypted_serp_api_key,
        'authorized': authorized,
    })

    return jsonify({'message': 'User added successfully'}), 200

