# **Library Mongo API**

This is a TypeScript-based RESTful API for a library that uses MongoDB for data storage and Redis for caching.

## **Requirements**

To run this project, you must have the following installed on your system:

- Node.js (v14 or later)
- Docker
- Docker Compose

## **Installation**

1. Clone this repository to your local machine:

```
git clone https://github.com/ankitnag0/library-mongo.git
```

1. Install the required dependencies:

```
cd library-mongo-api
npm install
```

## **Configuration**

The application requires certain environment variables to be set in order to run and the essential ones are preconfigured so you wont have to. You can copy the **`.env.example`** file and rename it to  **`.env`** . ****The **`.env`** file is necessary for the docker.

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/library
JWT_SECRET=bdf5feb119974ea22c4495f613974c014b18b4811898c719b016ada1bced55a4676e67e6d44f65faa474dc9ac1a451a10a5cb73650d7f6294c1a2ed50faeb1dc
JWT_EXPIRATION=1d
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_CACHE_EXPIRATION=3600
```

- **`PORT`**: The port number the app will listen on.
- **`MONGO_URI`**: The URI for connecting to the MongoDB database.
- **`JWT_SECRET`**: The secret key for JWT authentication.
- **`JWT_EXPIRATION`**: The expiration time for JWT tokens.
- **`REDIS_HOST`**: The hostname for connecting to the Redis server.
- **`REDIS_PORT`**: The port number for connecting to the Redis server.
- **`REDIS_CACHE_EXPIRATION`**: The time-to-live (in seconds) for Redis cache entries.

## **Running the Application**

To start the app, first build it and then start:

```
npm run build
npm run start
```

Alternatively, you can run the app in development mode with:

```
npm run dev
```

This will start the app with nodemon, so any changes you make to the code will be automatically detected and the app will be restarted.

## **Docker**

You can use Docker Compose:

```
docker-compose up -d
```

This will start both the app and a Redis container, and expose the app on port 3000.

## **Testing**

To run the tests, use the following command:

```
npm test
```
This will run the Jest test suite, which tests the API endpoints.