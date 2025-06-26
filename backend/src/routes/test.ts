import express from 'express';
const router = express.Router();

router.get('/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

export default router;
