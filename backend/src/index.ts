/// <reference types="./types/express" />

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import portfolioRoutes from './routes/portfolio';
import testRoutes from './routes/test';
import authRoutes from './routes/auth';
import budgetRoutes from './routes/budget';
import debtRoutes from './routes/debt';
import debtTransactionRoutes from './routes/debtTransaction';
import netWorthRoutes from './routes/netWorth';
import marketRoutes from './routes/market';
import { listUserHoldings } from './controllers/portfolio.controller';
import authMiddleware from './middleware/authMiddleware'; // ✅ CORRECT

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/debt', debtRoutes);
app.use('/api/debt/transactions', debtTransactionRoutes);
app.use('/api/net-worth', netWorthRoutes);
app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.get('/api/portfolio/debug-holdings', authMiddleware, listUserHoldings); // ✅ FIXED

app.get('/', (_req, res) => {
  res.send('Planet Finance Backend is running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});