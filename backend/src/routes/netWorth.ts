import { Router, RequestHandler } from 'express';
import { getNetWorth } from '../controllers/netWorth.controller';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get(
  '/',
  [authenticate as RequestHandler, getNetWorth as unknown as RequestHandler]
);

export default router;
