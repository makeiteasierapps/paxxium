from flask import Blueprint, request, current_app
from myapp.services.user_services import UserService
from myapp.services.firebase_service import FirebaseService

auth_check = Blueprint('auth_check', __name__)
firebase_service = FirebaseService()

@auth_check.route('/auth_check', methods=['POST'])
def check_authorization():
    db = current_app.config['db']
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)
    
    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    uid = decoded_token['uid']
    user_service = UserService(db)
    is_authorized = user_service.check_authorization(uid)
    
    return {'authorized': is_authorized}, 200
