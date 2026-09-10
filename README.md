# Store Rating Platform

A full-stack web application that allows users to submit ratings for stores. Built with Express.js, React, Prisma ORM, and PostgreSQL.

## Tech Stack

- **Backend**: Express.js, Node.js
- **Frontend**: React 18, React Router
- **Database**: PostgreSQL (Neon DB)
- **ORM**: Prisma
- **Authentication**: JWT

## Project Structure

```
fullstack-rating-app/
├── backend/              # Express.js API server
│   ├── src/
│   ├── prisma/          # Prisma schema
│   ├── .env.example
│   └── package.json
└── frontend/            # React application
    ├── src/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file and add your Neon DB URL
cp .env.example .env
# Edit .env and add: DATABASE_URL="your_neon_db_url"

# Setup database
npm run prisma:migrate

# Start server
npm run dev
```

Server will run on http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

App will run on http://localhost:3000

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/change-password` - Change password

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - List users (with filters/sorting)
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/stores` - Create store
- `GET /api/admin/stores` - List stores (with filters/sorting)

### Normal User
- `GET /api/user/stores` - List stores
- `POST /api/user/ratings` - Submit/update rating
- `GET /api/user/ratings/:storeId` - Get user's rating

### Store Owner
- `GET /api/store-owner/dashboard` - Get store dashboard

## User Roles & Features

### System Administrator
- Create users and stores
- View dashboard with statistics
- Manage all users and stores
- Filter and sort users/stores by name, email, address
- View user details and store ratings

### Normal User
- Sign up and login
- View all stores
- Search stores by name and address
- Submit and modify ratings (1-5)
- View overall store ratings

### Store Owner
- View store dashboard
- See average rating
- View all ratings received from users

## Validation Rules

- **Name**: 2-60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 chars, minimum 1 uppercase letter, minimum 1 special character
- **Email**: Standard email format
- **Rating**: 1-5

## Database Schema

### Users
- Roles: ADMIN, NORMAL_USER, STORE_OWNER
- Fields: id, email, password (hashed), name, address, role, timestamps

### Stores
- Fields: id, name, email, address, ownerId (foreign key to User), timestamps

### Ratings
- Fields: id, score (1-5), userId, storeId, timestamps
- Unique constraint: (userId, storeId) - one rating per user per store

## Features

- ✅ Role-based access control
- ✅ JWT authentication
- ✅ Form validation (frontend & backend)
- ✅ Search and filtering
- ✅ Sorting (ascending/descending)
- ✅ Modal dialogs for forms
- ✅ Responsive design
- ✅ Error handling
- ✅ Dashboard statistics

## Getting Neon DB

1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project
4. Copy your connection string
5. Add to backend `.env` as `DATABASE_URL`

## Environment Variables

### Backend (.env)
```
DATABASE_URL="your_neon_db_connection_string"
PORT=5000
JWT_SECRET="your_secure_secret_key"
```

## Testing the App

1. **Create Admin User** (via admin create endpoint)
2. **Admin Login** - Creates users, stores, views dashboard
3. **Create Normal User** - Via signup or admin
4. **Normal User Login** - Views stores, submits ratings
5. **Create Store Owner** - Via admin
6. **Store Owner Login** - Views ratings dashboard

## Notes

- All routes (except /auth/signup and /auth/login) require JWT token
- Frontend automatically stores token in localStorage
- API calls automatically include Authorization header
- Database migrations handled by Prisma
- CORS enabled for frontend-backend communication
