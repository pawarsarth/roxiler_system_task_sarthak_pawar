# ⚡ Complete Bun Setup Guide

Complete step-by-step instructions to run the entire app with Bun.

---

## Step 1: Install Bun

### macOS/Linux
```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows (PowerShell)
```powershell
powershell -c "$(Invoke-WebRequest https://bun.sh/install.ps1 -UseBasicParsing | Select-Object -ExpandProperty Content)"
```

### Verify Installation
```bash
bun --version
# Output: bun 1.x.xx (or higher)
```

If command not found, add Bun to PATH:
```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.bun/bin:$PATH"
```

---

## Step 2: Extract & Prepare Project

```bash
# Extract the zip file
unzip fullstack-rating-app.zip
cd fullstack-rating-app

# View structure
ls -la
```

Expected structure:
```
fullstack-rating-app/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Step 3: Backend Setup

### 3.1 Install Backend Dependencies
```bash
cd backend

# Install dependencies using Bun
bun install

# Expected output:
# installed x packages in 2.5s
```

### 3.2 Setup Environment Variables
```bash
# Copy example file
cp .env.example .env

# Edit .env file with your editor
# nano .env    (or use VS Code, etc.)
```

**.env file should contain:**
```
DATABASE_URL="postgresql://your_neon_db_user:password@host.neon.tech/dbname"
PORT=5000
JWT_SECRET="your_super_secret_jwt_key_change_this"
```

**To get Neon DB Connection String:**
1. Go to https://neon.tech
2. Sign up (free)
3. Create a new project
4. Click "Connection string" 
5. Copy the full URL
6. Paste in DATABASE_URL

### 3.3 Setup Database
```bash
# Create tables and run migrations
bunx prisma migrate dev

# When prompted, name the migration (e.g., "init")
# Expected output:
# ✔ Created migration: ./prisma/migrations/.../migration.sql

# Open Prisma Studio to verify (optional)
bunx prisma studio
# Opens browser at localhost:5555
```

### 3.4 Start Backend Server
```bash
# Development mode (auto-reload on file changes)
bun dev

# Expected output:
# Server running on port 5000
# Ready for requests at http://localhost:5000

# To stop: Press Ctrl+C
```

✅ **Backend is now running!**

---

## Step 4: Frontend Setup

### 4.1 Open New Terminal
```bash
# Keep backend running in first terminal
# Open a new terminal/tab
# Navigate to frontend folder
cd frontend  # from project root
```

### 4.2 Install Frontend Dependencies
```bash
# Install dependencies using Bun
bun install

# Expected output:
# installed x packages in 3.2s
```

### 4.3 Start Frontend Server
```bash
# Start development server
bun dev

# Expected output:
# VITE v5.0.8
# ➜  Local:   http://localhost:3000/
# ➜  press h to show help

# Keep this running while developing
```

✅ **Frontend is now running!**

---

## Step 5: Test the Application

### 5.1 Open in Browser
```
http://localhost:3000
```

You should see the login page.

### 5.2 Create First Admin User

Use Postman or curl to create an admin user:

**URL:** `http://localhost:5000/api/auth/signup`  
**Method:** POST  
**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "Admin@123!",
  "address": "123 Main Street, City"
}
```

**Expected Response:**
```json
{
  "message": "Signup successful",
  "user": {
    "id": "...",
    "email": "admin@test.com",
    "name": "Admin User",
    "role": "NORMAL_USER"
  },
  "token": "..."
}
```

### 5.3 Update Admin Role

You need to update the user role to ADMIN via database. Use Prisma Studio:

```bash
# In backend directory
bunx prisma studio

# In GUI:
# 1. Go to "users" table
# 2. Find the admin@test.com user
# 3. Change role from NORMAL_USER to ADMIN
# 4. Close Prisma Studio
```

### 5.4 Login
In browser (localhost:3000):
1. Click "Login"
2. Email: `admin@test.com`
3. Password: `Admin@123!`
4. Click "Login"

✅ **You should see Admin Dashboard**

### 5.5 Create Normal User

In Admin Dashboard:
1. Click "Users" in navigation
2. Click "Create User" button
3. Fill form:
   - Name: "John Doe"
   - Email: "john@test.com"
   - Address: "456 Oak Avenue"
   - Password: "Password@123!"
   - Role: "NORMAL_USER"
4. Click "Create"

### 5.6 Create Store

In Admin Dashboard:
1. Click "Stores" in navigation
2. Click "Create Store" button
3. Fill form:
   - Store Name: "Amazing Store"
   - Email: "store@example.com"
   - Address: "789 Commerce Street"
   - Owner ID: (Use user ID from step 5.5, or create STORE_OWNER first)
4. Click "Create"

### 5.7 Test Normal User

1. Logout (top right button)
2. Login as: `john@test.com` / `Password@123!`
3. Should see "Stores" page
4. Can submit ratings on stores

✅ **Full workflow tested!**

---

## Step 6: Common Development Tasks

### Add New Package to Backend
```bash
cd backend
bun add express-validator  # production package
bun add -d typescript      # development package
```

### Add New Package to Frontend
```bash
cd frontend
bun add lodash
bun add -d @testing-library/react
```

### Update Database Schema
```bash
# Edit backend/prisma/schema.prisma
# Then run:
cd backend
bunx prisma migrate dev --name "describe_your_change"
```

### View Database with GUI
```bash
cd backend
bunx prisma studio
# Opens at http://localhost:5555
```

### Clear Database (⚠️ Dangerous!)
```bash
cd backend
bunx prisma migrate reset
# Removes all data and re-runs migrations
```

---

## Step 7: Building for Production

### Backend Production Build
```bash
cd backend

# Build
bun run build

# Run production
bun dist/server.js

# Or directly
bun src/server.js  # No auto-reload
```

### Frontend Production Build
```bash
cd frontend

# Build (creates dist/ folder)
bun run build

# Preview build
bun run preview
```

---

## Terminal Layout (Recommended)

```
Terminal 1 (Backend)
├─ cd fullstack-rating-app/backend
├─ bun dev
└─ Server running on :5000

Terminal 2 (Frontend)
├─ cd fullstack-rating-app/frontend
├─ bun dev
└─ App running on :3000

Browser
└─ http://localhost:3000
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### Prisma migration fails
```bash
# Regenerate client
bunx prisma generate

# Check database connection
# Verify DATABASE_URL in .env is correct
```

### Frontend shows "Cannot find module"
```bash
# Clear and reinstall
cd frontend
rm -rf node_modules bun.lockb
bun install
```

### Changes not reflecting
```bash
# Make sure you're in dev mode
cd backend
bun dev

cd frontend
bun dev

# Both should show "watching" or "auto-reload"
```

### Database is stuck
```bash
# Reset everything
cd backend
bunx prisma migrate reset

# Then run migrations again
bunx prisma migrate dev
```

---

## Performance Tips

1. **Keep both terminals running** during development
2. **Use Bun** - it's 3x faster than Node.js
3. **Watch for auto-reload** - you'll see file changes in terminal
4. **Use Prisma Studio** to visualize database easily
5. **Clear cache** if you have weird issues: `rm bun.lockb && bun install`

---

## Next Steps

- 📚 Read `/backend/README.md` for API documentation
- 🎨 Read `/frontend/README.md` for frontend structure
- 📖 Check `BUN_CHEATSHEET.md` for all Bun commands
- 🚀 Deploy when ready using Docker or your hosting provider

---

## File Structure Reference

```
fullstack-rating-app/
├── backend/
│   ├── src/
│   │   ├── server.js            ← Express app entry
│   │   ├── routes/              ← API endpoints
│   │   ├── controllers/         ← Business logic
│   │   ├── middleware/          ← Auth middleware
│   │   ├── config/              ← Database config
│   │   └── utils/               ← Helpers
│   ├── prisma/
│   │   └── schema.prisma        ← Database schema
│   ├── .env                     ← Config (create from .env.example)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/               ← React pages
│   │   ├── components/          ← UI components
│   │   ├── services/            ← API calls (api.js)
│   │   ├── context/             ← State (AuthContext.jsx)
│   │   ├── hooks/               ← Custom hooks
│   │   ├── utils/               ← Helpers
│   │   ├── styles.css           ← Global styles
│   │   └── App.jsx              ← Main app
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## Support & Resources

- 📖 **Official Docs**: https://bun.sh/docs
- 🆘 **Troubleshoot**: Check terminal logs for errors
- 💬 **Ask Help**: https://github.com/oven-sh/bun/discussions
- 🐛 **Report Issues**: https://github.com/oven-sh/bun/issues

---

**Happy coding with Bun! ⚡**
