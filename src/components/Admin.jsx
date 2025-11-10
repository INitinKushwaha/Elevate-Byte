import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
const ADMIN_URL = import.meta.env.VITE_APPS_SCRIPT_ADMIN_URL || import.meta.env.VITE_APPS_SCRIPT_URL;

function Table({title, columns, rows}){
  return (
    <div className="bg-white p-4 rounded shadow overflow-auto">
      <h4 className="font-semibold mb-2">{title} (last {rows.length})</h4>
      <table className="min-w-full text-left text-sm">
        <thead><tr>{columns.map((c,i)=>(<th key={i} className="p-2 border-b">{c}</th>))}</tr></thead>
        <tbody>
          {rows.map((r,idx)=>(
            <tr key={idx} className="odd:bg-slate-50">
              {r.map((cell,ci)=>(<td key={ci} className="p-2 align-top border-b break-words max-w-[300px]">{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Admin(){
  const [candidates,setCandidates]=useState([]);
  const [clients,setClients]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  useEffect(()=>{
    async function fetchData(){
      setLoading(true); setError(null);
      try{
        const url = ADMIN_URL + (ADMIN_URL.includes('?') ? '&admin=true' : '?admin=true');
        const res = await fetch(url);
        const text = await res.text();
        if (text.trim().startsWith('{')) {
          const js = JSON.parse(text);
          setCandidates(js.Candidates || []);
          setClients(js.Clients || []);
        } else {
          const blocks = text.split('\n--SHEET--\n');
          let cand = [], cli = [];
          blocks.forEach(block=>{
            if (block.startsWith('Sheet:Candidates')) { const csv = block.split('\n').slice(1).join('\n'); const parsed = Papa.parse(csv).data; cand = parsed.filter(r=>r.length>0); }
            if (block.startsWith('Sheet:Clients')) { const csv = block.split('\n').slice(1).join('\n'); const parsed = Papa.parse(csv).data; cli = parsed.filter(r=>r.length>0); }
          });
          setCandidates(cand);
          setClients(cli);
        }
      }catch(err){ setError(err.message); }
      setLoading(false);
    }
    fetchData();
  },[]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Admin — Elevate Byte</h2>
        <p className="text-sm text-slate-600 mb-4">This page fetches recent submissions from your Google Sheets via the Apps Script admin endpoint.</p>
        {loading && <div className="mb-4">Loading...</div>}
        {error && <div className="mb-4 text-red-600">Error: {error}</div>}
        <div className="grid md:grid-cols-1 gap-4">
          <Table title="Candidates" columns={['Timestamp','Name','Email','Phone','Skills','Experience','ResumeURL','Notes']} rows={candidates} />
          <Table title="Clients" columns={['Timestamp','Company','ContactName','Email','Phone','Service','Message']} rows={clients} />
        </div>
      </div>
    </div>
  )
}
