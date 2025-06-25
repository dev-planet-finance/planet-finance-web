import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public test route
router.get('/', (_req: Request, res: Response) => {
  res.send('✅ Public test route working!');
});

// 🔐 Protected test route
router.get('/protected', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.send(`✅ Protected route accessed by ${user.email}`);
});

export default router;
