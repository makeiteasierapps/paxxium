from myapp.routes.get_bots_route import get_bots_route
from myapp.routes.start_conversation import start_conversation
from myapp.routes.messages_route import messages
from myapp.routes.get_user_conversations import get_user_conversations
from myapp.routes.delete_conversation import delete_conversation_route
from myapp.routes.debate_route import debate
from myapp.routes.signup import signup
from myapp.routes.check_authorization import auth_check

def register_blueprints(app):
    app.register_blueprint(get_bots_route)
    app.register_blueprint(start_conversation)
    app.register_blueprint(messages)
    app.register_blueprint(get_user_conversations)
    app.register_blueprint(delete_conversation_route)
    app.register_blueprint(debate)
    app.register_blueprint(signup)
    app.register_blueprint(auth_check)
