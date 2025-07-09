import { Router } from 'express';
import { listReports, getReport, evaluateReport } from '../services/reportService';

const router = Router();

router.get('/', async (_req, res) => {
  const reports = await listReports();
  res.json(reports);
});

router.get('/:id', async (req, res) => {
  const report = await getReport(req.params.id);
  if (!report) return res.status(404).json({error:'not found'});
  res.json(report);
});

router.post('/:id/evaluate', async (req, res) => {
  const result = await evaluateReport(req.params.id);
  if (!result) return res.status(404).json({error:'not found'});
  res.json(result);
});

export default router;
