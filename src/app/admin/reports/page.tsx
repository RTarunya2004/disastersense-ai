"use client";

import { useState, useEffect } from "react";
import { CommunityReport } from "@/types";
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, RefreshCw, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports?district=ALL");
      if (res.ok) {
        const d = await res.json();
        setReports(d.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id: string, newStatus: "VERIFIED" | "RESOLVED" | "UNDER_REVIEW") => {
    try {
      const res = await fetch("/api/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-atmosphere-border">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-1.5 rounded-lg bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-muted">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-heading text-atmosphere-text">
              Citizen Incident Verification Queue
            </h1>
            <p className="text-xs font-mono text-atmosphere-muted">
              Triage unverified reports, verify ground reports, or mark hazard resolutions
            </p>
          </div>
        </div>

        <button
          onClick={fetchReports}
          disabled={loading}
          className="p-2 rounded-lg bg-atmosphere-surface border border-atmosphere-border text-atmosphere-ice flex items-center gap-2 text-xs font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Reload Queue</span>
        </button>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div key={rep.id} className="glass-panel p-5 rounded-2xl border border-atmosphere-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-atmosphere-surface text-atmosphere-muted border border-atmosphere-border">
                  {rep.id}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  rep.status === "VERIFIED" ? "bg-atmosphere-safe/20 text-atmosphere-safe" :
                  rep.status === "RESOLVED" ? "bg-atmosphere-ice/20 text-atmosphere-ice" :
                  "bg-atmosphere-warning/20 text-atmosphere-warning"
                }`}>
                  {rep.status}
                </span>
                <span className="text-xs font-bold text-atmosphere-ice">{rep.category}</span>
                <span className="text-xs font-mono text-atmosphere-muted">&bull; {rep.district}</span>
              </div>

              <h3 className="text-sm font-bold text-atmosphere-text">{rep.locationName}</h3>
              <p className="text-xs text-atmosphere-muted leading-relaxed">{rep.description}</p>
              <div className="text-[11px] font-mono text-atmosphere-muted">
                Reported by: <strong>{rep.reporterAlias}</strong> &bull; {rep.upvotes} Citizen Upvotes
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {rep.status !== "VERIFIED" && (
                <button
                  onClick={() => updateStatus(rep.id, "VERIFIED")}
                  className="px-3 py-1.5 rounded-lg bg-atmosphere-safe/20 border border-atmosphere-safe/40 text-atmosphere-safe hover:bg-atmosphere-safe/30 text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
              )}

              {rep.status !== "RESOLVED" && (
                <button
                  onClick={() => updateStatus(rep.id, "RESOLVED")}
                  className="px-3 py-1.5 rounded-lg bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-muted hover:text-atmosphere-ice text-xs font-mono flex items-center gap-1 transition-colors"
                >
                  <span>Mark Resolved</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
