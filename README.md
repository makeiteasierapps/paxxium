# Paxxium

Welcome to Paxxium - a playground for experimenting with Large Language Models (LLMs) and building innovative functionality around them. The goal of this project is to create a collaborative space where users can explore, play, and leverage the capabilities of chatbots to enhance productivity and take AI conversations to the next level.

## Project Overview

Paxxium is an ongoing development project, which means it is continually evolving and improving. To stay updated with the latest changes and enhancements, we will strive to maintain this README with relevant information. Currently, we are in the process of wrapping up streaming with code formatting, and this feature will be available soon.

## Getting Started

To run Paxxium locally, follow these steps:

1. **Backend Setup**

   - Place your `.env` file inside the `myapp` directory.

   `.env` contents:

    KMS_KEY_NAME=
    FRONTEND_URL=


  - Make sure to set up a Firebase project with Authentication and Firestore database for data storage and    user management. Additionally, you will need a way to encrypt and decrypt data.

- OpenAI and SerpApi keys are needed and will be added dynamically once registered.

2. **Frontend Setup**

- Place your `.env` file at the root of your project, just outside the `src` directory.

`.env` contents:

  REACT_APP_FIREBASE_API_KEY=

  REACT_APP_FIREBASE_AUTH_DOMAIN=

  REACT_APP_FIREBASE_PROJECT_ID=

  REACT_APP_FIREBASE_STORAGE_BUCKET=

  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=

  REACT_APP_FIREBASE_APP_ID=

  REACT_APP_FIREBASE_MEASUREMENT_ID=

  REACT_APP_BACKEND_URL=


3. **Starting the App**

- Run `python run.py` from the root to start the backend.

- Run `npm start` from the root to start the frontend.

4. **User Registration**

- Sign up for an account to access all the features and be redirected to the main application.

## How to Use

After signing up and accessing the main application, you can explore various AI agents through Paxxium:

- Click "New Chat" to initiate a conversation with one of three AI Agents:
1. GPT 3.5
2. GPT-4
3. AgentDebate

- AgentDebate allows users to pick a topic and set the role for two different AI Agents, making for engaging and interactive discussions.

## Contribution

I welcome contributions from the community. If you encounter any issues or have ideas for improvements, feel free to open an issue or submit a pull request. Together, we can make Paxxium an exceptional platform for experimenting with LLMs and pushing the boundaries of AI conversations and functionality

## License

Feel free to fork and modify it according to your needs.

## Contact

If you have any questions or want to get in touch, you can reach out to the project maintainer at [shaunoffenbacher@yahoo.com](mailto:email@shaunoffenbacher@yahoo.com).

---

*Note: You might need to adjust the contact email, license information, and other placeholders accordingly.*

Additional content suggestions:
- Project architecture overview and explanation of key components.
- A demo video or screenshots to showcase the app's features and usage.
- Detailed instructions for deploying the app to a server or cloud platform.
- A section for frequently asked questions (FAQs) to address common queries.
- A roadmap of planned features and enhancements for the project's future.
- Acknowledgments or credits for any third-party libraries, APIs, or resources used in the project.



