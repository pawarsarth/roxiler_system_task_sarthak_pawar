# Store Rating Platform - Frontend

React frontend for store rating application

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   
   Server will run on http://localhost:3000

3. **Build for production**
   ```bash
   npm run build
   ```

## Features

### Authentication
- User signup and login
- Role-based access control (Admin, Normal User, Store Owner)
- Token-based authentication with JWT

### Admin Features
- Dashboard with statistics (total users, stores, ratings)
- Create and manage users
- View all stores
- Filter and sort users/stores
- View detailed user information

### Normal User Features
- View all stores
- Search stores by name and address
- Submit ratings (1-5) for stores
- Modify existing ratings
- View overall store ratings

### Store Owner Features
- Dashboard with store information
- View average rating of their store
- See all ratings received from users

## File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Stores.jsx
│   │   ├── User/
│   │   │   └── Stores.jsx
│   │   └── StoreOwner/
│   │       └── Dashboard.jsx
│   ├── components/
│   │   └── Navigation.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── validation.js
│   ├── styles.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Environment

The app connects to backend API at http://localhost:5000 (configured in vite.config.js)
