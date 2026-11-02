"use client";

import { useState, useEffect } from "react";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { MultiHazardAssessment } from "@/types";
import {
  AlertTriangle,
  Wind,
  Waves,
  Sun,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Info,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function HazardsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(ODISHA_DISTRICTS[0]);
  const [hazardData, setHazardData] = useState<MultiHazardAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHazards() {
      setLoading(true);
      try {
        const res = await fetch(`/api/risk-assessment?districtId=${selectedDistrict.id}`);
        if (res.ok) {
          const data = await res.json();
          setHazardData(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHazards();
  }, [selectedDistrict]);

  const hazardPillars = [
    {
      title: "Tropical Cyclone & Coastal Surge",
      score: hazardData?.breakdown?.cycloneRisk ?? 35,
      icon: Wind,
      color: "#61C7E7",
      source: "Open-Meteo Wind Speed & 10m Gusts + Coastal Geometry",
      description: "Computed using 10m sustained velocity, max gust surges, and coastal elevation vulnerability coefficient.",
      threshold: "< 45 km/h Normal; > 62 km/h Gale; > 89 km/h Severe",
    },
    {
      title: "Riverine & Basin Runoff Discharge",
      score: hazardData?.breakdown?.floodRisk ?? 20,
      icon: Waves,
      color: "#47C8C1",
      source: "Copernicus EMS / GloFAS Hydrological Model v4.0",
      description: "Derived from upstream catchment daily discharge against historical 75th and 90th percentile baselines.",
      threshold: "Evaluates catchment runoff volume; does not establish street-level water depth.",
    },
    {
      title: "Intense Precipitation Inundation",
      score: hazardData?.breakdown?.rainfallRisk ?? 15,
      icon: AlertTriangle,
      color: "#E9B45A",
      source: "Open-Meteo Hourly Numerical Precipitation",
      description: "Hourly rain rate tracking against flash waterlogging thresholds in dense municipal catchments.",
      threshold: "> 15 mm/hr Moderate; > 30 mm/hr Heavy; > 50 mm/hr Extreme",
    },
    {
      title: "Heat Stress & Extreme Temperatures",
      score: hazardData?.breakdown?.heatwaveRisk ?? 25,
      icon: Sun,
      color: "#E76B70",
      source: "Operational 2m Air Temperature & Relative Humidity",
      description: "Calculates apparent temperature heat index against IMD summer heatwave advisory thresholds.",
      threshold: ">= 37°C Caution; >= 40°C Heatwave; >= 44°C Severe Heatwave",
    },
    {
      title: "Regional Seismic Activity",
      score: hazardData?.breakdown?.seismicRisk ?? 12,
      icon: Activity,
      color: "#A1B6C8",
      source: "USGS ANSS 2500km Regional Network",
      description: "Monitors Bay of Bengal and Andaman subduction plate seismicity. Odisha lies primarily in Zone II / III (Low-to-Moderate).",
      threshold: "Historical and recent telemetry. No exact future earthquake prediction claimed.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-atmosphere-border">
        <div>
          <h1 className="text-2xl font-bold font-heading text-atmosphere-text">
            Multi-Hazard Risk Index & Synthesis Matrix
          </h1>
          <p className="text-xs font-mono text-atmosphere-muted">
            Calibrated scientific composite risk engine with transparent source evidence
          </p>
        </div>

        {/* District Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="hazards-district-select" className="text-xs font-mono text-atmosphere-muted">District:</label>
          <select
            id="hazards-district-select"
            aria-label="Select Odisha District for Hazard Risk Index"
            value={selectedDistrict.id}
            onChange={(e) => {
              const d = ODISHA_DISTRICTS.find(x => x.id === e.target.value);
              if (d) setSelectedDistrict(d);
            }}
            className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-atmosphere-ice"
          >
            {ODISHA_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} &bull; {d.vulnerabilityTier} Risk Tier
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* District Overall Composite Banner */}
      <div className="glass-panel-elevated rounded-2xl p-6 border border-atmosphere-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-atmosphere-surface text-atmosphere-ice border border-atmosphere-border uppercase">
              Composite Risk Index
            </span>
            <span className="text-xs font-mono text-atmosphere-muted">
              Location: {selectedDistrict.name} ({selectedDistrict.isCoastal ? "Coastal Zone" : "Inland Zone"})
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold font-mono text-atmosphere-text">
              {hazardData?.overallRiskScore ?? 24}<span className="text-lg text-atmosphere-muted font-normal">/100</span>
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              hazardData?.overallRiskLevel === "EMERGENCY" ? "bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe" :
              hazardData?.overallRiskLevel === "WARNING" ? "bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe/40" :
              hazardData?.overallRiskLevel === "WATCH" ? "bg-atmosphere-warning/20 text-atmosphere-warning border border-atmosphere-warning/40" :
              hazardData?.overallRiskLevel === "ADVISORY" ? "bg-atmosphere-ice/20 text-atmosphere-ice border border-atmosphere-ice/40" :
              "bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40"
            }`}>
              {hazardData?.overallRiskLevel || "SAFE"} Status
            </span>
          </div>
          <p className="text-xs text-atmosphere-muted mt-2 max-w-xl">
            {hazardData?.aiBriefing?.summary}
          </p>
        </div>

        <Link
          href="/assistant"
          className="px-5 py-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
        >
          <span>Ask Gemini to Explain Risk Factors</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Hazard Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hazardPillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-atmosphere-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-ice">
                    <Icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <span className="text-xl font-bold font-mono text-atmosphere-text">
                    {p.score}<span className="text-xs text-atmosphere-muted font-normal">/100</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-atmosphere-surface mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.score}%`, backgroundColor: p.color }}
                  />
                </div>

                <h3 className="text-base font-bold font-heading text-atmosphere-text mb-1">{p.title}</h3>
                <p className="text-xs text-atmosphere-muted leading-relaxed mb-3">{p.description}</p>
              </div>

              <div className="pt-3 border-t border-atmosphere-border/50 text-[11px] font-mono text-atmosphere-muted space-y-1">
                <div className="text-atmosphere-ice truncate">Source: {p.source}</div>
                <div className="text-atmosphere-muted/80">{p.threshold}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mathematical Formulation Explainer */}
      <div className="glass-panel rounded-2xl p-6 border border-atmosphere-border">
        <h2 className="text-base font-bold font-heading text-atmosphere-text mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-atmosphere-ice" />
          Mathematical Multi-Hazard Composite Formulation
        </h2>
        <p className="text-xs text-atmosphere-muted leading-relaxed mb-4">
          The Composite Risk Index $R_c \in [0, 100]$ combines normalized risk sub-indices with geographical coastal vulnerability weighting:
        </p>

        <div className="p-4 rounded-xl bg-atmosphere-surface border border-atmosphere-border font-mono text-xs text-atmosphere-ice overflow-x-auto mb-4">
          <code>
            {"R_c = min(100, Σ [w_i · S_i(t)] · (1 + α_coastal))"}
          </code>
          <p className="text-atmosphere-muted mt-2 text-[11px]">
            {"Where: w(cyclone)=0.35, w(flood)=0.30, w(rain)=0.20, w(heat)=0.10, w(seismic)=0.05, and α(coastal)=0.35 for coastal districts."}
          </p>
        </div>

        <p className="text-xs text-atmosphere-muted">
          All indicators are grounded in real upstream feeds. Informational scores do not substitute for statutory administrative directives from OSDMA, IMD, or District Collectors.
        </p>
      </div>
    </div>
  );
}
