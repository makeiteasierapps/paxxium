import os
from dotenv import load_dotenv
from flask import Flask
from flask_socketio import SocketIO, join_room
from flask_cors import CORS
from firebase_admin import firestore, credentials
import firebase_admin
from myapp.services.message_service import MessageService
from myapp.services.master_agent_services import MasterAgentService
from myapp.services.user_services import UserService
from myapp.services.chat_services import ChatService
from myapp.services.firebase_service import FirebaseService
from myapp.services.news_service import NewsService


# Initialize Firebase
cred = credentials.Certificate('myapp/fb_config/paxxium-firebase-adminsdk-2l9cl-3bb25d079e.json')
firebase_admin.initialize_app(cred)
socketio = SocketIO()

def create_app():

    load_dotenv()
    frontend_url = os.getenv('FRONTEND_URL')
    
    # Create the Flask application
    app = Flask(__name__)
    

    @socketio.on('join')
    def on_join(data):
        room = data['room']
        join_room(room)

    # Configure CORS
    CORS(app, origins=[frontend_url], supports_credentials=True, allow_headers=['Content-Type', 'Authorization'], methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    # Create the Firestore client
    db = firestore.client()

    # app config settings
    app.config['db'] = db

    app.message_service = MessageService(db)
    app.master_agent_service = MasterAgentService(app, app.message_service)
    app.user_service = UserService(db)
    app.firebase_service = FirebaseService()
    app.chat_service = ChatService(db)
    app.news_service = NewsService(db)

    # Register blueprints
    from myapp import views
    views.register_blueprints(app)
    socketio.init_app(app, cors_allowed_origins=frontend_url,)

    return app