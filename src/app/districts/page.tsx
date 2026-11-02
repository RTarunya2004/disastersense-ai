"use client";

import { useState } from "react";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { Search, Compass, MapPin, Waves, ShieldAlert, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DistrictsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "COASTAL" | "INLAND">("ALL");
  const [filterTier, setFilterTier] = useState<"ALL" | "VERY_HIGH" | "HIGH" | "MODERATE">("ALL");

  const filtered = ODISHA_DISTRICTS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.headquarters.toLowerCase().includes(search.toLowerCase()) ||
      d.nameOdia.includes(search);
    const matchesType =
      filterType === "ALL" ? true : filterType === "COASTAL" ? d.isCoastal : !d.isCoastal;
    const matchesTier =
      filterTier === "ALL" ? true : d.vulnerabilityTier === filterTier;
    return matchesSearch && matchesType && matchesTier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-atmosphere-border">
        <div>
          <h1 className="text-2xl font-bold font-heading text-atmosphere-text">
            Odisha Administrative District Explorer
          </h1>
          <p className="text-xs font-mono text-atmosphere-muted">
            All 30 Districts &bull; Coastal Surge Belts &bull; River Catchment Basins &bull; Vulnerability Cadastre
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-atmosphere-surface border border-atmosphere-border text-atmosphere-teal">
          Showing {filtered.length} of 30 Districts
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-4 rounded-xl border border-atmosphere-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-atmosphere-muted" />
          <input
            type="text"
            placeholder="Search district by name, headquarters or Odia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Coastal vs Inland */}
          <div className="flex rounded-lg border border-atmosphere-border bg-atmosphere-surface p-0.5 text-xs font-mono">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded ${filterType === "ALL" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType("COASTAL")}
              className={`px-3 py-1.5 rounded ${filterType === "COASTAL" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              Coastal (7)
            </button>
            <button
              onClick={() => setFilterType("INLAND")}
              className={`px-3 py-1.5 rounded ${filterType === "INLAND" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              Inland (23)
            </button>
          </div>

          {/* Vulnerability Tier */}
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value as any)}
            className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-atmosphere-ice"
          >
            <option value="ALL">All Vulnerability Tiers</option>
            <option value="VERY_HIGH">Very High Vulnerability</option>
            <option value="HIGH">High Vulnerability</option>
            <option value="MODERATE">Moderate Vulnerability</option>
          </select>
        </div>
      </div>

      {/* 30 Districts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="glass-panel p-5 rounded-2xl border border-atmosphere-border hover:border-atmosphere-ice/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-base font-bold font-heading text-atmosphere-text group-hover:text-atmosphere-ice transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs font-mono text-atmosphere-teal">{d.nameOdia}</p>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                  d.vulnerabilityTier === "VERY_HIGH" ? "bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe/40" :
                  d.vulnerabilityTier === "HIGH" ? "bg-atmosphere-warning/20 text-atmosphere-warning border border-atmosphere-warning/40" :
                  "bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40"
                }`}>
                  {d.vulnerabilityTier.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-atmosphere-muted my-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-atmosphere-ice shrink-0" />
                  <span>HQ: {d.headquarters} &bull; {d.coordinates.lat.toFixed(2)}°N, {d.coordinates.lng.toFixed(2)}°E</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-atmosphere-teal shrink-0" />
                  <span>Rivers: {d.majorRivers.slice(0, 2).join(", ")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-atmosphere-warning shrink-0" />
                  <span>Type: {d.isCoastal ? "Coastal District (High Storm Surge)" : "Inland Catchment"}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-atmosphere-border/50 flex items-center justify-between text-xs font-mono">
              <span className="text-atmosphere-muted">Pop: {d.populationEst}</span>
              <Link
                href={`/dashboard?district=${d.id}`}
                className="text-atmosphere-ice hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View Live Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
