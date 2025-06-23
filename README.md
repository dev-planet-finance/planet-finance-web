# planet-finance-web
Personal finance SaaS web app – Budget, Portfolio, Debt, Net Worth tracking tools

---

## ✅ Sprint 1 Complete

### 🔧 Project Setup
- Created GitHub repo and initialized with `.gitignore`
- Scaffolded full-stack project structure:
  - `/frontend`: Next.js 15 (App Router) with TypeScript
  - `/backend`: Express server with TypeScript

### 🧠 Dev Tools Integrated
- Local development environment configured with:
  - ts-node-dev for backend hot reload
  - Prisma ORM for PostgreSQL DB
  - Railway provisioned for cloud PostgreSQL
  - Vercel connected to GitHub for auto-deploys (frontend)

### 🔄 Frontend + Backend Connected
- Created `/api/ping` route in Express backend
- Fetched `/api/ping` from frontend via `lib/api.ts`
- Live response on both:
  - `localhost:4000/api/ping` → `{ "message": "pong" }`
  - `localhost:3000` → “Planet Finance Web App – Server says: pong”
