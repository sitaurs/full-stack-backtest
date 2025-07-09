import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ReportDetail() {
  const { id } = useParams();
  const [report,setReport] = useState<any>(null);

  useEffect(()=>{
    fetch(`/api/reports/${id}`).then(r=>r.json()).then(setReport);
  },[id]);

  if(!report) return <div>Loading...</div>;

  return (
    <div>
      <h2>Report {id}</h2>
      <pre>{JSON.stringify(report, null, 2)}</pre>
      <button onClick={async()=>{
        const r = await fetch(`/api/reports/${id}/evaluate`, {method:'POST'});
        const j = await r.json();
        alert(j.evaluation);
      }}>Evaluate with Gemini</button>
    </div>
  );
}
