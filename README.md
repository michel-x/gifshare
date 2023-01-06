# Installation guide

# Firebase Setup
- Create a firebase project
- Create a new web application in your firebase project
- Create a service account

# Backend Setup
## Setup configs
- Move in the api directory

        cd backend/api

- Create a .env file in the root of the api directory

        touch .env

- Copy the content of the .env.example file in the .env file

        cat .env.example > .env

- Set the value of variables in the .env by copying values from the **service account** and choose the port used by your backend.
## Run locally
- Install the packages

        npm install

- Run in development mode

        npm run dev


# Frontend Setup
## Setup configs
- Move in the client directory

        cd client

- Create a .env file 

        touch .env

- Copy the content of the .env.example file in the .env file

        cat .env.example > .env

- Set the value of variables in the .env by using the firebase config values of your **web application**
- In .env Specify the api's base url by setting the variable **VITE_API_BASE_URL**
## Run locally
- Install the packages

        npm install

- Run in development mode

        npm run dev
    


