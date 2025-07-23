# Worksheet Backend

A Node.js/Express backend for the Worksheet App with MongoDB, JWT authentication, and PDF upload support.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file (see `.env` example in this repo).
3. Start MongoDB locally or use a MongoDB Atlas connection string.
4. Start the server:
   ```sh
   npm start
   ```

## Folder Structure
- `models/` — Mongoose models for Admin and Worksheet
- `routes/` — Express route handlers for auth, worksheet CRUD, and admin management
- `middleware/` — JWT authentication middleware
- `uploads/` — Uploaded PDF files

## API Endpoints
- `/api/admin/login` — Admin login
- `/api/admin/register` — (Optional) Register a new admin
- `/api/admin/pdfs/upload` — Upload a new worksheet PDF (protected)
- `/api/admin/pdfs` — List, edit, delete worksheets (protected)
- `/api/admin/admins` — Manage admin accounts (protected)
- `/api/worksheets` — Public worksheet endpoints (list, detail, popular, recent)

## Notes
- Use JWT tokens for protected routes (send as `Authorization: Bearer <token>`)
- Make sure the `uploads/` directory exists for file uploads 