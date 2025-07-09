import { Router } from 'express';
import { runBacktest } from '../services/orchestrator';

const router = Router();

router.post('/run', async (req, res) => {
  try {
    const config = req.body;
    const result = await runBacktest(config);
    res.json(result);
  } catch (err) {
    console.error('Backtest error', err);
    res.status(500).json({ error: 'Backtest failed' });
  }
});

export default router;
