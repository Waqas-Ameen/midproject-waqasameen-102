# MERN Stack Backend (Node.js & Express)

A complete Node.js + Express backend foundation for a MERN stack application, featuring MongoDB connection, user registration and authentication, and environment variable configuration.

## Folder Structure

```
mern-backend/
├── config/
│   └── db.js               # MongoDB connection logic
├── controllers/
│   └── userController.js   # Request handlers for user routes
├── models/
│   └── User.js             # Mongoose schema and model for User
├── routes/
│   └── userRoutes.js       # Express router definitions for users
├── .env.example            # Example of environment variables needed
├── package.json            # Project metadata and dependencies
├── server.js               # Application entry point
└── vercel.json             # Vercel deployment configuration
```

## Setup Instructions

1. **Install Dependencies**
   Open your terminal in the `mern-backend` directory and run:
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Create a new file named `.env` in the root of `mern-backend`
   - Copy the contents from `.env.example` to your newly created `.env` file
   - Update `MONGO_URI` with your actual MongoDB Atlas connection string.

3. **Running Locally**
   To start the server using Node (standard):
   ```bash
   npm start
   ```
   To start the server using nodemon (helpful for development, automatically restarts on file changes):
   ```bash
   npm run dev
   ```
   The server will run at `http://localhost:5000`

## Available Endpoints

- `GET /` - Root endpoint to check server health
- `POST /api/users/register` - Create a new user (Pass JSON body: `{ "name": "...", "email": "...", "password": "..." }`)
- `POST /api/users/login` - Authenticate an existing user (Pass JSON body: `{ "email": "...", "password": "..." }`)
- `GET /api/users` - Fetch a list of all registered users (Excludes passwords)

## Deployment

### Vercel
This project is pre-configured with a `vercel.json` file.
1. Install Vercel CLI or link this repository to your Vercel Dashboard.
2. Add your environment variables (`MONGO_URI`) in Vercel project settings.
3. Deploy!

### Render
Render natively supports Node.js apps.
1. Connect your repository on Render and create a new Web Service.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add your `MONGO_URI` to Environment Variables under your Render Web Service settings.
