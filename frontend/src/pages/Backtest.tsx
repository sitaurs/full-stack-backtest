import { useState } from 'react';

export default function Backtest() {
  const [symbol, setSymbol] = useState('EURUSD');
  const [startDate, setStart] = useState('');
  const [endDate, setEnd] = useState('');
  const [skip, setSkip] = useState(6);
  const [promptMain, setPromptMain] = useState('Jelaskan kondisi market');
  const [promptExtract, setPromptExtract] = useState('Output trade dalam JSON');

  const runBacktest = async () => {
    const res = await fetch('/api/backtest/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol,startDate,endDate,skipCandles:skip,promptMain,promptExtract })
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <h2>Run Backtest</h2>
      <div>
        Symbol: <input value={symbol} onChange={e=>setSymbol(e.target.value)} />
      </div>
      <div>
        Start: <input type="datetime-local" value={startDate} onChange={e=>setStart(e.target.value)} />
        End: <input type="datetime-local" value={endDate} onChange={e=>setEnd(e.target.value)} />
      </div>
      <div>
        Skip Candles: <input type="number" value={skip} onChange={e=>setSkip(parseInt(e.target.value))} />
      </div>
      <div>
        <textarea value={promptMain} onChange={e=>setPromptMain(e.target.value)} rows={4} cols={50} />
      </div>
      <div>
        <textarea value={promptExtract} onChange={e=>setPromptExtract(e.target.value)} rows={2} cols={50} />
      </div>
      <button onClick={runBacktest}>Run</button>
    </div>
  );
}
