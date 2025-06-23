import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pingRoute from './routes/ping';
import authRoute from './routes/auth';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/ping', pingRoute);
app.use('/api/auth', authRoute); //

app.get('/', (_req, res) => {
  res.send('Planet Finance Backend is running! 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

