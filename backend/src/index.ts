import express from 'express';
import cors from 'cors';
import pingRoute from './routes/ping';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Mount your new route
app.use('/api/ping', pingRoute);

app.get('/', (_req, res) => {
  res.send('Planet Finance Backend is running! 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

