from myapp.api.messages import messages
from myapp.api.debate import debate
from myapp.api.signup import signup
from myapp.api.check_authorization import auth_check
from myapp.api.chat import chat
from myapp.api.news import news
from myapp.api.profile import profile

def register_blueprints(app):
    app.register_blueprint(messages)
    app.register_blueprint(debate)
    app.register_blueprint(signup)
    app.register_blueprint(auth_check)
    app.register_blueprint(chat)
    app.register_blueprint(news)
    app.register_blueprint(profile)
