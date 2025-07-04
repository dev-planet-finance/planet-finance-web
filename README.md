# 🌍 Planet Finance Web App

A full-stack personal finance app built in TypeScript using **Next.js**, **Express**, **PostgreSQL (via Railway)**, and **Firebase Auth**, with custom budgeting, portfolio, and debt tracking logic based on Planet Finance’s Google Sheets templates.

---

## ✅ Project Progress (by Sprints)

## ✅ Completed Sprints

### Sprint 1: Project Setup
- Initialized monorepo.
- Configured backend and frontend environments.
- Set up CI/CD pipelines.

### Sprint 2: Authentication System
- Implemented user registration and login.
- Integrated JWT-based authentication.
- Established role-based access controls.

### Sprint 3: Portfolio Tracker - Basic CRUD
- Developed models for holdings and transactions.
- Created endpoints for CRUD operations.
- Established basic transaction recording.

### Sprint 4: Portfolio Tracker - Transaction Actions
- Expanded transaction types.
- Implemented corresponding logic.
- Ensured accurate updates to holdings.

### Sprint 5: Portfolio Logic Enhancements
- Implemented cost basis logic using AVG method (for Buy and DRIP actions).
- Enhanced portfolioLogic.ts with robust transaction handling logic.
- Validated results via Postman and summary dashboard calculations.
- Added support for CashDividend, CashFee, CashDeposit, and CashWithdrawal.
- Planned but not yet implemented:
  - FIFO / LIFO cost basis methods.
  - Realized vs. unrealized gains tracking.
  - Total return over time (requires time-series holdings history).
- Implemented TransferIn and TransferOut transactions.
- Ensured accurate asset movement between platforms.
- Updated portfolio summaries accordingly.

#### Sprint 6: Budget Tracker – Backend
- Created models for income, expenses, and transfers.
- Implemented unified budget transaction flow.
- Integrated recurring logic (future use).

#### Sprint 7: Debt Tracker – Backend
- Created models: `Debt`, `DebtTransaction`.
- Added logic for amortization and repayments.
- Built endpoints to record debt activity and retrieve data.

#### Sprint 8: Net Worth Summary – Backend
- Built endpoint to calculate total net worth by date.
- Aggregates holdings, debts, and budget data.
- Connected with `portfolioLogic.ts`, `debtLogic.ts`, and `budgetLogic.ts`.

#### Sprint 9: Market Data – Price API Integration
- Integrated live asset price fetching from **Finnhub**, **EODHD**, and **CoinGecko**.
- Designed fallback logic for global stock/ETF and crypto support.
- Handles ASX, TSX, LSE, NSE, NYSE, NASDAQ, crypto and more.

#### Sprint 10: Portfolio Tracker – Frontend UI
- Created portfolio dashboard in Next.js frontend.
- Displays real-time prices and market value.
- Authenticated fetch using Firebase token and backend APIs.

### Sprint 11: Universal Asset Search
- Implemented `/search` API to query CoinGecko and EODHD for crypto, stock, ETF, and currency tickers
- Created `search.tsx` frontend page with query form and result table
- Unified search across sources, resolves "BTC vs BTC.AX" problem
- Handled fallback data, error logging, and UI states

---

## 📦 Stack

| Layer     | Tech                                  |
|-----------|---------------------------------------|
| Frontend  | Next.js 15 (App Router), TypeScript   |
| Backend   | Express.js                            |
| Auth      | Firebase (email/password only)        |
| DB        | PostgreSQL (via Railway)              |
| ORM       | Prisma                                |
| Hosting   | Vercel (frontend), Railway (backend)  |
| APIs      | EODHD (global), Finnhub (US only), CoinGecko (crypto) |
| Dev Tools | Postman, GitHub, Vercel CLI, Railway  |

---

## 📌 Upcoming Sprints

### Sprint 12: Firebase Token Storage in Frontend
- Store Firebase JWT in `localStorage`
- Automatically include token in all API calls
- Remove manual token pasting (Postman workaround ends)

### Sprint 13: Holdings UI + Search Integration
- Add button to select asset from `/search`
- Use result to prefill new holding or transaction
- Streamlined UI: Search → Select → Transact

### Sprint 14: Manual Transactions via CSV Upload
- Create form to upload `.csv` file
- Parse and validate entries
- Insert multiple transactions in one batch

### Sprint 15: Budget & Debt Tracker – Frontend UI
- Add visual dashboards for budget + debt
- Allow entry from unified transaction form (Income/Expense/Transfer/Debt)

### Sprint 16: Net Worth Dashboard – Visuals
- Chart net worth over time
- Include filters: All, Platform, Asset Type, etc.

---

## 🔮 Future Features

- Realized/unrealized gains tracking
- FIFO & LIFO cost basis support
- Multiple broker/platform accounts
- Multi-currency support
- Looker or Supabase chart integration
- Gamification (streaks, achievements)
- Monthly performance reports
- Community Portfolio (Bill's journey)
- Mobile-first layout for budget tracker

---

## 🧠 Notes

This project is based on Planet Finance’s premium financial trackers (GSheets) and aims to bring a robust, mobile-friendly, app-based experience to users worldwide.

---

## 🛠 Dev Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev