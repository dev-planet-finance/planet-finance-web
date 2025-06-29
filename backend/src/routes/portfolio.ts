import { Router, RequestHandler } from 'express';
import {
  createTransaction,
  getTransactionsByUserId,
  createHolding,
  getPortfolioSummary
} from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/transactions',
  [authenticate as RequestHandler, createTransaction as RequestHandler]
);

router.get(
  '/transactions/:userId',
  [authenticate as RequestHandler, getTransactionsByUserId as RequestHandler]
);

router.post(
  '/holding',
  [authenticate as RequestHandler, createHolding as RequestHandler]
);

router.get(
  '/summary',
  [authenticate as RequestHandler, getPortfolioSummary as RequestHandler]
);

export default router;
