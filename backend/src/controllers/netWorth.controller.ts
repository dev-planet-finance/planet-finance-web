import { Request, Response } from 'express';
import { calculateNetWorth } from '../services/netWorthLogic';

export const getNetWorth = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    if (!userId) {
      res.status(400).json({ error: 'Missing authenticated user ID' });
      return;
    }

    const netWorth = await calculateNetWorth(userId, date);
    res.status(200).json({ date, netWorth });
  } catch (error) {
    console.error('❌ Error calculating net worth:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default getNetWorth;