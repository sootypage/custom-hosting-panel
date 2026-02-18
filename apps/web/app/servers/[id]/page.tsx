"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ServerPage() {
  const { id } = useParams();
  const [server, setServer] = useState(null);
  const api = process.env.NEXT_PUBLIC_API_URL || "/api";

  async function load() {
    const token = localStorage.getItem("panel_token");
    const res = await fetch(`${api}/servers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setServer(data.server);
  }

  useEffect(()=>{ load(); },[]);

  if (!server) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">{server.name}</h1>
      <div className="mt-3 text-sm">Game: {server.game}</div>
      <div className="mt-1 text-sm">Port: {server.port}</div>
    </div>
  );
}
