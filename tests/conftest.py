import pytest
from flask import Flask, current_app

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
def firebase_service():
    return FirebaseService()

@pytest.fixture
def message_service():
    db = current_app.config['db']
    return MessageService(db)

@pytest.fixture
def master_ai(message_service):
    # You may need to provide any required dependencies for the MasterAI constructor here
    return MasterAI(message_service)
