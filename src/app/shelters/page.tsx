"use client";

import { useState } from "react";
import { ODISHA_SHELTERS } from "@/data/odishaShelters";
import { Building2, Search, MapPin, Phone, Zap, Droplets, ExternalLink, ShieldCheck } from "lucide-react";

export default function SheltersPage() {
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const districtsList = Array.from(new Set(ODISHA_SHELTERS.map(s => s.district)));

  const filtered = ODISHA_SHELTERS.filter(s => {
    const matchDistrict = districtFilter === "ALL" || s.district === districtFilter;
    const matchQuery =
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.block.toLowerCase().includes(query.toLowerCase()) ||
      s.village.toLowerCase().includes(query.toLowerCase());
    return matchDistrict && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-atmosphere-border">
        <div>
          <h1 className="text-2xl font-bold font-heading text-atmosphere-text">
            Verified Multipurpose Cyclone & Flood Shelters (MPCS)
          </h1>
          <p className="text-xs font-mono text-atmosphere-muted">
            Official OSDMA Cadastre &bull; Generator Backups &bull; Potable Water Facilities &bull; Capacity Directory
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-atmosphere-surface border border-atmosphere-border text-atmosphere-safe">
          {filtered.length} Shelters Verified
        </div>
      </div>

      {/* Search & District Filter */}
      <div className="glass-panel p-4 rounded-xl border border-atmosphere-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-atmosphere-muted" />
          <input
            type="text"
            placeholder="Search by shelter name, block or village..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
          />
        </div>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-atmosphere-ice"
        >
          <option value="ALL">All Coastal Districts</option>
          {districtsList.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => (
          <div key={s.id} className="glass-panel p-5 rounded-2xl border border-atmosphere-border hover:border-atmosphere-safe/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40">
                  {s.id}
                </span>
                <span className="text-xs font-mono text-atmosphere-muted">
                  Cap: <strong className="text-atmosphere-text">{s.capacity} persons</strong>
                </span>
              </div>

              <h3 className="text-base font-bold font-heading text-atmosphere-text mb-1">{s.name}</h3>
              <p className="text-xs font-mono text-atmosphere-teal mb-3">
                {s.district} &bull; {s.block} Block &bull; {s.village}
              </p>

              {/* Facilities tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {s.facilities.map((f, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-atmosphere-surface text-atmosphere-muted border border-atmosphere-border">
                    {f}
                  </span>
                ))}
              </div>

              <div className="space-y-1.5 text-xs font-mono text-atmosphere-muted border-t border-atmosphere-border/40 pt-3">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-atmosphere-warning" />
                  <span>Generator Backup: {s.backupGenerator ? "Operational 50kVA" : "Standard"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-atmosphere-ice" />
                  <span>Potable Water: {s.potableWater ? "Deep Tube-well with Filter" : "Water Tanker Delivery"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-atmosphere-safe" />
                  <span>{s.contactPerson} ({s.contactNumber})</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-atmosphere-border/60 mt-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-atmosphere-muted">
                {s.coordinates.lat.toFixed(4)}°N, {s.coordinates.lng.toFixed(4)}°E
              </span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${s.coordinates.lat},${s.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-atmosphere-safe hover:underline flex items-center gap-1 font-mono"
              >
                <span>Navigate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
