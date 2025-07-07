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

### Sprint 13: Token Auto-Attach to API Requests
- Attach Firebase token to all fetch requests automatically
- Add helper (e.g. `fetchWithToken`) to simplify secure calls

### Sprint 14: Holdings UI + Search Integration
- Add “Add to Portfolio” button in `/search` results
- Prefill transaction form with asset data
- Streamlined flow: Search → Select → Transact

### Sprint 15: Manual Transactions via CSV Upload
- Upload `.csv` for bulk investment transactions
- Validate and display preview before insert
- Batch insert into backend

### Sprint 16: Budget & Debt Tracker – Frontend UI
- Build unified dashboard for Budget + Debt
- Add Income/Expense/Transfer/Debt entry forms
- Link to recurring logic if needed

### Sprint 17: Net Worth Dashboard – Visuals
- Create net worth chart with history
- Filters for platform, asset class, account

### Sprint 18: Realized/Unrealized Gains & Return Metrics
- Add logic to separate realized vs unrealized gains
- Display % return, total return, IRR (future)
- Store historical snapshot for each month (TBC)

### Sprint 19: FIFO / LIFO Cost Basis Methods
- Add dropdown in transaction form to select method
- Update backend `portfolioLogic.ts` with method logic
- Compare with AVG method

### Sprint 20: Transaction Log Table UI
- Create `/portfolio/transactions` frontend page
- Display full log of all past buys/sells/dividends
- Filters: symbol, action type, date

### Sprint 21: Multi-Currency Support
- Add currency field to holdings and transactions
- Support FX conversion with live rates (CoinGecko)
- Normalize portfolio value to user base currency

### Sprint 22: Budget Tracker – Frontend Dashboard
- Create `/budget` dashboard with monthly view
- Add income/expense bar chart, category breakdown
- Toggle filters by month, type, source

### Sprint 23: Debt Tracker – Frontend Dashboard
- Create `/debt` dashboard with list of debts
- Show progress bars, interest vs principal split
- Add debt entry/edit form

### Sprint 24: Net Worth Visual Dashboard
- Create `/networth` page
- Add line chart over time using net worth endpoint
- Toggle filters: platform, region, asset class

### Sprint 25+: Platform Expansion & Growth
- 🌍 Multi-account support (track multiple brokers)
- 📈 Chart overlays: cost basis vs current price
- 📦 Portfolio groups (e.g. Core vs Speculative)
- 🔒 Add password reset, error boundaries, 2FA (TBD)
- 📊 Connect to Supabase/Looker for data visualization
- 📱 Optimize mobile-first experience (especially for budget)
- 👥 Public Community Portfolio (Bill’s journey)
- 📤 Export transactions to CSV or PDF
- 🧠 Advanced features: auto-categorization, rules, AI prompts
- 🌐 Spanish version of the app

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