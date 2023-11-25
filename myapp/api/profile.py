from flask import Blueprint, request, jsonify, current_app
from myapp.services.profile_services import ProfileService as ps
from myapp.services.user_services import UserService as us

profile = Blueprint('profile', __name__)

def authenticate_request():
    firebase_service = current_app.firebase_service
    id_token = request.headers.get('Authorization')
    decoded_token = firebase_service.verify_id_token(id_token)
    
    if not decoded_token:
        return None
    return decoded_token['uid']

@profile.route('/profile/update-questions', methods=['POST'])
def update_questions():
    """
    Add profie data to the users collection
    """
    # Get the request data
    uid = authenticate_request()
    ps.update_profile_questions(uid, request.get_json())
    parsed_analysis = us.analyze_profile(uid)
    user_service = current_app.user_service
    user_service.update_news_topics(uid, parsed_analysis['news_topics'])

    return jsonify(parsed_analysis), 200

@profile.route('/profile/get-questions', methods=['GET'])
def get_questions():
    """
    Get profile data from the users collection
    """
    uid = authenticate_request()
    profile_data = ps.load_profile_questions(uid)
    
    return jsonify(profile_data), 200

@profile.route('/profile', methods=['GET'])
def get_profile():
    """
    Get profile data from the users collection
    """

    user_service = current_app.user_service
    uid = authenticate_request()
    profile_data = user_service.get_profile(uid)
    
    return jsonify(profile_data), 200

@profile.route('/profile/update', methods=['POST'])
def update_profile():
    """
    Update profile data in the users collection
    """
    user_service = current_app.user_service
    uid = authenticate_request()
    user_service.update_profile(uid, request.get_json())
    
    return jsonify({'message': 'Profile updated successfully'}), 200