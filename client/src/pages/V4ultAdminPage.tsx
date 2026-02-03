import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

type AdminConfessionRow = {
  id: string;
  shortId: string;
  senderRealName: string;
  targetCrushName: string;
  body: string;
  vibe: string;
  shadowName: string;
  status: string;
  viewCount: number;
  validationScore: number;
  toxicityScore: number;
  toxicityFlagged: boolean;
  department: string | null;
  createdAt: string | null;
};

export default function V4ultAdminPage() {
  const [rows, setRows] = useState<AdminConfessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch("/api/v4ult/admin/confessions", {
        headers: {
          "x-v4ult-admin-token": import.meta.env.VITE_V4ULT_ADMIN_TOKEN as string,
        },
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = (await res.json()) as AdminConfessionRow[];
      setRows(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load confessions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // Poll every 10 seconds for new confessions
    const interval = setInterval(() => void loadData(), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!window.confirm(`Mark confession as "${newStatus}"?`)) return;

    setUpdating(id);
    try {
      const res = await fetch(`/api/v4ult/admin/confessions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-v4ult-admin-token": import.meta.env.VITE_V4ULT_ADMIN_TOKEN as string,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRows((prev) =>
          prev.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 px-4 py-6 md:px-10 md:py-10">
      <div className="pointer-events-none fixed inset-0 mix-blend-overlay opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-pink-500 mb-1">
              V4ULT // STC
            </p>
            <h1
              className="text-2xl md:text-3xl font-semibold tracking-tight"
              style={{
                fontFamily:
                  "'Inter Tight', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              Admin Content Factory
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              {rows.length} secret{rows.length !== 1 ? 's' : ''} in V4ULT • Review & post to IG
            </p>
          </div>
          <button
            onClick={() => void loadData()}
            className="px-3 py-1 text-xs uppercase tracking-[0.18em] border border-pink-500/60 bg-pink-500/10 text-pink-300 rounded-full hover:bg-pink-500/20"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </header>

        <div className="border border-neutral-800 rounded-3xl bg-neutral-950/80 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-800 grid grid-cols-12 gap-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500 overflow-x-auto">
            <div className="col-span-1">Heat</div>
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Sender | Crush</div>
            <div className="col-span-3">Confession Preview</div>
            <div className="col-span-1">Vibe</div>
            <div className="col-span-1">Score</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          {loading ? (
            <div className="px-4 py-10 text-center text-xs text-neutral-500">
              Loading secrets…
            </div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-10 text-center text-xs text-neutral-500">
              No entries in The V4ULT yet.
            </div>
          ) : (
            <div className="divide-y divide-neutral-900 max-h-[calc(100vh-300px)] overflow-y-auto">
              {rows.map((row) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 grid grid-cols-12 gap-2 items-center text-xs hover:bg-neutral-900/50 transition"
                >
                  {/* Heat */}
                  <div className="col-span-1">
                    <span className="inline-flex items-center justify-center rounded-full border border-pink-500/60 bg-pink-500/10 px-1 py-0.5 text-[10px] text-pink-400">
                      {row.viewCount} 👀
                    </span>
                  </div>

                  {/* ID */}
                  <div className="col-span-1 font-mono text-[11px] text-neutral-300">
                    #{row.shortId}
                  </div>

                  {/* Sender | Crush */}
                  <div className="col-span-2 flex flex-col gap-1 truncate">
                    <div className="text-[10px] text-neutral-200 truncate">
                      <strong>{row.senderRealName}</strong>
                    </div>
                    <div className="text-[10px] text-pink-400 truncate">
                      → {row.targetCrushName}
                    </div>
                  </div>

                  {/* Confession Preview */}
                  <div className="col-span-3 text-[10px] text-neutral-400 truncate">
                    "{row.body.substring(0, 50)}…"
                  </div>

                  {/* Vibe */}
                  <div className="col-span-1 text-[10px]">
                    {row.vibe}
                  </div>

                  {/* Validation Score */}
                  <div className="col-span-1 text-center">
                    <span className={`text-[10px] font-bold ${row.validationScore >= 80 ? 'text-green-500' :
                        row.validationScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {row.validationScore}%
                    </span>
                    {row.toxicityFlagged && (
                      <div className="text-[9px] text-red-500">⚠️ Flagged</div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <select
                      value={row.status}
                      onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                      disabled={updating === row.id}
                      className="bg-neutral-900 border border-neutral-700 rounded px-1.5 py-0.5 text-[10px] text-neutral-200 focus:border-pink-500 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="posted">Posted</option>
                      <option value="revealed">Revealed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex gap-1 justify-end">
                    <Link href={`/admin/export/${row.shortId}`}>
                      <a className="inline-flex items-center justify-center rounded-full border border-cyan-500/70 bg-cyan-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-cyan-300 hover:bg-cyan-500/20">
                        Story
                      </a>
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${row.senderRealName}'s confession?`)) {
                          // TODO: Implement delete
                          console.log("Delete:", row.id);
                        }
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-red-500/70 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-red-300 hover:bg-red-500/20"
                    >
                      Del
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

