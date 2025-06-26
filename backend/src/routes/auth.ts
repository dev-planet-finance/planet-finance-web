import express from 'express';
import { adminAuth } from '../lib/firebaseAdmin';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await adminAuth.createUser({
      email,
      password,
    });

    res.json({
      message: 'User created',
      uid: user.uid,
      email: user.email,
    });
  } catch (error) {
    console.error('Firebase register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  res.status(501).json({
    error: 'Login must be done from frontend using Firebase JS SDK',
  });
});

export default router;

