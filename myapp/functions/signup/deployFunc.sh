#!/bin/bash

FIREBASE_SERVICE_FILE="../../services/firebase_service.py"
USER_SERVICES_FILE="../../services/user_services.py"
PROFILE_SERVICE_FILE="../../services/profile_service.py"

cp "$FIREBASE_SERVICE_FILE" .
cp "$USER_SERVICES_FILE" .
cp "$PROFILE_SERVICE_FILE" .

gcloud functions deploy signup \
  --gen2 \
  --runtime=python311 \
  --trigger-http \
  --entry-point=signup_manager \
  --region=us-west1 \
  --source=. \
  --allow-unauthenticated \
  --timeout=540s \