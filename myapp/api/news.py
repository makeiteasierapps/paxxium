from flask import Blueprint, request, current_app
from myapp.services.news_service import get_article_urls, summarize_articles, upload_news_data, get_random_news_articles

news = Blueprint('news', __name__)

def authenticate_request():
    firebase_service = current_app.firebase_service
    id_token = request.headers.get('Authorization')
    decoded_token = firebase_service.verify_id_token(id_token)
    
    if not decoded_token:
        return None
    return decoded_token['uid']

@news.route('/news', methods=['POST'])
def get_news():
    uid = authenticate_request()
    
    if not uid:
        return {'message': 'Invalid token'}, 403
    data = request.get_json()
    query = data['query']
    urls = get_article_urls(query)
    news_data = summarize_articles(urls)
    upload_news_data(uid, news_data)
    
    return news_data, 200

@news.route('/news/load', methods=['GET'])
def load_news():
    uid = authenticate_request()

    if not uid:
        return {'message': 'Invalid token'}, 403
    
    news_data = get_random_news_articles(uid)

    return news_data, 200

