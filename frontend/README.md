# Rewind Setup Guide

Rewind is a media backlog app built with a React/Vite frontend, an Express backend, a MySQL database, and TMDB for movie data.

## Prerequisites

Before running the project, install:

- Node.js and npm
- MySQL
- A TMDB API key

You can check that Node and npm are installed with:

```bash
node -v
npm -v
```

You can check that MySQL is installed with:

```bash
mysql --version
```

## Project Structure

```text
CS35L-Project/
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── schema.sql
│   ├── routes/
│   ├── models/
│   └── services/
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## 1. Clone or Download the Project

Clone the repository, or download and unzip the project folder.

```bash
cd CS35L-Project
```

## 2. Set Up the Database

Start MySQL, then run the schema file from the project root:

```bash
mysql -u root -p < backend/schema.sql
```

This creates the `backlog_db` database and the required tables.

## 3. Set Up Backend Environment Variables

Go into the backend folder:

```bash
cd backend
```

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder values:

```env
TMDB_API_KEY=your_tmdb_api_key_here
PORT=3000
NODE_ENV=development
DATABASE_URL=mysql://root:your_mysql_password@localhost:3306/backlog_db
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

To generate a secure token secret, you can run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Use one generated value for `ACCESS_TOKEN_SECRET` and another generated value for `REFRESH_TOKEN_SECRET`.

## 4. Install and Run the Backend

From the `backend` folder, install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run devStart
```

The backend should run on:

```text
http://localhost:3000
```

## 5. Install and Run the Frontend

Open a second terminal window. From the project root, go into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

Open that URL in your browser.

## 6. Quick Backend Test

With the backend running, test the TMDB route in a browser or terminal:

```bash
curl "http://localhost:3000/api/movies/trending"
```

If the TMDB API key is working, you should get movie data back.

You can also create a test user:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

Then log in:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

A successful login returns an access token.

## Common Issues

### `DATABASE_URL is required`

Make sure you created `backend/.env` and added a valid `DATABASE_URL`.

### `Access denied for user 'root'`

Your MySQL password in `DATABASE_URL` is probably wrong. Update this part:

```env
DATABASE_URL=mysql://root:your_mysql_password@localhost:3306/backlog_db
```

### `Unknown database 'backlog_db'`

Run the database setup again:

```bash
mysql -u root -p < backend/schema.sql
```

### TMDB route returns an error

Check that `TMDB_API_KEY` in `backend/.env` is correct.

### Port already in use

If port `3000` is already being used, change the backend port in `backend/.env`:

```env
PORT=3001
```

Then restart the backend.

## Useful Commands

Backend:

```bash
cd backend
npm install
npm run devStart
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

Preview frontend build:

```bash
cd frontend
npm run preview
```

Run frontend linting:

```bash
cd frontend
npm run lint
```

## Notes for Developers

- Do not commit `.env` files.
- Do not commit `node_modules`.
- The backend stores users and saved media in MySQL.
- Passwords are hashed with bcrypt before being stored.
- Login uses JWT access tokens.
- Movie data comes from TMDB through the backend routes.
