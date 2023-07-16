from flask import Blueprint, request
from myapp.services.bot_service import BotService
from myapp import db
from myapp.services.firebase_service import FirebaseService

get_bots_route = Blueprint('get_bots', __name__)
bot_service = BotService(db)
firebase_service = FirebaseService()

@get_bots_route.route('/get_bots', methods=['GET'])
def get_bots():
    id_token = request.headers['Authorization']
    decoded_token = firebase_service.verify_id_token(id_token)
    
    if not decoded_token:
        return {'message': 'Invalid token'}, 403

    service = BotService(db)
    bots = service.get_bot_profiles()
    return bots, 200
