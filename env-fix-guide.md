# .env File Fix Guide

## Step 1: Delete your current .env file
## Step 2: Create a new .env file with exactly this content:

VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
GROQ_API_KEY=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

## Step 3: Replace the placeholder Firebase values with your actual values
## Step 4: Save the file
## Step 5: Restart your development server

## IMPORTANT:
- NO quotes around any values
- NO spaces around the = signs
- NO extra characters or parentheses
- One key per line
- No empty lines at the end
