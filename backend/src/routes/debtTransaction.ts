import { Router, RequestHandler } from 'express';
import {
  createDebtTransaction,
  getDebtTransactions
} from '../controllers/debtTransaction.controller';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/',
  [authenticate as RequestHandler, createDebtTransaction as unknown as RequestHandler]
);

router.get(
  '/:debtId',
  [authenticate as RequestHandler, getDebtTransactions as unknown as RequestHandler]
);

export default router;
