# 🎯 Bun Commands Cheat Sheet

## Quick Reference

### Installation & Setup

```bash
# Install Bun (do this once)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version

# Global package installation
bun install -g package-name
```

---

## Backend Commands

```bash
# Navigate to backend
cd backend

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 📦 Dependency Management
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Install all dependencies
bun install

# Add new package
bun add express
bun add cors

# Add development dependency
bun add -d prisma
bun add -d typescript

# Remove package
bun remove axios

# Update packages
bun update

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🗄️ Database & Prisma
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Generate Prisma client (after schema changes)
bunx prisma generate

# Create migration & apply to database
bunx prisma migrate dev --name "add_users_table"

# Apply existing migrations
bunx prisma migrate deploy

# Reset database (WARNING: deletes all data)
bunx prisma migrate reset

# Open Prisma Studio (GUI for database)
bunx prisma studio

# View generated Prisma client types
bunx prisma generate --watch

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ▶️ Running the Server
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Start development server (auto-reload on file changes)
bun dev

# Start production server (no auto-reload)
bun start

# Run with watch mode
bun --watch src/server.js

# Run with custom environment
BUN_ENV=production bun start

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🏗️ Building
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Build for production
bun run build

# Deploy built version
bun dist/server.js
```

---

## Frontend Commands

```bash
# Navigate to frontend
cd frontend

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 📦 Dependency Management
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Install all dependencies
bun install

# Add new package
bun add react-query
bun add axios

# Add development dependency
bun add -d tailwindcss
bun add -d vite

# Remove package
bun remove axios

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🚀 Running Development Server
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Start development server (auto-reload)
bun dev

# Start on custom port
bun run vite --port 3001

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🏗️ Building & Deployment
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Build for production
bun run build

# Preview production build locally
bun run preview

# Build and start preview
bun run build && bun run preview
```

---

## File Execution

```bash
# Run JavaScript file
bun src/server.js

# Run TypeScript file (no compilation needed)
bun src/script.ts

# Run with watch mode (auto-reload)
bun --watch src/server.js

# Run with environment variables
BUN_ENV=development bun src/server.js

# Run multiple files
bun src/file1.js src/file2.js

# Run and get return code
bun src/script.js; echo $?
```

---

## Package Management Advanced

```bash
# Install from git repository
bun add github:username/repo

# Install specific version
bun add react@18.2.0

# Install peer dependencies
bun install --peer

# Audit dependencies for vulnerabilities
bun audit

# Check outdated packages
bun outdated

# Link local package for development
bun link

# Unlink local package
bun unlink package-name

# View dependency tree
bun pm ls

# Clear cache
bun pm cache

# Rebuild native modules
bun rebuild
```

---

## Useful npm ↔️ Bun Conversion Table

| Task | npm | Bun |
|------|-----|-----|
| Install all deps | `npm install` | `bun install` |
| Add package | `npm install pkg` | `bun add pkg` |
| Add dev pkg | `npm install -D pkg` | `bun add -d pkg` |
| Remove package | `npm uninstall pkg` | `bun remove pkg` |
| Update all | `npm update` | `bun update` |
| Run script | `npm run dev` | `bun run dev` or `bun dev` |
| Execute file | `node file.js` | `bun file.js` |
| Run binary | `npx prisma` | `bunx prisma` |
| Watch file | `nodemon file.js` | `bun --watch file.js` |
| Check version | `npm --version` | `bun --version` |
| List packages | `npm ls` | `bun pm ls` |
| Audit security | `npm audit` | `bun audit` |

---

## Environment Variables with Bun

```bash
# .env file (auto-loaded by Bun)
DATABASE_URL="postgresql://..."
PORT=5000
JWT_SECRET="secret"

# Access in code
const dbUrl = process.env.DATABASE_URL;

# Or use Bun's built-in
import { env } from "bun";
const dbUrl = env.DATABASE_URL;
```

---

## Development Workflow Example

```bash
# Day 1: Initial Setup
cd backend
bun install
cp .env.example .env
# Edit .env with your Neon DB URL
bunx prisma migrate dev
bun dev

# Day 2: Frontend Setup (new terminal)
cd frontend
bun install
bun dev

# Day 3: Adding dependencies
cd backend
bun add new-package
bun run dev

# Update Prisma schema
# Then run:
bunx prisma migrate dev --name "added_new_field"

# View database
bunx prisma studio
```

---

## Performance Tips

```bash
# Faster installs
bun install  # Uses parallel downloads

# Clear unused files
bun pm cache  # Clear cache

# Check what's taking space
bun pm ls --all

# Rebuild if having issues
bun rebuild

# Speed up Prisma in dev
bunx prisma generate --watch
```

---

## Debugging

```bash
# Verbose logging
bun dev --verbose

# Inspect process
bun inspect src/server.js

# Check environment
bun env

# See Bun configuration
bun config

# Debug specific issue
BUN_DEBUG=* bun src/server.js
```

---

## Terminal Aliases (Optional)

Add to your shell profile (~/.bashrc, ~/.zshrc):

```bash
alias b="bun"
alias br="bun run"
alias bd="bun dev"
alias ba="bun add"
alias bad="bun add -d"
alias brm="bun remove"
alias bup="bun update"
alias bx="bunx"
```

Then use: `b dev`, `ba express`, `bx prisma`, etc.

---

## Common Issues & Solutions

### Issue: `bun.lockb` conflict
```bash
# Solution: Remove and reinstall
rm bun.lockb
bun install
```

### Issue: Prisma client not generated
```bash
# Solution: Regenerate client
bunx prisma generate
```

### Issue: Module not found
```bash
# Solution: Clear and reinstall
rm -rf node_modules bun.lockb
bun install
```

### Issue: Port already in use
```bash
# Find process using port
lsof -ti:5000 | xargs kill -9

# Or change port in vite.config.js
```

---

## Resources

- **Bun Official**: https://bun.sh
- **Bun Docs**: https://bun.sh/docs
- **API Reference**: https://bun.sh/docs/api
- **Guides**: https://bun.sh/guides

---

**Pro Tip**: Bun is 100% compatible with npm packages and Node.js code. You're just getting better performance! 🚀
