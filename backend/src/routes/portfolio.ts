import { Router, RequestHandler } from 'express';
import {
  createTransaction,
  getTransactionsByUserId,
  createHolding,
  getPortfolioSummary
} from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/authMiddleware';
import { getLiveAssetPrice, searchAssets} from '../controllers/marketData.controller';
import { getBulkPricesForUser } from '../controllers/portfolio.controller';

import { upload } from '../middleware/upload';
import { uploadTransactionsCSV } from '../controllers/portfolio.controller';

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

router.get('/price/:symbol', getLiveAssetPrice);

router.post(
  '/prices',
  [authenticate as RequestHandler, getBulkPricesForUser as RequestHandler]
);

router.get('/search', searchAssets);

router.post(
  '/transactions/upload-csv',
  [authenticate as RequestHandler, upload.single('file'), uploadTransactionsCSV as RequestHandler]
);

export default router;
