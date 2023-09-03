# Import necessary libraries
import os
import random
from dotenv import load_dotenv
import requests
from newspaper import Article
from langchain.schema import (
    HumanMessage
)
from langchain.chat_models import ChatOpenAI
import uuid
from flask import current_app

# Load environment variables
load_dotenv()
os.getenv('OPENAI_API_KEY')
apikey = os.getenv('GNEWS_API_KEY')

# Fetch article URLs based on query
def get_article_urls(query):
    # Construct API URL
    url = f"https://gnews.io/api/v4/search?q={query}&lang=en&country=us&max=10&apikey={apikey}"

    try:
        articles = requests.get(url, timeout=10)
    except Exception as exception:
        print(f"Error occurred while fetching articles: {exception}")
        return

    if articles.status_code != 200:
        print(f"Request failed with status code: {articles.status_code}")
        return

    data = articles.json()
    print(data)
    articles = data["articles"]
    article_urls = [article_data["url"] for article_data in articles]
    

    return article_urls


# Summarize articles
def summarize_articles(article_urls):
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

def upload_news_data(uid, news_data_list):
    db = current_app.config['db']
    news_ref = db.collection('users').document(uid).collection('news_articles')
    
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


def get_random_news_articles(uid):
    db = current_app.config['db']
    news_ref = db.collection('users').document(uid).collection('news_articles')
    
    # Get all news articles
    news_articles = news_ref.get()
    
    # Randomly select 7 articles
    random_articles = random.sample(news_articles, 7)
    
    # Extract the article data
    random_news = []
    for article in random_articles:
        article_data = article.to_dict()
        random_news.append(article_data)
    
    return random_news
