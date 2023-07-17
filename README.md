# Paxxium

To spin this up, you will need two .env files.

## Backend

  file location:
  
  <img src="backend.png" alt="Backend" width="300">
  
  env contents:
  
    OPENAI_API_KEY=
  
    SERPAPI_API_KEY=
  
    ACTIVELOOP_TOKEN=

You will also need to set up a Firebase project with authentication and Firestore database. I am willing to share this upon request. The location of where to put that file can be seen in the above photo.

## Frontend

  file location:
  
  <img src="frontend.png" alt="Frontend" width="300">
  
  env contents:
  
    REACT_APP_FIREBASE_API_KEY=
  
    REACT_APP_FIREBASE_AUTH_DOMAIN=
  
    REACT_APP_FIREBASE_PROJECT_ID=
  
    REACT_APP_FIREBASE_STORAGE_BUCKET=
  
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
  
    REACT_APP_FIREBASE_APP_ID=
  
    REACT_APP_FIREBASE_MEASUREMENT_ID=
  
  Again, I am willing to share this upon request.

Starting the app is done by running `python run.py` and `npm start` from the root.

Sign up for an account and be redirected.

Clicking "New Chat" will give the user three AI Agents to choose from: GPT 3.5, GPT-4, or AgentDebate. GPT 3.5 and 4 are clones of Chat-GPT (almost). AgentDebate allows the user to pick a topic and set the role for two different AI Agents.


testing workflow