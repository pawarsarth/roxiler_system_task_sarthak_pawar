# 🚀 Quick Start with Bun Runtime

Use Bun for 3x faster development!

## 1️⃣ Install Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "$(Invoke-WebRequest https://bun.sh/install.ps1 -UseBasicParsing | Select-Object -ExpandProperty Content)"

# Verify
bun --version
```

---

## 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies (creates bun.lockb)
bun install

# Copy environment file
cp .env.example .env

# Edit .env and add your Neon DB URL
# DATABASE_URL="postgresql://user:password@host/dbname"

# Setup database (create tables)
bunx prisma migrate dev

# Start development server (auto-reload)
bun dev
```

**Server runs on http://localhost:5000**

---

## 3️⃣ Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
bun install

# Start dev server
bun dev
```

**App runs on http://localhost:3000**

---

## 📝 Common Bun Commands

```bash
# Install all dependencies
bun install

# Add a package
bun add package-name

# Add dev dependency
bun add -d package-name

# Remove package
bun remove package-name

# Run scripts from package.json
bun run dev
bun run build

# Run any JS file with watch mode
bun --watch file.js

# Run Prisma commands
bunx prisma migrate dev
bunx prisma studio
bunx prisma generate

# Execute TypeScript without compilation
bun script.ts
```

---

## 🔑 Key Differences from npm

| Operation | npm | Bun |
|-----------|-----|-----|
| Install dependencies | `npm install` | `bun install` |
| Add package | `npm install pkg` | `bun add pkg` |
| Run script | `npm run dev` | `bun run dev` or `bun dev` |
| CLI tools | `npx prisma` | `bunx prisma` |
| Watch files | `nodemon file.js` | `bun --watch file.js` |
| Run file | `node file.js` | `bun file.js` |

---

## ⚡ Advantages of Bun

✅ **3x faster** than Node.js  
✅ **Auto .env loading** - no setup needed  
✅ **Smaller node_modules** - faster installs  
✅ **Better startup time** - especially good for development  
✅ **Better TypeScript support** - out of the box  
✅ **Single executable** - distribute as binary  

---

## 🐛 Troubleshooting

### Port 5000 already in use?
```bash
# Kill the process
lsof -ti:5000 | xargs kill -9  # macOS/Linux

# Or change PORT in backend/.env
PORT=5001
```

### Port 3000 already in use?
```bash
# Change in frontend/vite.config.js
server: {
  port: 3001
}
```

### Database connection error?
```bash
# Verify .env file exists with DATABASE_URL
cat backend/.env

# Test Prisma setup
cd backend
bunx prisma studio
```

### Module not found?
```bash
# Clear and reinstall
rm -rf node_modules bun.lockb
bun install
```

---

## 🧪 Test the Application

### 1. Create Admin User
In Postman/curl:
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "Admin@123",
  "address": "123 Main St"
}
```

### 2. Admin Login
```bash
POST http://localhost:5000/api/auth/login
{
  "email": "admin@test.com",
  "password": "Admin@123"
}
```

### 3. Create User (as Admin)
```bash
POST http://localhost:5000/api/admin/users
Authorization: Bearer {token_from_login}
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "Password@123",
  "address": "456 Oak Ave",
  "role": "NORMAL_USER"
}
```

### 4. Open browser: http://localhost:3000
- Login with credentials from step 2
- Test all features

---

## 📂 Project Structure

```
fullstack-rating-app/
├── backend/
│   ├── src/
│   │   ├── server.js         (Express app)
│   │   ├── routes/           (API endpoints)
│   │   ├── controllers/      (Business logic)
│   │   ├── middleware/       (Auth, etc)
│   │   └── utils/            (Helpers)
│   ├── prisma/
│   │   └── schema.prisma     (Database schema)
│   ├── .env                  (Your config)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/            (React pages)
    │   ├── components/       (Reusable UI)
    │   ├── services/         (API calls)
    │   ├── hooks/            (Custom hooks)
    │   └── styles.css        (Global styles)
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🔗 Useful Links

- **Bun Docs**: https://bun.sh/docs
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **Prisma**: https://www.prisma.io/docs/
- **Neon DB**: https://neon.tech/

---

## 🎯 Next Steps

1. ✅ Install Bun
2. ✅ Run backend with `bun dev`
3. ✅ Run frontend with `bun dev`
4. ✅ Test in browser
5. ✅ Start building!

---

**Enjoy the speed of Bun! 🚀**
