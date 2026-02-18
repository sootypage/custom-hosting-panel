"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL || "/api";

  async function login() {
    const res = await fetch(`${api}/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Login failed");
    localStorage.setItem("panel_token", data.token);
    router.push("/servers");
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl">
      <h1 className="text-lg font-semibold">Login</h1>
      <input className="border p-2 w-full mt-3"
        value={username} onChange={(e)=>setUsername(e.target.value)} />
      <input className="border p-2 w-full mt-3"
        type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={login} className="mt-4 border px-4 py-2">Login</button>
      {msg && <div className="mt-3 text-sm">{msg}</div>}
    </div>
  );
}
