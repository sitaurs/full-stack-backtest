import fs from 'fs-extra';
import path from 'path';
import { evaluateSummary } from './aiService';

const REPORT_DIR = path.join(__dirname, '../../reports');

export interface ReportMeta {
  id: string;
  pair: string;
  startDate: string;
  endDate: string;
}

export async function listReports(): Promise<ReportMeta[]> {
  await fs.ensureDir(REPORT_DIR);
  const files = await fs.readdir(REPORT_DIR);
  return Promise.all(files.filter((f:string)=>f.endsWith('.json')).map(async (f:string)=>{
    const data = await fs.readJson(path.join(REPORT_DIR,f));
    return {id: path.basename(f,'.json'), pair:data.metadata.pair, startDate:data.metadata.start_date, endDate:data.metadata.end_date};
  }));
}

export async function getReport(id:string): Promise<any|null> {
  const file = path.join(REPORT_DIR, `${id}.json`);
  if (!await fs.pathExists(file)) return null;
  return fs.readJson(file);
}

export async function saveReport(id:string, data:any) {
  await fs.ensureDir(REPORT_DIR);
  const file = path.join(REPORT_DIR, `${id}.json`);
  await fs.writeJson(file, data, {spaces:2});
}

export async function evaluateReport(id:string) {
  const report = await getReport(id);
  if (!report) return null;
  const evaluation = await evaluateSummary(report);
  report.evaluation = evaluation;
  await saveReport(id, report);
  return {evaluation};
}
