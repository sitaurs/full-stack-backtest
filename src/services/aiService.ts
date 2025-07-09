import fetch from 'node-fetch';

export interface AnalysisResult {
  decision: 'TRADE' | 'NO_TRADE';
  trade?: any;
}

const PRO_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';
const FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const API_KEY = process.env.API_KEY || '';

function buildProPayload(prompt:string, charts:string[], data:any[]) {
  return {
    contents:[{
      parts:[{text:prompt},{text:JSON.stringify(data)},...charts.map(img=>({inline_data:{mime_type:'image/png', data:img}}))]
    }]
  };
}

export async function analyze(promptMain:string, promptExtract:string, data:any[], charts:string[]):Promise<AnalysisResult> {
  const proRes: any = await fetch(`${PRO_URL}?key=${API_KEY}`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(buildProPayload(promptMain,charts,data))
  }).then(r=>r.json());
  const narrative = proRes.candidates?.[0]?.content?.parts?.[0]?.text || '';

  const flashPayload = {
    contents:[{parts:[{text:promptExtract + '\n' + narrative}]}]
  };
  const flashRes: any = await fetch(`${FLASH_URL}?key=${API_KEY}`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(flashPayload)
  }).then(r=>r.json());
  const line = flashRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
  try {
    return JSON.parse(line);
  } catch(err) {
    return {decision:'NO_TRADE'};
  }
}

export async function evaluateSummary(report:any) {
  const prompt = 'Berikan evaluasi singkat terhadap hasil backtest berikut:';
  const payload = {
    contents:[{parts:[{text:prompt + '\n' + JSON.stringify(report)}]}]
  };
  const res: any = await fetch(`${FLASH_URL}?key=${API_KEY}`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  }).then(r=>r.json());
  return res.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
