from flask import Blueprint, request, current_app

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
    """
        Takes a news query from an AI generated list or from the user. 
        Returns a list of summarized articles.
    """
    #TODO: allow for mulitple word queries, split then add hyphens? Check docs
    uid = authenticate_request()
    ns = current_app.news_service
    
    if not uid:
        return {'message': 'Invalid token'}, 403
    data = request.get_json()
    query = data['query']
    urls = ns.get_article_urls(query)
    news_data = ns.summarize_articles(urls)
    ns.upload_news_data(uid, news_data)
    
    return news_data, 200

@news.route('/news/load', methods=['GET'])
def load_news():
    uid = authenticate_request()
    ns = current_app.news_service

    if not uid:
        return {'message': 'Invalid token'}, 403
    
    news_data = ns.get_all_news_articles(uid)

    return news_data, 200

@news.route('/news_topics', methods=['GET'])
def get_news_topics():
    uid = authenticate_request()
    ns = current_app.news_service

    if not uid:
        return {'message': 'Invalid token'}, 403
    
    news_topics = ns.get_user_news_topics(uid)

    return {'news_topics': news_topics}, 200

@news.route('/news_articles', methods=['PUT', 'DELETE'])
def update_or_delete_news_topics():
    uid = authenticate_request()
    ns = current_app.news_service
    
    if not uid:
        return {'message': 'Invalid token'}, 403
    
    data = request.get_json()
    doc_id = data['articleId']
    if request.method == 'PUT':
        # Update the document
        ns.mark_is_read(uid, doc_id)
        return {'response': 'Updated successfully'}, 200
    
    if request.method == 'DELETE':
        # Delete the document
        ns.delete_news_article(uid, doc_id)
        return {'response': 'Deleted successfully'}, 200