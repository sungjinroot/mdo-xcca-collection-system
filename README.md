
In case of google SSO errors. 

Please follow these steps to fix the issue. 

Step 1: Go to https://console.cloud.google.com

Step 2: Create a project 

Step 3: Authorize the following origins

    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:5173',

Step 4. Copy the google client id and paste it on the VITE_GOOGLE_CLIENT_ID on the .env file

Step 5. Run docker system prune, and then docker compose up.



