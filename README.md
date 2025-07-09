# 🌍 Planet Finance Web App

A full-stack personal finance app built in TypeScript using **Next.js**, **Express**, **PostgreSQL (via Railway)**, and **Firebase Auth**, with custom budgeting, portfolio, and debt tracking logic based on Planet Finance’s Google Sheets templates.

---

Built using:
- **Frontend**: Next.js (TypeScript) — Vercel
- **Backend**: Express (TypeScript) — Railway
- **Database**: PostgreSQL (via Railway)
- **Auth**: Firebase (email/password only)
- **Live Data**: CoinGecko (crypto) + EODHD (stocks, ETFs, forex)

---

## ✅ Modules Overview

### 📊 Portfolio Tracker
- Manual or CSV transaction input
- Assets: Stocks, ETFs, Crypto, Forex, Options
- Actions: Buy, Sell, DRIP, CashDividend, Deposit, Fee, Transfer
- Average cost, FIFO, LIFO (in development)
- Live price fetching (CoinGecko + EODHD)
- Planned gamification: badges, streaks, achievements

### 💰 Budget Tracker
- Tracks Income, Expenses, and Transfers
- Monthly budget categories (e.g. Groceries, Rent)
- Actual vs Budget view
- Multi-currency, category-level rollups
- Optional linkage with portfolio cash deposits

### 🏦 Debt Tracker
- Supports Home, Car, and Personal loans
- Auto-generated amortization tables
- Manual repayments and extra contributions
- Variable interest support
- Payoff strategy tracking (Snowball, Avalanche)
- Optional budget linkage (sync repayments into budget tab)

---

## 🚧 Current Status (MVP)

| Component        | Backend | Frontend |
|------------------|:-------:|:--------:|
| Auth             | ✅      | ✅        |
| Portfolio Logic  | ✅      | ✅        |
| Budget Logic     | ✅      | 🔜        |
| Debt Logic       | ✅      | 🔜        |
| Live Price API   | ✅      | ✅        |
| Asset Search     | ✅      | ✅        |
| CSV Upload       | 🔜      | 🔜        |
| Transactions Tab | 🔜      | 🔜        |

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

### Sprint 3: Portfolio Tracker – Basic CRUD
- Developed models for holdings and transactions.
- Created endpoints for CRUD operations.
- Established basic transaction recording.

### Sprint 4: Portfolio Tracker – Transaction Actions
- Expanded transaction types.
- Implemented corresponding logic.
- Ensured accurate updates to holdings.

### Sprint 5: Portfolio Logic Enhancements
- Implemented cost basis logic using AVG method (for Buy and DRIP actions).
- Enhanced `portfolioLogic.ts` with robust transaction handling.
- Validated results via Postman and summary calculations.
- Added support for:
  - CashDividend, CashFee, CashDeposit, CashWithdrawal
  - TransferIn and TransferOut transactions
- [Planned but not yet implemented]:
  - FIFO / LIFO methods
  - Realized vs. unrealized gains
  - Total return over time

### Sprint 6: Budget Tracker – Backend
- Created models for income, expenses, and transfers.
- Implemented unified budget transaction flow.
- Added fields for recurring logic (future UI use).

### Sprint 7: Debt Tracker – Backend
- Created models: `Debt`, `DebtTransaction`
- Built amortization and repayment logic.
- Structured debts to sync with budget flow in future.

### Sprint 8: Net Worth Summary – Backend
- Built endpoint to calculate net worth by date.
- Aggregates portfolio, debt, and cash balances.
- Connected to `portfolioLogic`, `budgetLogic`, `debtLogic`.

### Sprint 9: Market Data – Price API Integration
- Integrated live asset prices via **EODHD**, **CoinGecko**, and fallback via **Finnhub**
- Support for ASX, NASDAQ, NYSE, TSX, LSE, crypto, etc.
- Smart routing via investment type

### Sprint 10: Portfolio Tracker – Frontend UI
- Created `/portfolio` dashboard in Next.js
- Displayed real-time price + market value
- Connected to backend API using Firebase token

### Sprint 11: Universal Asset Search
- Implemented `/search` backend endpoint using CoinGecko + EODHD
- Built `/portfolio/search` frontend UI
- Supports symbol disambiguation (e.g. BTC vs BTC.AX)
- Dynamic result table with asset type and source

### Sprint 12: Firebase Token Storage in Frontend
- Created `/auth` login page in frontend
- Captures Firebase JWT and stores in `localStorage`
- Ends need for manual token generation via Postman
- Future API calls can auto-attach token

### Sprint 13: Portfolio Add Form (Frontend)
- Created /portfolio/add form that loads from selected asset.
- Inputs for quantity and price.
- Sends POST request with Firebase token to backend transaction API.
- Error-handling and feedback messages included.

### Sprint 14: Submit Transaction to Backend
- Connected portfolio form to full backend transaction engine.
- Added required fields (currency, date) to avoid Prisma validation errors.
- Confirmed data saved into database with 201 Created response.
- Finalized complete working pipeline: asset search → transaction entry → backend save.
- Also added frontend price display for each asset in search results.

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

#### Sprint 15: CSV Upload – Portfolio
- Drag-and-drop UI
- Backend parser + feedback
- Store transactions via bulk logic

#### Sprint 16: CSV Upload – Budget + Debt
- Parser modules for category- and loan-based formats
- Preview + validation
- Bulk transaction creation

#### Sprint 17: Unified Transactions Page
- `/transactions` tab with toggle: Portfolio | Budget | Debt
- View, filter, edit, delete transactions
- Linked logic for multi-tab sync

#### Sprint 18: Budget Tracker Frontend
- Category list with budget vs actual
- Manual entry form
- Calendar and summary views

#### Sprint 19: Debt Tracker Frontend
- Loan setup form
- Visual amortization table
- Manual repayment tab

#### Sprint 20: Portfolio Dashboard
- Performance by asset, sector, region
- Filters (day, week, YTD, custom)
- Price change heatmaps

#### Sprint 21: Gamification System
- Story mode unlocks
- Badges, streaks, progress rings
- Account-level achievement log

#### Sprint 22: Production Readiness
- Upgrade: Railway + Vercel + APIs
- Add logging (Sentry) and usage analytics
- Load testing for multi-user access

#### Sprint 23: MVP Launch 🚀
- UI polish
- Public signup page
- Shareable performance dashboard
- CSV onboarding tips

### Sprint after MVP: Platform Expansion & Growth
- 🌍 Multi-account support (track multiple brokers)
- 📈 Chart overlays: cost basis vs current price
- 📦 Portfolio groups (e.g. Core vs Speculative)
- 🔒 Add password reset, error boundaries, 2FA (TBD)
- 📊 Connect to Supabase/Looker for data visualization
- 📱 Optimize mobile-first experience (especially for budget)
- 👥 Public Community Portfolio (Bill’s journey)
- 📤 Export transactions to CSV or PDF
- 🧠 Advanced features: auto-categorization, rules, AI prompts

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

## 🧠 Vision Summary

Planet Finance Web App is:
- 🔓 100% manual & CSV-driven
- ⚙️ Powered by robust backend logic (custom handlers)
- 📈 Competitive with the best apps on the market
- 🔗 Unified: transactions sync across Budget, Portfolio, and Debt
- 🔍 Transparent: All prices are live-fetched from trusted sources

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