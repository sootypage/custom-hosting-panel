type NodeRow = { id: string; url: string; lastSeen?: string };

async function getNodes(): Promise<NodeRow[]> {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost/api";
  try {
    // MVP: requires auth, so this will fail until login is implemented in UI.
    const res = await fetch(`${api}/nodes`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.nodes || [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const nodes = await getNodes();

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-base font-semibold">Status</h2>
        <p className="mt-2 text-sm text-zinc-300">
          This is a starter UI. Next step is adding login + a real dashboard, server pages,
          and template-based game creation.
        </p>
        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
            <div className="text-zinc-300">API health</div>
            <code className="text-zinc-400">/api/health</code>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Nodes</h2>
          <span className="text-xs text-zinc-400">MVP (auth not wired in UI yet)</span>
        </div>

        {nodes.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">
            No nodes shown here yet (the `/nodes` endpoint requires auth). Once login UI is added,
            you’ll see your registered nodes.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-950/50 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 text-left">Node</th>
                  <th className="px-4 py-3 text-left">URL</th>
                  <th className="px-4 py-3 text-left">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((n) => (
                  <tr key={n.id} className="border-t border-zinc-800">
                    <td className="px-4 py-3 font-medium">{n.id}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-300">{n.url}</td>
                    <td className="px-4 py-3 text-zinc-400">{n.lastSeen || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
