import fs from 'fs-extra';
import path from 'path';

const CACHE_DIR = path.join(__dirname, '../../cache');

export async function fetchOHLCV(symbol:string, timeframe:string, start:string, end:string) {
  await fs.ensureDir(CACHE_DIR);
  const cacheFile = path.join(CACHE_DIR, `${symbol}_${timeframe}_${start}_${end}.json`);
  if (await fs.pathExists(cacheFile)) {
    return fs.readJson(cacheFile);
  }
  const url = `https://api.mt5.flx.web.id/fetch_data_range?symbol=${symbol}&timeframe=${timeframe}&start=${start}&end=${end}`;
  const res = await fetch(url);
  const json = await res.json();
  await fs.writeJson(cacheFile, json);
  return json;
}
