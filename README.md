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

### Sprint 6: Transfer Functionality
- Implemented TransferIn and TransferOut transactions.
- Ensured accurate asset movement between platforms.
- Updated portfolio summaries accordingly.

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

### Sprint 7: Budget Tracker - Backend Implementation
- Design and implement models for budgeting.
- Develop endpoints for budget management.
- Integrate budgeting logic.

### Sprint 8: Debt Tracker - Backend Implementation
- Design and implement models for debts.
- Develop endpoints for debt management.
- Integrate repayment logic.

### Sprint 9: Net Worth Summary - Backend Implementation
- Aggregate data from all trackers.
- Calculate net worth over time.
- Develop endpoints for net worth summaries.

### Sprint 10: Portfolio Tracker - Frontend Integration
- Develop frontend components for portfolio.
- Integrate live price APIs.
- Implement user-friendly features.

### Sprint 11: Budget & Debt Tracker - Frontend Integration
- Develop frontend components for budgeting and debt.
- Ensure seamless user experience.
- Implement visualizations.

### Sprint 12: Net Worth Summary - Frontend Integration
- Develop dashboard for net worth.
- Integrate charts and graphs.
- Ensure real-time updates.

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
