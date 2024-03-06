#!/bin/bash

# Deploy the auth_check function to Google Cloud Functions
gcloud functions deploy debate \
  --gen2 \
  --runtime=python311 \
  --trigger-http \
  --entry-point=debate_manager \
  --region=us-west1 \
  --source=. \
  --allow-unauthenticated \
  --timeout=540s \