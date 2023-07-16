from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from firebase_admin import firestore, credentials
import firebase_admin

app = Flask(__name__)
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")


cred = credentials.Certificate('myapp/paxxium-firebase-adminsdk-2l9cl-3bb25d079e.json')
firebase_app = firebase_admin.initialize_app(cred)

db = firestore.client()

def create_app():
    from myapp import views
    views.register_blueprints(app)
    return app
