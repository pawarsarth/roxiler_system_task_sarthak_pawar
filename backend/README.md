# Store Rating Platform - Backend

Express.js backend with Prisma ORM and PostgreSQL (Neon DB)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   - Copy `.env.example` to `.env`
   - Add your Neon DB connection string to `DATABASE_URL`
   - Change `JWT_SECRET` to a secure value

3. **Setup database**
   ```bash
   npm run prisma:migrate
   ```

4. **Start server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/change-password` - Change password (requires token)

### Admin Routes (requires ADMIN role)
- `GET /api/admin/dashboard` - Get dashboard stats
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - Get all users (with filtering/sorting)
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/stores` - Create store
- `GET /api/admin/stores` - Get all stores (with filtering/sorting)

### Normal User Routes (requires NORMAL_USER role)
- `GET /api/user/stores` - Get all stores (with filtering/sorting)
- `POST /api/user/ratings` - Submit/update rating
- `GET /api/user/ratings/:storeId` - Get user's rating for store

### Store Owner Routes (requires STORE_OWNER role)
- `GET /api/store-owner/dashboard` - Get store dashboard with ratings

## Database Schema

### Users
- id, email, password, name, address, role, createdAt, updatedAt

### Stores
- id, name, email, address, ownerId, createdAt, updatedAt

### Ratings
- id, score (1-5), userId, storeId, createdAt, updatedAt

## Validation Rules

- **Name**: 2-60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 chars, at least 1 uppercase and 1 special character
- **Email**: Valid email format
- **Rating**: 1-5
