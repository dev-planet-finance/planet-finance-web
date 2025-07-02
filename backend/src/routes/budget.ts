import { Router, RequestHandler } from 'express';
import {
  createBudgetTransaction,
  getBudgetTransactionsByUser,
  getFilteredBudget,
} from '../controllers/budget.controller';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/transactions',
  [authenticate as RequestHandler, createBudgetTransaction as RequestHandler]
);

router.get(
  '/transactions',
  [authenticate as RequestHandler, getBudgetTransactionsByUser as RequestHandler]
);

router.get(
  '/filter',
  [authenticate as RequestHandler, getFilteredBudget as RequestHandler]
);

export default router;
