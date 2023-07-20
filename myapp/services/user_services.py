class UserService:
    def __init__(self, db):
        self.db = db

    def check_authorization(self, user_id):
        user_doc = self.db.collection('users').document(user_id).get()
        return user_doc.to_dict()['authorized']