"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ServersPage() {
  const [servers, setServers] = useState([]);
  const api = process.env.NEXT_PUBLIC_API_URL || "/api";

  async function load() {
    const token = localStorage.getItem("panel_token");
    const res = await fetch(`${api}/servers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setServers(data.servers || []);
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Servers</h1>
      <Link href="/servers/new" className="block mt-3 underline">Create Server</Link>
      <ul className="mt-4">
        {servers.map((s:any)=>(
          <li key={s.id}>
            <Link href={`/servers/${s.id}`} className="underline">{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
