import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ReportMeta {id:string; pair:string; startDate:string; endDate:string;}

export default function Reports() {
  const [reports,setReports] = useState<ReportMeta[]>([]);
  useEffect(()=>{
    fetch('/api/reports').then(r=>r.json()).then(setReports);
  },[]);
  return (
    <div>
      <h2>Reports</h2>
      <ul>
        {reports.map(r=>(
          <li key={r.id}><Link to={`/reports/${r.id}`}>{r.id} - {r.pair}</Link></li>
        ))}
      </ul>
    </div>
  );
}
