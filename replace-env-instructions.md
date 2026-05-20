# Replace .env File Instructions

## Step 1: Backup your current .env file
Copy the content somewhere safe

## Step 2: Replace .env with minimal version
Delete your current .env file and create a new one with ONLY this line:

GROQ_API_KEY=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

## Step 3: Test
Restart the development server and see if the parse error disappears

## Step 4: If error disappears
The issue was with the Firebase configuration lines
We can then add them back one by one to find the problematic line

## Step 5: If error persists
The issue is not with the .env file but with something else
We'll investigate other sources
