from flask import Blueprint, request, jsonify, current_app

profile = Blueprint('profile', __name__)

def authenticate_request():
    firebase_service = current_app.firebase_service
    id_token = request.headers.get('Authorization')
    decoded_token = firebase_service.verify_id_token(id_token)
    
    if not decoded_token:
        return None
    return decoded_token['uid']

@profile.route('/profile/questions', methods=['GET', 'POST'])
def handle_questions():
    """
    Handle profile questions data in the users collection
    """
    uid = authenticate_request()
    ps = current_app.profile_service

    # Updating profile questions
    if request.method == 'POST':
        ps.update_profile_questions(uid, request.get_json())
        return {'response': 'Profile questions updated successfully'}, 200
        

    # Handling a GET request
    profile_data = ps.load_profile_questions(uid)
    return jsonify(profile_data), 200

@profile.route('/profile', methods=['GET'])
def get_profile():
    """
    Get profile data from the users collection
    """
    uid = authenticate_request()
    us = current_app.user_service
    
    profile_data = us.get_profile(uid)
    
    return jsonify(profile_data), 200

@profile.route('/profile/user', methods=['POST'])
def update_user():
    """
    Update profile data in the users collection
    """
    us = current_app.user_service
    uid = authenticate_request()

    us.update_profile_db(uid, request.get_json())
    
    return {'response': 'Profile updated successfully'}, 200

@profile.route('/profile/analyze', methods=['GET', 'POST'])
def analyze_profile():
    """
    Update profile data in the users collection
    """
    uid = authenticate_request()
    us = current_app.user_service

    if request.method == 'POST':
        parsed_analysis = us.analyze_profile(uid)
        us.update_user_profile(uid, analysis=parsed_analysis['analysis'], news_topics=parsed_analysis['news_topics'])
        return jsonify(parsed_analysis), 200
    
    # GET request
    profile_analysis = us.get_profile_analysis(uid)
    return jsonify(profile_analysis), 200