# 🌍 Planet Finance Web App

A full-stack personal finance app built in TypeScript using **Next.js**, **Express**, **PostgreSQL (via Railway)**, and **Firebase Auth**, inspired by Delta, Stock Events, and Finary — with custom budgeting, portfolio, and debt tracking logic based on Planet Finance’s Google Sheets templates.

---

## ✅ Project Progress (by Sprints)

### 🚀 Sprint 1: Infrastructure Setup
- Set up project folders for `frontend` (Next.js) and `backend` (Express)
- Connected PostgreSQL via Railway
- Installed all core packages (Prisma, dotenv, firebase-admin, etc.)
- Setup GitHub, Vercel (frontend), Railway (backend)

### 🔐 Sprint 2: Authentication Middleware
- Firebase Admin SDK integration
- Token validation middleware in Express
- Protected route `/api/test/protected` to validate token authentication

### 📊 Sprint 3: Portfolio Tracker DB Schema
- Created `User`, `PortfolioHolding`, `PortfolioTransaction` Prisma models
- Fields included asset metadata, strategy, platform, FX rate, etc.
- Supported cost basis methods (FIFO, LIFO, AVG)

### 🔁 Sprint 4: Full Integration & Testing
- Firebase Auth wired in frontend (email/password login)
- Backend login/register routes added
- Middleware tested using Postman + curl
- Frontend component connected to Firebase client SDK
- Tested registration and login flows with real Firebase project
- Confirmed secure access to protected backend routes

### 🧠 Sprint 5: Transaction Logic Setup
- Expanded `TransactionAction` enum to include:
  - `Buy`, `Sell`, `CashDividend`, `DRIP`, `Split`, `CashFee`, `CashDeposit`, `CashWithdrawal`
  - `ParcelFee`, `AssetTransferIn`, `AssetTransferOut`, `FreeAsset`, `CashInterest`, `CryptoInterest`
- Updated Prisma schema and migrated DB
- Pushed successful schema changes to GitHub

---

## 📦 Stack

| Layer         | Tech                             |
|---------------|----------------------------------|
| Frontend      | Next.js 15 (App Router), TypeScript |
| Backend       | Express.js                       |
| Auth          | Firebase (email/password)        |
| DB            | PostgreSQL (via Railway)         |
| ORM           | Prisma                           |
| Hosting       | Vercel (frontend), Railway (backend) |
| Dev Tools     | Postman, GitHub, Vercel CLI      |

---

## 📌 Next Sprints (Planned)

- **Sprint 6**: Implement Portfolio Logic
  - Cost basis calculation (FIFO, LIFO, AVG)
  - Realized/unrealized gains
  - Total return over time
- **Sprint 7**: Budget Tracker setup
  - Income, expenses, transfers
  - Sync with investment funding flows
- **Sprint 8**: Debt Tracker setup
  - Loan creation, recurring repayments
  - Optional syncing with budget transactions
- **Sprint 9**: Net Worth Dashboard
  - Time-series breakdown of assets, liabilities, cash

---

## 🧠 Notes

This project is based on Planet Finance’s premium financial trackers (GSheets) and aims to bring a robust, mobile-friendly, app-based experience to users worldwide.

---

## 🛠 Dev

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
