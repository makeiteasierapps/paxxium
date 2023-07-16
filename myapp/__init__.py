from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from firebase_admin import firestore, credentials
import firebase_admin

# Initialize the extension outside the factory function
socketio = SocketIO()
# Initialize Firebase
cred = credentials.Certificate('myapp/paxxium-firebase-adminsdk-2l9cl-3bb25d079e.json')
firebase_admin.initialize_app(cred)

def create_app():
    # Create the Flask application
    app = Flask(__name__)

    # Configure CORS
    CORS(app, supports_credentials=True)

    # Create the Firestore client
    db = firestore.client()

    # Store db in the application config
    app.config['db'] = db

    # Register your blueprints
    from myapp import views
    views.register_blueprints(app)

    socketio.init_app(app, cors_allowed_origins="*")
    return app

