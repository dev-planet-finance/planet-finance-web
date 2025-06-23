import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
res.json({ message: 'pong updated' });
});

export default router;

