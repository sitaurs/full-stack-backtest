import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import backtestRouter from './routes/backtest';
import reportsRouter from './routes/reports';

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));

app.use('/api/backtest', backtestRouter);
app.use('/api/reports', reportsRouter);

app.get('/', (_req, res) => {
  res.send('Backtest server running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
