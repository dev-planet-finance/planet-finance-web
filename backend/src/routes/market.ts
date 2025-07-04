import { Router } from 'express';
import { searchAssets } from '../controllers/marketData.controller';

const router = Router();

router.get('/search', searchAssets); // 👈 must be a GET

export default router;
