import {
  createDebt,
  getDebtsByUser
} from '../controllers/debt.controller';
import { authenticate } from '../middleware/authMiddleware';
import { Router, RequestHandler } from 'express';

const router = Router();

router.post(
  '/',
  [authenticate as RequestHandler, createDebt as unknown as RequestHandler]
);

router.get(
  '/',
  [authenticate as RequestHandler, getDebtsByUser as unknown as RequestHandler]
);

export default router;
