import pytest
from flask import current_app
from myapp.services.message_service import MessageService
from myapp.services.firebase_service import FirebaseService
from myapp.agents.master_ai import MasterAI
from myapp import create_app

@pytest.fixture
def app():
    app = create_app()
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def config(app):
    app.config['SERVER_NAME'] = 'localhost:5000'
    app.config['APPLICATION_ROOT'] = '/'
    app.config['PREFERRED_URL_SCHEME'] = 'http'
    return app.config

@pytest.fixture
def firebase_service():
    return FirebaseService()

@pytest.fixture
def message_service(app):
    with app.app_context():
        db = current_app.config['db']
        return MessageService(db)

@pytest.fixture
def master_ai(message_service):
    # You may need to provide any required dependencies for the MasterAI constructor here
    return MasterAI(message_service)
