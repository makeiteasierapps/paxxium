# Paxxium

Welcome to Paxxium - a playground for experimenting with Large Language Models (LLMs) and building innovative functionality around them. The goal of this project is to create a collaborative space where users can explore, play, and leverage the capabilities of chatbots to enhance productivity and take AI conversations to the next level.

## Project Overview

Paxxium is an ongoing development project, which means it is continually evolving and improving. To stay updated with the latest changes and enhancements, I will strive to maintain this README with relevant information. 

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

## Contribution

I welcome contributions from the community. If you encounter any issues or have ideas for improvements, feel free to open an issue or submit a pull request. Together, we can make Paxxium an exceptional platform for experimenting with LLMs and pushing the boundaries of AI conversations and functionality

## License

Feel free to fork and modify it according to your needs.

## Contact

If you have any questions or want to get in touch, you can reach out to me at
[shaunoffenbacher@yahoo.com](mailto:email@shaunoffenbacher@yahoo.com).




