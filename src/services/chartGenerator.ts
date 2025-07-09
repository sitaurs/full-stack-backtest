// uses global fetch for API calls

export async function generateCharts(symbol: string, endTime: string) {
  const payload = (interval: string, studies: any[]) => ({
    symbol,
    interval,
    width: 600,
    height: 400,
    endTime,
    studies
  });

  const config = [
    { interval: '1h', studies: [
      { name: 'Moving Average Exponential', input: { length: 50 } },
      { name: 'Relative Strength Index', forceOverlay: false, input: { length: 14 } }
    ]},
    { interval: '5m', studies: [] },
    { interval: '15m', studies: [
      { name: 'Moving Average Exponential', input: { length: 21 } },
      { name: 'Moving Average Exponential', input: { length: 50 } }
    ]},
    { interval: '15m', studies: [
      { name: 'Bollinger Bands', input: { in_0: 20, in_1: 2 } },
      { name: 'Relative Strength Index', forceOverlay: false, input: { length: 14 } }
    ]}
  ];

  const requests = config.map(c => fetch('https://api.chart-img.com/v2/tradingview/advanced-chart', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload(c.interval, c.studies))
  }).then(r => r.arrayBuffer()));

  const images = await Promise.all(requests);
  return images.map(b => Buffer.from(b).toString("base64"));
}
