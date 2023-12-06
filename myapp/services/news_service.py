import os
from dotenv import load_dotenv
import requests
from newspaper import Article
from langchain.schema import (
    HumanMessage
)
from langchain.chat_models import ChatOpenAI
import uuid


load_dotenv()
os.getenv('OPENAI_API_KEY')

class NewsService:
    def __init__(self, db):
        self.db = db
        self.apikey = os.getenv('GNEWS_API_KEY')

    # Fetch article URLs based on query
    def get_article_urls(self, query):
        # Construct API URL
        url = f"https://gnews.io/api/v4/search?q={query}&lang=en&country=us&max=10&apikey={self.apikey}"

        try:
            articles = requests.get(url, timeout=10)
        except Exception as exception:
            print(f"Error occurred while fetching articles: {exception}")
            return

        if articles.status_code != 200:
            print(f"Request failed with status code: {articles.status_code}")
            return

        data = articles.json()
        articles = data["articles"]
        article_urls = [article_data["url"] for article_data in articles]
        

        return article_urls


    # Summarize articles
    def summarize_articles(self, article_urls):
        summarized_articles = []

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
        }

        session = requests.Session()

        for article_url in article_urls:
            try:
                response = session.get(article_url, headers=headers, timeout=10)
                article = Article(article_url)
                article.download()
                article.parse()
            except Exception as exception:
                print(f"Error occurred while fetching article at {article_url}: {exception}")
                continue

            if response.status_code != 200:
                print(f"Failed to fetch article at {article_url}")
                continue

            # Extract article data
            article_title = article.title
            article_text = article.text

            # Prepare prompt template
            template = """You are a very good assistant that summarizes online articles.

            Here's the article you want to summarize.

            ==================
            Title: {article_title}

            {article_text}
            ==================

            Write a summary of the previous article.
            """

            prompt = template.format(article_title=article_title, article_text=article_text)

            messages = [HumanMessage(content=prompt)]

            chat = ChatOpenAI(model_name="gpt-3.5-turbo-0613", temperature=0)

            # Generate summary using chat model
            summary = chat(messages)
            unique_id = str(uuid.uuid4())

            # Create article dictionary
            article_dict = {
                'id': unique_id,
                'title': article_title,
                'summary': summary.content,
                'image': article.top_image,
                'url': article_url
            }

            summarized_articles.append(article_dict)

        return summarized_articles

    def upload_news_data(self, uid, news_data_list):
        news_ref = self.db.collection('users').document(uid).collection('news_articles')
        
        for news_data in news_data_list:
            url = news_data['url']
            
            # Check if the URL already exists in the collection
            query = news_ref.where('url', '==', url).limit(1).get()
            
            if len(query) == 0:
                # URL does not exist, add the news_data to the collection
                news_ref.add(news_data)
            else:
                # URL already exists, skip adding it
                print(f"URL '{url}' already exists, skipping...")


    def get_all_news_articles(self, uid):
        news_ref = self.db.collection('users').document(uid).collection('news_articles')
        
        # Get all news articles
        news_articles = news_ref.get()
        
        # Extract the article data
        all_news = []
        for article in news_articles:
            article_data = article.to_dict()
            all_news.append(article_data)
        
        return all_news

    def get_user_news_topics(self,uid):
        user_ref = self.db.collection('users').document(uid)
        user = user_ref.get()
        if user.exists:
            return user.to_dict().get('news_topics', [])

        return []

    def mark_is_read(self, uid, doc_id):
        articles_ref = self.db.collection('users').document(uid).collection('news_articles')

        try:
            # Query for the document with the matching 'id' field
            articles = articles_ref.where('id', '==', doc_id).get()

            if not articles:
                return "No matching document found"

            # There should only be one matching document, so get the first one
            article_ref = articles[0].reference

            # Update or create the 'is_read' field
            article_ref.set({'is_read': True}, merge=True)
            return "Update successful"
        except Exception as e:
            return f"Update failed: {str(e)}"

    def delete_news_article(self, uid, doc_id):
        articles_ref = self.db.collection('users').document(uid).collection('news_articles')
        
        try:
            # Query for the document with the matching 'id' field
            articles = articles_ref.where('id', '==', doc_id).get()

            if not articles:
                return "No matching document found"

            # There should only be one matching document, so get the first one
            article_ref = articles[0].reference

            # Delete the document
            article_ref.delete()
            return "Deletion successful"
        except Exception as e:
            return f"Deletion failed: {str(e)}"