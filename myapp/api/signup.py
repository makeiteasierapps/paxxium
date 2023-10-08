from flask import Blueprint, request, jsonify, current_app
signup = Blueprint('signup', __name__)

@signup.route('/signup', methods=['POST'])
def add_user():
    """
    Add a user to Firestore Database
    """

    user_service = current_app.user_service
    
    # Get the request data
    req_data = request.get_json()
    username = req_data.get('username')
    uid = req_data.get('uid')
    openai_api_key = req_data.get('openAiApiKey')
    serp_api_key = req_data.get('serpApiKey')
    authorized = req_data.get('authorized')

    # Encrypt the keys
    encrypted_openai_api_key = user_service.encrypt(openai_api_key)
    encrypted_serp_api_key = user_service.encrypt(serp_api_key)

    # Update the user profile
    data_package = {    
        'username': username,
        'open_key': encrypted_openai_api_key,
        'serp_key': encrypted_serp_api_key,
        'authorized': authorized,}
    
    user_service.update_profile(uid, data_package)
    
    return jsonify({'message': 'User added successfully'}), 200

