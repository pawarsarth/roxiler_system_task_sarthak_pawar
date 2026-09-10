# Migrating to Bun JS Runtime

Bun is a fast JavaScript runtime alternative to Node.js with built-in bundler and package manager.

## Installation

### Install Bun
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "$(Invoke-WebRequest https://bun.sh/install.ps1 -UseBasicParsing | Select-Object -ExpandProperty Content)"

# Verify installation
bun --version
```

---

## Backend Changes

### 1. Update `backend/package.json`

Change all `npm` scripts to `bun`:

```json
{
  "name": "rating-app-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "bun src/server.js",
    "dev": "bun --watch src/server.js",
    "prisma:generate": "bunx prisma generate",
    "prisma:migrate": "bunx prisma migrate dev",
    "prisma:studio": "bunx prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.7.1",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.1.2"
  },
  "devDependencies": {
    "prisma": "^5.7.1"
  }
}
```

### 2. Setup with Bun

```bash
cd backend

# Install dependencies (creates bun.lockb instead of package-lock.json)
bun install

# Setup database
bunx prisma migrate dev

# Start server
bun dev
```

### 3. No changes needed for:
- `src/server.js` - works as-is
- Controllers, routes, middleware - all compatible
- Database connection - Prisma works perfectly with Bun

---

## Frontend Changes

### 1. Update `frontend/package.json`

```json
{
  "name": "rating-app-frontend",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "bun run vite",
    "build": "bun run vite build",
    "preview": "bun run vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

### 2. Update `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

### 3. Setup with Bun

```bash
cd frontend

# Install dependencies
bun install

# Start development server
bun dev
```

---

## Command Comparison

| Task | npm | Bun |
|------|-----|-----|
| Install deps | `npm install` | `bun install` |
| Install package | `npm install pkg` | `bun add pkg` |
| Remove package | `npm uninstall pkg` | `bun remove pkg` |
| Run script | `npm run dev` | `bun run dev` or `bun dev` |
| Run CLI tool | `npx prisma` | `bunx prisma` |
| Run file | `node file.js` | `bun file.js` |
| Watch mode | `nodemon file.js` | `bun --watch file.js` |

---

## Complete Setup Guide with Bun

### Backend Setup
```bash
cd backend

# 1. Install dependencies with Bun
bun install

# 2. Create .env file
cp .env.example .env

# 3. Add your Neon DB connection string to .env
# DATABASE_URL="postgresql://..."

# 4. Generate Prisma client and run migrations
bunx prisma migrate dev

# 5. Start server
bun dev
# or production: bun src/server.js
```

### Frontend Setup (new terminal)
```bash
cd frontend

# 1. Install dependencies with Bun
bun install

# 2. Start dev server
bun dev
```

---

## Advantages of Using Bun

✅ **Faster**: 3x faster than Node.js  
✅ **Built-in bundler**: No need for Webpack  
✅ **Built-in package manager**: No separate npm  
✅ **Better TypeScript support**: Out of the box  
✅ **Smaller lock files**: `bun.lockb` is binary and compact  
✅ **Better performance**: Especially for startups  

---

## Troubleshooting

### Issue: `bunx prisma` not found
**Solution**: Make sure you have `prisma` in `devDependencies`

### Issue: Port already in use
**Solution**: Kill the process or change port in vite.config.js

### Issue: `.env` file not loading
**Solution**: Bun loads `.env` automatically, make sure it's in root directory

### Issue: Module not found
**Solution**: Clear `node_modules` and reinstall:
```bash
rm -rf node_modules bun.lockb
bun install
```

---

## Important Notes

1. **Lock file**: Bun uses `bun.lockb` instead of `package-lock.json`
   - Add to `.gitignore` if needed
   - Binary format, don't commit to git if using npm elsewhere

2. **Prisma with Bun**: 
   - May need to regenerate client: `bunx prisma generate`
   - Works perfectly, no issues expected

3. **Environment files**:
   - Bun automatically loads `.env` from root
   - No `dotenv` package needed

4. **Performance**:
   - Bun is significantly faster than Node.js
   - Cold start is much better
   - Development experience is smoother

---

## Docker Support (Optional)

If you want to use Bun in Docker:

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

EXPOSE 5000
CMD ["bun", "src/server.js"]
```

---

## Reverting to Node.js/npm

If you want to switch back:
1. Delete `bun.lockb`
2. Run `npm install` - it will create `package-lock.json`
3. Use `npm` commands instead of `bun`

---

That's it! Just replace `npm` with `bun` and `npx` with `bunx` everywhere. Everything else works exactly the same! 🚀
