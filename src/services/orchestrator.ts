import { fetchOHLCV } from './dataManager';
import { generateCharts } from './chartGenerator';
import { analyze } from './aiService';
import { TradeManager, Order } from './tradeManager';
import { saveReport } from './reportService';

export interface BacktestConfig {
  symbol: string;
  startDate: string;
  endDate: string;
  skipCandles: number;
  promptMain: string;
  promptExtract: string;
}

export async function runBacktest(cfg: BacktestConfig) {
  const candles = await fetchOHLCV(cfg.symbol,'M15',cfg.startDate,cfg.endDate);
  const tm = new TradeManager();
  for(let i=0;i<candles.length;i++) {
    const candle = candles[i];
    tm.update(candle);
    if(!tm.hasOpenPosition()) {
      const winStart = Math.max(0,i-80);
      const windowData = candles.slice(winStart,i+1);
      const charts = await generateCharts(cfg.symbol,candle.time);
      const decision = await analyze(cfg.promptMain,cfg.promptExtract,windowData,charts);
      if(decision.decision==='TRADE' && decision.trade){
        const order:Order={...decision.trade,time:candle.time,expires:180};
        tm.openOrder(order);
      } else {
        i += cfg.skipCandles;
      }
    }
  }
  const id = `run-${new Date().toISOString()}`;
  const report = {
    metadata:{
      test_id:id,
      pair:cfg.symbol,
      start_date:cfg.startDate,
      end_date:cfg.endDate
    },
    trades: tm.getHistory()
  };
  await saveReport(id, report);
  return report;
}
