"use client";

import Link from "next/link";
import { Sliders, Activity, FileCheck, Database, Server, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminPage() {
  const adminModules = [
    {
      title: "Citizen Incident Moderation Queue",
      description: "Review, verify, or resolve crowdsourced disaster reports submitted by residents.",
      icon: FileCheck,
      href: "/admin/reports",
      badge: "Triage Active",
      badgeColor: "bg-atmosphere-warning/20 text-atmosphere-warning",
    },
    {
      title: "Data Pipeline & Source Health",
      description: "Monitor live SLA, response latencies, and quota usage across 6 external providers.",
      icon: Database,
      href: "/admin/sources",
      badge: "6 Feeds Online",
      badgeColor: "bg-atmosphere-safe/20 text-atmosphere-safe",
    },
    {
      title: "System Telemetry & Cache Performance",
      description: "Inspect in-memory cache hit rates, serverless process memory, and error audit logs.",
      icon: Activity,
      href: "/admin/system-health",
      badge: "₹0 Budget Compliant",
      badgeColor: "bg-atmosphere-ice/20 text-atmosphere-ice",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-6 border-b border-atmosphere-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe/40 uppercase font-bold">
            Administrative Control Deck
          </span>
        </div>
        <h1 className="text-2xl font-bold font-heading text-atmosphere-text">
          DisasterSense Administrative Operations
        </h1>
        <p className="text-xs font-mono text-atmosphere-muted">
          Privileged console for disaster managers, civil defense moderators, and platform engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminModules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link
              key={idx}
              href={m.href}
              className="glass-panel p-6 rounded-2xl border border-atmosphere-border hover:border-atmosphere-ice/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-ice">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold font-heading text-atmosphere-text group-hover:text-atmosphere-ice transition-colors mb-2">
                  {m.title}
                </h3>
                <p className="text-xs text-atmosphere-muted leading-relaxed mb-4">
                  {m.description}
                </p>
              </div>

              <div className="pt-4 border-t border-atmosphere-border/40 flex items-center justify-between text-xs font-mono text-atmosphere-ice">
                <span>Open Module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
