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

#### Sprint 15: CSV Upload – Portfolio
- Drag-and-drop UI
- Backend parser + feedback
- Store transactions via bulk logic
- Fix cash handlers and avgcost/avgprice

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

#### Sprint 16: CSV Upload – Budget + Debt
- Parser modules for category-based (budget) and loan-based (debt) formats
- File validation and structure mapping
- Bulk transaction creation for both budget and debt logic

#### Sprint 17: Unified Transactions Tab (Backend)
- New endpoint: `/transactions`
- Filter by type: Portfolio | Budget | Debt
- Date range filters, sorting, and keyword search
- Pagination and metadata (e.g. totals)

#### Sprint 18: Unified Transactions Tab (Frontend)
- Frontend UI for `/transactions`
- Toggle view (Portfolio, Budget, Debt)
- Search bar, date picker, and filters
- Editable rows and deletion support

#### Sprint 19: Budget Tracker – UI Setup
- Budget categories and subcategories
- Input view for income, expenses, and transfers
- Monthly summary breakdown

#### Sprint 20: Budget Tracker – Month View
- Dynamic month-to-month view
- Actual vs Budget graphs
- Category rollups and visual indicators

#### Sprint 21: Budget Tracker – Category Editor
- Create, edit, delete budget categories
- Assign default monthly budgets
- Support for recurring categories (e.g. rent, groceries)

#### Sprint 22: Debt Tracker – UI Setup
- Debt overview tab
- Loan creation form (principal, term, rate)
- Manual repayment input

#### Sprint 23: Debt Tracker – Amortization UI
- Visual table with repayment schedule
- Interest vs principal split
- Track early repayments and adjusted schedule

#### Sprint 24: Net Worth Summary Page
- Net worth over time chart
- Aggregated holdings + cash – debts
- Drill-down by month or asset type

#### Sprint 25: Transfer Logic – Cross-Module Sync
- Link transfer between Portfolio ↔ Budget
- Link debt repayments into Budget
- Add validation and sync options

#### Sprint 26: Multi-Account Support
- Add brokers/platforms as accounts
- Group holdings by broker/platform
- Filter views by platform

#### Sprint 27: Multi-Currency Enhancements
- Add FX rates to all modules
- Normalize values to base currency (e.g. USD)
- Toggle view by currency

#### Sprint 28: Realized vs Unrealized Gains
- Track profit realized from each sale
- Split logic: FIFO, LIFO, AVG cost basis
- Display realized returns in dashboard

#### Sprint 29: FIFO/LIFO Cost Basis Engine
- Add FIFO and LIFO to portfolio logic
- Apply selectively per user/asset
- Show matching sale lots and cost basis

#### Sprint 30: Performance by Asset, Sector, Region
- Portfolio analytics by asset class
- Aggregate returns by region/sector
- Enable filters in dashboard

#### Sprint 31: Portfolio Groups (e.g. Core vs Speculative)
- Allow users to group assets manually
- Compare group-level performance
- Custom tagging system

#### Sprint 32: CSV Export for All Modules
- Export portfolio, budget, and debt transactions
- Filtered exports (e.g. one date range or type)
- Download CSV or Google Sheets-compatible format

#### Sprint 33: Chart Overlays
- Overlay cost basis vs market value
- Add custom annotations (e.g. dividend received)
- Toggle chart settings

#### Sprint 34: User Settings + Regional Options
- Preferred currency and timezone
- Date formats and localization
- Platform-specific settings (e.g. default FX)

#### Sprint 35: Public Community Portfolio (Bill)
- Add public view of Bill’s monthly updates
- Dynamic chart of budget vs actual
- Investment timeline and asset log

#### Sprint 36: Portfolio Milestones & Tracking
- Cumulative dividends, gains, deposits
- Achievements and first-time milestones
- Net worth progress bar

#### Sprint 37: Mobile Optimization
- Redesign key pages for mobile-first
- Bottom-tab nav for Portfolio, Budget, Debt, Net Worth
- Swipe gestures and tap interactions

#### Sprint 38: Gamification – Achievements
- Badges: First Trade, First 10k, No-Spend Streak
- Progress rings and challenge streaks
- Backend logic + frontend display

#### Sprint 39: Gamification – Story Mode
- Progress-based narrative (e.g. Bill’s journey)
- Unlock features as users progress
- Track completion % and goals

#### Sprint 40: Monthly Reports (Auto)
- Monthly recap email: performance, budget, debt
- Highlight wins, savings rate, top expenses
- PDF generation and email logic

#### Sprint 41: Firebase Enhancements
- Add password reset and change
- Re-auth flows for security
- Future 2FA support planning

#### Sprint 42: Error Handling + Analytics
- Integrate Sentry for backend/frontend errors
- Add usage analytics (e.g. page visits, saves)
- Crash reporting and error recovery

#### Sprint 43: Frontend Polish Pass
- Consistent UI theming
- Add loading states, error banners
- UX polish (tooltips, placeholder messages)

#### Sprint 44: Cross-Platform Syncing
- Simulate syncing between mobile and desktop
- Auto-refresh data when switching tabs
- Rehydrate state from Firebase tokens

#### Sprint 45: Frontend Testing Suite
- Add Cypress or Playwright tests
- Simulate user flows (add transaction, view net worth)
- Ensure new updates don’t break core logic

#### Sprint 46: Looker Studio / Supabase Dashboard
- Build personal dashboards from app data
- Sync PostgreSQL to Supabase or BigQuery
- Explore visualizations outside the app

#### Sprint 47: Production Hardening
- Stress test APIs
- Clean up logs, error boundaries
- Validate DB indexes and performance

#### Sprint 48: API Rate Limiting and Abuse Protection
- Add per-user request limits
- Protect CoinGecko/EODHD keys
- Block spammy traffic

#### Sprint 49: SEO, Marketing, Landing Page
- Public homepage with feature comparison
- Add SEO metadata and descriptions
- Signup buttons and pricing table (if applicable)

#### Sprint 50: MVP Launch 🚀
- UI + backend complete for all modules
- Bill's Portfolio is live and updated monthly
- Full performance, budget, debt, net worth system works
- Community portfolio and CSV tooling functional
- Public-facing dashboard to share

---

## 🪄 Post-MVP Sprints (Optional/Future)

- AI-based suggestions (e.g. flag overspending)
- Open banking integrations (read-only)
- In-app tips and onboarding
- Chat-style journal for finances
- Portfolio rebalancing tools
- Performance benchmark vs ETFs or indexes
- Alerts for dividend income or goal milestones
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