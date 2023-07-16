from firebase_admin import auth

class FirebaseService:
    @staticmethod
    def verify_id_token(id_token):
        try:
            return auth.verify_id_token(id_token)
        except ValueError:
            return None

    @staticmethod
    def get_user(uid):
        try:
            return auth.get_user(uid)
        except auth.UserNotFoundError:
            return None
