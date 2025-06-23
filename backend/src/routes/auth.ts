import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  // In a real app, you'd validate and save this to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  res.status(201).json({
    message: 'User registered (mock)',
    email,
    hashedPassword,
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Normally you'd check email and password here
  res.status(200).json({
    message: 'Login successful',
    token: 'mock-token-123',
  });
});

export default router;

