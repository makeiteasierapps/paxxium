import os
import pprint
import tiktoken
from datetime import datetime
from canopy.knowledge_base.chunker.token_chunker import TokenChunker
from canopy.tokenizer import Tokenizer
from canopy.models.data_models import Document
from canopy.knowledge_base import KnowledgeBase
from canopy.knowledge_base.record_encoder import OpenAIRecordEncoder
from canopy.models.data_models import Query
import fitz
from flask import jsonify
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from firebase_admin import firestore, credentials, initialize_app
from pinecone import Pinecone


load_dotenv()
Tokenizer.initialize()
pinecone = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
cred = None
if os.getenv('LOCAL_DEV') == 'True':
    from .firebase_service import FirebaseService
    from .BossAgent import BossAgent
    from .user_services import UserService
    cred = credentials.Certificate(os.getenv('FIREBASE_ADMIN_SDK'))
else:
    from firebase_service import FirebaseService
    from BossAgent import BossAgent
    from user_services import UserService
    cred = credentials.ApplicationDefault()

try:
    initialize_app(cred, {
        'projectId': 'paxxiumv1',
        'storageBucket': 'paxxiumv1.appspot.com'
    })
except ValueError:
    pass

db = firestore.client()
firebase_service = FirebaseService()
user_service = UserService(db)

class ContentScraper:
    @staticmethod
    def scrape_site(url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'lxml')
        except Exception as e:
            print(f"Error scraping site: {e}")
            return None

    @staticmethod
    def extract_content(soup):
        if soup is None:
            return ""
        # Try to detect and use the main content area to reduce nav/footer content.
        main_content_selectors = ['main', 'article', 'div#content', 'div.content']
        main_content = None
        for selector in main_content_selectors:
            main_content = soup.select_one(selector)
            if main_content:
                break  # Stop if we find a main content area
        
        if not main_content:
            main_content = soup  # Fallback to entire soup if no main content detected

        content_list = []  # Store all sections
        current_section = None
        all_content_str = ""  # For final single string output
        encountered_content = set()  # Track encountered content to avoid duplicates

        # Focus on tags that are less likely to be nested or contain duplicates
        for tag in main_content.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'span']):
            # Skip likely nav/footer tags based on their class or id
            if any(keyword in ' '.join(tag.get('class', [])) + tag.get('id', '') for keyword in ['nav', 'footer']):
                continue

            # Create a hash of the tag's text and name to check for duplicates
            tag_content_hash = hash((tag.name, tag.get_text(separator=' ', strip=True)))
            if tag_content_hash in encountered_content:
                continue
            encountered_content.add(tag_content_hash)

            # Process text and links if any
            text = tag.get_text(separator=' ', strip=True)
            href = tag.get('href', '')
            full_text = f'{text} {href}'.strip() if href else text

            if full_text:
                if tag.name.startswith('h') and tag.name[1:].isdigit():
                    current_section = {'title': full_text, 'content': []}
                    content_list.append(current_section)
                    all_content_str += "\n\n" + full_text + "\n"  # New section in final string
                else:
                    if current_section is None:
                        current_section = {'title': 'General', 'content': []}
                        content_list.append(current_section)
                    current_section['content'].append(full_text)
                    all_content_str += full_text + " "  # Continue current section content   
        return all_content_str

def handle_fetch_projects(request):
    headers = {"Access-Control-Allow-Origin": "*"}
    id_token = request.headers.get('Authorization')
    if not id_token:
        return jsonify({'message': 'Missing token'}), 403, headers
    
    decoded_token = firebase_service.verify_id_token(id_token)
    uid = decoded_token['uid']
    if not decoded_token:
        return jsonify({'message': 'Invalid token'}), 403, headers

    projects_ref = db.collection('users').document(uid).collection('projects')
    projects = projects_ref.get()
    project_list = [{'id': project.id, **project.to_dict()} for project in projects]
    return jsonify({'projects': project_list}), 200, headers

def cors_preflight_response():
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT, PATCH",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Max-Age": "3600",
    }
    return ("", 204, headers)

def handle_scrape(request):
    headers = {"Access-Control-Allow-Origin": "*"}
    id_token = request.headers.get('Authorization')
    if not id_token:
        return jsonify({'message': 'Missing token'}), 403, headers
    
    decoded_token = firebase_service.verify_id_token(id_token)
    uid = decoded_token['uid']
    if not decoded_token:
        return jsonify({'message': 'Invalid token'}), 403, headers

    data = request.get_json()
    url = data.get('url')
    project_name = data.get('projectName')
    project_id = data.get('projectId')
    if not url:
        return jsonify({'message': 'URL is required'}), 400, headers

    soup = ContentScraper.scrape_site(url)
    content = ContentScraper.extract_content(soup)

    encoding = tiktoken.get_encoding("cl100k_base")
    tokens_per_message = 3
    num_tokens = 0
    num_tokens += tokens_per_message
    num_tokens += len(encoding.encode(content))

    # Storing the entire text in firestore along with the token count. For certain token counts it might be better
    # to feed the raw text. Either way storing the raw text allows for flexibility in the future.
    url_collection_ref = db.collection('users').document(uid).collection('projects').document(project_id).collection('urls')
    url_collection_ref.add({'url': url, 'content': content, 'created_at': datetime.utcnow(), 'token_count': num_tokens})
    
    # add to pinecone
    encoder = OpenAIRecordEncoder(model_name="text-embedding-3-small")
    kb = KnowledgeBase(index_name=project_name, record_encoder=encoder)
    kb.connect()
    docs = [Document(id='doc1', text=content, metadata={'url': url})]
    kb.upsert(docs)
    
    return jsonify({'message': 'Scraped and added to project'}), 200, headers

def handle_extract(request):
    headers = {"Access-Control-Allow-Origin": "*"}
    id_token = request.headers.get('Authorization')
    if not id_token:
        return jsonify({'message': 'Missing token'}), 403, headers
    
    decoded_token = firebase_service.verify_id_token(id_token)
    uid = decoded_token['uid']
    if not decoded_token:
        return jsonify({'message': 'Invalid token'}), 403, headers
    
    file = request.files.get('file')
    if not file:
        return jsonify({'message': 'No file part'}), 400, headers

    project_name = request.form.get('projectName')
    project_id = request.form.get('projectId')

    if not project_name:
        return jsonify({'message': 'Project name is required'}), 400, headers

    
    # Check if the file is a PDF
    if not file.filename.endswith('.pdf'):
        return jsonify({'message': 'File is not a PDF'}), 400, headers
    
    try:
        # Load the PDF file
        doc = fitz.open(stream=file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        file_name = file.filename

        encoding = tiktoken.get_encoding("cl100k_base")
        tokens_per_message = 3
        num_tokens = 0
        num_tokens += tokens_per_message
        num_tokens += len(encoding.encode(text))
        doc_collection_ref = db.collection('users').document(uid).collection('projects').document(project_id).collection('docs')
        doc_collection_ref.add({'content': text, 'name': file_name, 'token_count': num_tokens, 'created_at': datetime.utcnow()})
        encoder = OpenAIRecordEncoder(model_name="text-embedding-3-small")
        kb = KnowledgeBase(index_name=project_name, record_encoder=encoder)
        kb.connect()
        docs = [Document(id='doc1', text=text, metadata={'title': file_name})]
        kb.upsert(docs)
        return jsonify({'message': 'Extracted', 'text': text}), 200, headers
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return jsonify({'message': 'Failed to extract text'}), 500, headers
    
def create_new_project(request):
    headers = {"Access-Control-Allow-Origin": "*"}
    id_token = request.headers.get('Authorization')
    if not id_token:
        return jsonify({'message': 'Missing token'}), 403, headers
    
    decoded_token = firebase_service.verify_id_token(id_token)
    uid = decoded_token['uid']

    if not decoded_token:
        return jsonify({'message': 'Invalid token'}), 403, headers
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    print(f"Creating new project: {name}, {description}")
    

    encoder = OpenAIRecordEncoder(model_name="text-embedding-3-small")
    kb = KnowledgeBase(index_name=name, record_encoder=encoder)
    kb.create_canopy_index()
    index_name = kb.index_name
    # Create a new document in firebase firestore
    project_details = {
            'name': index_name,
            'description': description,
            'created_at': datetime.utcnow()
        }
    new_project_ref = db.collection('users').document(uid).collection('projects').add(project_details)
    new_project_id = new_project_ref[1].id
    return jsonify({'message': 'Project created', 'project_id': new_project_id, 'project_name': index_name}), 200, headers

def project(request):
    if request.method == "OPTIONS":
        return cors_preflight_response()
    
    if request.path in ('/', '/projects'):
        return handle_fetch_projects(request)
    
    if request.path in ('/scrape', '/projects/scrape'):
        return handle_scrape(request)

    if request.path in ('/extract', '/projects/extract'):
        return handle_extract(request)
    
    if request.path in ('/create', '/projects/create'):
        return create_new_project(request)