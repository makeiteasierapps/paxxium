#!/bin/bash

FIREBASE_SERVICE_FILE="../../services/firebase_service.py"
USER_SERVICES_FILE="../../services/user_services.py"

cp "$FIREBASE_SERVICE_FILE" .
cp "$USER_SERVICES_FILE" .

gcloud functions deploy profile \
  --gen2 \
  --runtime=python311 \
  --trigger-http \
  --entry-point=profile \
  --region=us-west1 \
  --source=. \
  --allow-unauthenticated \
  --timeout=540s \