from flask import Flask
from flask_cors import CORS
from firebase_admin import firestore, credentials
import firebase_admin
from myapp.services.message_service import MessageService
from myapp.services.master_ai_services import MasterAIService
from myapp.services.user_services import UserService
from myapp import views


# Initialize Firebase
cred = credentials.Certificate('myapp/fb_config/paxxium-firebase-adminsdk-2l9cl-3bb25d079e.json')
firebase_admin.initialize_app(cred)

def create_app():

    # Create the Flask application
    app = Flask(__name__)

    # Configure CORS
    CORS(app, origins=['http://localhost:3000'], supports_credentials=True, allow_headers=['Content-Type', 'Authorization'], methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    # Create the Firestore client
    db = firestore.client()

    # app config settings
    app.config['db'] = db

    app.message_service = MessageService(db)
    app.master_ai_service = MasterAIService(app, app.message_service)
    app.user_service = UserService(db)

    # Register blueprints
    views.register_blueprints(app)

    return app