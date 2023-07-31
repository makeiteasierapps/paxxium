import os
from dotenv import load_dotenv
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from firebase_admin import firestore, credentials
import firebase_admin
from myapp.services.message_service import MessageService
from myapp.services.master_agent_services import MasterAIService
from myapp.services.user_services import UserService
from myapp.services.bot_service import BotService
from myapp.services.conversation_service import ConversationService


# Initialize Firebase
cred = credentials.Certificate('myapp/fb_config/paxxium-firebase-adminsdk-2l9cl-3bb25d079e.json')
firebase_admin.initialize_app(cred)
socketio = SocketIO()

def create_app():

    load_dotenv()
    frontend_url = os.getenv('FRONTEND_URL')
    
    # Create the Flask application
    app = Flask(__name__)
    
    @socketio.on('connect')
    def test_connect():
        print('Client connected')

    @socketio.on('disconnect')
    def test_disconnect():
        print('Client disconnected')

    # Configure CORS
    CORS(app, origins=[frontend_url], supports_credentials=True, allow_headers=['Content-Type', 'Authorization'], methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    # Create the Firestore client
    db = firestore.client()

    # app config settings
    app.config['db'] = db

    app.message_service = MessageService(db)
    app.master_ai_service = MasterAIService(app, app.message_service)
    app.user_service = UserService(db)
    app.bot_service = BotService(db)
    app.conversation_service = ConversationService(db)

    # Register blueprints
    from myapp import views
    views.register_blueprints(app)
    socketio.init_app(app, cors_allowed_origins=frontend_url)

    return app