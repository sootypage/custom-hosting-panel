"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateServerPage() {
  const [name, setName] = useState("My Server");
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL || "/api";

  async function create() {
    const token = localStorage.getItem("panel_token");
    const res = await fetch(`${api}/servers`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, nodeId: "node1", game: "paper" })
    });
    const data = await res.json();
    if (res.ok) router.push(`/servers/${data.server.id}`);
  }

  return (
    <div className="p-6">
      <h1>Create Server</h1>
      <input className="border p-2 mt-3"
        value={name} onChange={(e)=>setName(e.target.value)} />
      <button onClick={create} className="block mt-4 border px-4 py-2">
        Create
      </button>
    </div>
  );
}
