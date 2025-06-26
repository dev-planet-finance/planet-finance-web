// src/routes/test.ts
import { Router, Request, Response, RequestHandler } from 'express';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.send({ message: 'pong' });
});

// Fix squiggly line by casting as RequestHandler
router.get('/protected', authenticate as RequestHandler, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.send(`✅ Protected route accessed by ${user.email}`);
});

export default router;
