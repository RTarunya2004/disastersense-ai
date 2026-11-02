"use client";

import { useState } from "react";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { Search, MapPin, Compass, ShieldCheck } from "lucide-react";

interface DistrictSelectorProps {
  selectedDistrictId: string;
  onSelect: (district: (typeof ODISHA_DISTRICTS)[0]) => void;
  className?: string;
}

const QUICK_HUBS = [
  { id: "khordha", name: "Bhubaneswar (Khordha)" },
  { id: "cuttack", name: "Cuttack" },
  { id: "puri", name: "Puri Coast" },
  { id: "balasore", name: "Balasore" },
  { id: "ganjam", name: "Ganjam" },
  { id: "sambalpur", name: "Sambalpur" },
  { id: "sundargarh", name: "Rourkela" },
];

export default function DistrictSelector({
  selectedDistrictId,
  onSelect,
  className = "",
}: DistrictSelectorProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = ODISHA_DISTRICTS.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.headquarters.toLowerCase().includes(query.toLowerCase())
  );

  const current = ODISHA_DISTRICTS.find((d) => d.id === selectedDistrictId) || ODISHA_DISTRICTS[0];

  return (
    <div className={`relative ${className}`}>
      {/* Quick Access Coastal / Urban Hub Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2">
        <span className="text-[11px] font-mono text-atmosphere-muted uppercase flex items-center gap-1 shrink-0 pr-1">
          <Compass className="w-3.5 h-3.5 text-atmosphere-ice" />
          Quick Switch:
        </span>
        {QUICK_HUBS.map((hub) => {
          const isSelected = hub.id === selectedDistrictId;
          const districtObj = ODISHA_DISTRICTS.find((d) => d.id === hub.id);
          return (
            <button
              key={hub.id}
              onClick={() => {
                if (districtObj) onSelect(districtObj);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono shrink-0 transition-all ${
                isSelected
                  ? "bg-atmosphere-ice text-atmosphere-bg font-bold shadow-glow"
                  : "bg-atmosphere-surface text-atmosphere-muted hover:text-atmosphere-text border border-atmosphere-border hover:border-atmosphere-ice/30"
              }`}
            >
              {hub.name}
            </button>
          );
        })}
      </div>

      {/* Main Dropdown Search Box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-atmosphere-muted pointer-events-none" />
          <input
            type="text"
            placeholder={`Selected: ${current.name} (Search 30 Districts)...`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-xl pl-10 pr-24 py-2.5 text-xs font-mono text-atmosphere-text placeholder:text-atmosphere-muted/70 focus:outline-none focus:border-atmosphere-ice transition-colors shadow-inner"
          />
          <span className="absolute right-3 text-[11px] font-mono text-atmosphere-teal px-2 py-0.5 rounded bg-atmosphere-elevated border border-atmosphere-border">
            30 Districts
          </span>
        </div>

        {/* Dropdown Options List */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 right-0 mt-2 z-40 max-h-72 overflow-y-auto rounded-2xl glass-dropdown border border-atmosphere-border shadow-2xl p-1.5 space-y-1">
              {filtered.length === 0 ? (
                <div className="p-3 text-xs font-mono text-atmosphere-muted text-center">
                  No matching district found in Odisha
                </div>
              ) : (
                filtered.map((district) => {
                  const isSelected = district.id === selectedDistrictId;
                  return (
                    <button
                      key={district.id}
                      onClick={() => {
                        onSelect(district);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-atmosphere-ice/20 border border-atmosphere-ice/40 text-atmosphere-ice"
                          : "hover:bg-atmosphere-elevated text-atmosphere-text"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-atmosphere-teal shrink-0" />
                        <div>
                          <span className="font-bold font-heading text-sm">{district.name}</span>
                          <span className="text-[11px] font-mono text-atmosphere-muted ml-2">
                            HQ: {district.headquarters}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-atmosphere-muted uppercase">
                        {district.coordinates.lat.toFixed(2)}°N, {district.coordinates.lng.toFixed(2)}°E
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
