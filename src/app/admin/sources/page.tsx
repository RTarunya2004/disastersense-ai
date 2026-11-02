"use client";

import { useState, useEffect } from "react";
import { ApiSourceMetadata } from "@/types";
import { Database, ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<ApiSourceMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const d = await res.json();
        setSources(d.sources || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-atmosphere-border">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-1.5 rounded-lg bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-muted">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-heading text-atmosphere-text">
              Data Pipeline & Source Health Monitor
            </h1>
            <p className="text-xs font-mono text-atmosphere-muted">
              Real-time ping latency, upstream SLA status, and authority classifications
            </p>
          </div>
        </div>

        <button
          onClick={fetchHealth}
          disabled={loading}
          className="p-2 rounded-lg bg-atmosphere-surface border border-atmosphere-border text-atmosphere-ice flex items-center gap-2 text-xs font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Ping Upstream Pipelines</span>
        </button>
      </div>

      <div className="space-y-4">
        {sources.map(s => (
          <div key={s.id} className="glass-panel p-5 rounded-2xl border border-atmosphere-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-atmosphere-surface text-atmosphere-ice border border-atmosphere-border">
                  {s.category}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${s.isOfficialWarningAuthority ? "bg-atmosphere-warning/20 text-atmosphere-warning" : "text-atmosphere-muted"}`}>
                  {s.isOfficialWarningAuthority ? "Statutory Warning Authority" : "Numerical NWP Model"}
                </span>
              </div>
              <h3 className="text-base font-bold text-atmosphere-text">{s.name}</h3>
              <p className="text-xs font-mono text-atmosphere-muted">{s.endpointUrl}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-atmosphere-muted">Ping: <strong className="text-atmosphere-text">{s.lastPingMs} ms</strong></span>
              <span className="px-2.5 py-1 rounded bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40 font-bold uppercase">
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
