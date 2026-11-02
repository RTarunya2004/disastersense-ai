"use client";

import { useState, useEffect } from "react";
import { ApiSourceMetadata } from "@/types";
import { Database, CheckCircle2, AlertTriangle, ExternalLink, Activity, RefreshCw, ShieldCheck } from "lucide-react";

export default function SourcesPage() {
  const [sources, setSources] = useState<ApiSourceMetadata[]>([]);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const d = await res.json();
        setSources(d.sources || []);
        setSystemInfo(d.systemInfo);
        setCacheStats(d.cacheStats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-atmosphere-border">
        <div>
          <h1 className="text-2xl font-bold font-heading text-atmosphere-text">
            Transparent Data Source Provenance Catalog
          </h1>
          <p className="text-xs font-mono text-atmosphere-muted">
            Open-Access Ingestion Pipelines &bull; Update Cadence &bull; Statutory Authority Classifications
          </p>
        </div>

        <button
          onClick={fetchSources}
          disabled={loading}
          className="p-2 rounded-lg bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice transition-colors flex items-center gap-2 text-xs font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Ping All APIs</span>
        </button>
      </div>

      {/* System Cost & Quota Audit Card */}
      <div className="glass-panel-elevated p-6 rounded-2xl border border-atmosphere-border">
        <h2 className="text-base font-bold font-heading text-atmosphere-text mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-atmosphere-ice" />
          ₹0 Zero-Cost Operational Telemetry & Cache Performance
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border">
            <span className="text-atmosphere-muted block mb-1">TOTAL REQUESTS</span>
            <span className="text-xl font-bold text-atmosphere-text">{cacheStats?.totalRequests ?? 0}</span>
          </div>
          <div className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border">
            <span className="text-atmosphere-muted block mb-1">CACHE HIT RATE</span>
            <span className="text-xl font-bold text-atmosphere-safe">{cacheStats?.hitRatePercent ?? "0.0%"}</span>
          </div>
          <div className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border">
            <span className="text-atmosphere-muted block mb-1">BUDGETED COST</span>
            <span className="text-xl font-bold text-atmosphere-teal">₹0.00 (Free Tier)</span>
          </div>
          <div className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border">
            <span className="text-atmosphere-muted block mb-1">ACTIVE CACHE KEYS</span>
            <span className="text-xl font-bold text-atmosphere-ice">{cacheStats?.entriesCount ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Sources Table Grid */}
      <div className="space-y-4">
        {sources.map((s) => (
          <div key={s.id} className="glass-panel p-5 rounded-2xl border border-atmosphere-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-atmosphere-surface text-atmosphere-ice border border-atmosphere-border uppercase">
                  {s.category}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  s.isOfficialWarningAuthority
                    ? "bg-atmosphere-warning/20 text-atmosphere-warning border border-atmosphere-warning/40"
                    : "bg-atmosphere-surface text-atmosphere-muted border border-atmosphere-border"
                }`}>
                  {s.isOfficialWarningAuthority ? "Official Authority Source" : "Numerical NWP / Simulation Model"}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40">
                  {s.status} ({s.lastPingMs}ms)
                </span>
              </div>

              <h3 className="text-base font-bold font-heading text-atmosphere-text">{s.name}</h3>
              <p className="text-xs text-atmosphere-muted font-mono">{s.attribution}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-atmosphere-muted/80 pt-1">
                <span>Update Cadence: <strong className="text-atmosphere-text">{s.updateCadence}</strong></span>
                <span>Endpoint: <code className="text-atmosphere-ice">{s.endpointUrl}</code></span>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href={s.endpointUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice text-xs font-semibold flex items-center gap-1.5 transition-all font-mono"
              >
                <span>Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
