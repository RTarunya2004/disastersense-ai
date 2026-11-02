"use client";

import Link from "next/link";
import { MapPin, ArrowRight, ShieldCheck, Plus } from "lucide-react";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";

export default function SavedLocationsPage() {
  const saved = [
    { district: ODISHA_DISTRICTS[0], label: "Home (Nayapalli Residence, Bhubaneswar)", priority: "HIGH" },
    { district: ODISHA_DISTRICTS[2], label: "Ancestral Home (Konark Coastal Belt, Puri)", priority: "VERY_HIGH" },
    { district: ODISHA_DISTRICTS[5], label: "Commercial Office (Paradip Port Road, Jagatsinghpur)", priority: "HIGH" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-atmosphere-border">
        <div>
          <h1 className="text-2xl font-bold font-heading text-atmosphere-text">Monitored Locations & Watchlist</h1>
          <p className="text-xs font-mono text-atmosphere-muted">Real-time risk tracking across your saved family residences and workplaces</p>
        </div>
      </div>

      <div className="space-y-4">
        {saved.map((item, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-atmosphere-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-atmosphere-ice" />
                <h3 className="text-sm font-bold text-atmosphere-text">{item.label}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-atmosphere-surface text-atmosphere-teal border border-atmosphere-border">
                  {item.district.name}
                </span>
              </div>
              <p className="text-xs font-mono text-atmosphere-muted pl-6">
                Coordinates: {item.district.coordinates.lat.toFixed(4)}°N, {item.district.coordinates.lng.toFixed(4)}°E &bull; {item.district.isCoastal ? "Coastal Surge Zone" : "Inland Zone"}
              </p>
            </div>

            <Link
              href={`/dashboard?district=${item.district.id}`}
              className="px-4 py-2 rounded-xl bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice text-xs font-semibold flex items-center gap-1.5 transition-all font-mono shrink-0"
            >
              <span>View Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
