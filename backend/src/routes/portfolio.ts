import { Router, RequestHandler } from 'express';
import {
  createTransaction,
  getTransactionsByUserId,
  createHolding,
} from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// 🔒 Secure endpoints by casting middleware and controller to RequestHandler[]
router.post(
  '/transaction',
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

export default router;
