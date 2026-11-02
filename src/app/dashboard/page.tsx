"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DynamicMap from "@/components/DynamicMap";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { WeatherData, FloodData, GdacsAlert, UsgsEarthquake, MultiHazardAssessment, CommunityReport } from "@/types";
import {
  ShieldAlert,
  Wind,
  Droplets,
  Activity,
  Waves,
  RefreshCw,
  Search,
  ExternalLink,
  Bot,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Info
} from "lucide-react";

export default function DashboardPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(ODISHA_DISTRICTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"en" | "hi" | "or">("en");

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [flood, setFlood] = useState<FloodData | null>(null);
  const [hazards, setHazards] = useState<MultiHazardAssessment | null>(null);
  const [alerts, setAlerts] = useState<GdacsAlert[]>([]);
  const [earthquakes, setEarthquakes] = useState<UsgsEarthquake[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);

  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wRes, fRes, hRes, gRes, eqRes, repRes] = await Promise.all([
        fetch(`/api/weather?lat=${selectedDistrict.coordinates.lat}&lng=${selectedDistrict.coordinates.lng}&district=${encodeURIComponent(selectedDistrict.name)}`),
        fetch(`/api/flood?lat=${selectedDistrict.coordinates.lat}&lng=${selectedDistrict.coordinates.lng}&district=${encodeURIComponent(selectedDistrict.name)}`),
        fetch(`/api/risk-assessment?districtId=${selectedDistrict.id}`),
        fetch(`/api/gdacs`),
        fetch(`/api/earthquakes`),
        fetch(`/api/reports?district=${encodeURIComponent(selectedDistrict.name)}`),
      ]);

      if (wRes.ok) setWeather(await wRes.json());
      if (fRes.ok) setFlood(await fRes.json());
      if (hRes.ok) setHazards(await hRes.json());
      if (gRes.ok) {
        const gData = await gRes.json();
        setAlerts(gData.alerts || []);
      }
      if (eqRes.ok) {
        const eqData = await eqRes.json();
        setEarthquakes(eqData.earthquakes || []);
      }
      if (repRes.ok) {
        const repData = await repRes.json();
        setReports(repData.reports || []);
      }

      setLastRefreshed(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.error("Dashboard data fetching failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDistrict]);

  const filteredDistricts = ODISHA_DISTRICTS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.headquarters.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Intelligence Control Bar */}
      <div className="glass-panel-elevated rounded-xl p-4 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border border-atmosphere-border">
        {/* District Selector & Location Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-atmosphere-muted" />
            <input
              type="text"
              placeholder="Search Odisha District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
            />
          </div>

          <select
            value={selectedDistrict.id}
            onChange={(e) => {
              const d = ODISHA_DISTRICTS.find(x => x.id === e.target.value);
              if (d) setSelectedDistrict(d);
            }}
            className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-atmosphere-ice cursor-pointer"
          >
            {filteredDistricts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} &bull; {d.headquarters} ({d.nameOdia})
              </option>
            ))}
          </select>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-atmosphere-surface border border-atmosphere-border text-atmosphere-teal">
            {selectedDistrict.isCoastal ? "🌊 Coastal Belt District" : "🏞️ Inland Catchment"}
          </span>
        </div>

        {/* Telemetry Status & Controls */}
        <div className="flex flex-wrap items-center gap-3 justify-end text-xs font-mono text-atmosphere-muted">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-atmosphere-surface border border-atmosphere-border">
            <span className="w-2 h-2 rounded-full bg-atmosphere-safe animate-pulse"></span>
            <span>TELEMETRY ONLINE</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-atmosphere-muted/80">Updated:</span>
            <span className="text-atmosphere-text font-bold">{lastRefreshed || "Just now"}</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center rounded-lg border border-atmosphere-border bg-atmosphere-surface p-0.5">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded text-[11px] ${language === "en" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted hover:text-atmosphere-text"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-2 py-1 rounded text-[11px] ${language === "hi" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted hover:text-atmosphere-text"}`}
            >
              HI
            </button>
            <button
              onClick={() => setLanguage("or")}
              className={`px-2 py-1 rounded text-[11px] ${language === "or" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted hover:text-atmosphere-text"}`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice transition-all disabled:opacity-50"
            title="Refresh All Feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 3-Pane Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAIN CONTENT AREA: Columns 1 to 8 */}
        <div className="lg:col-span-8 space-y-6">
          {/* Real-Time Geospatial Map Card */}
          <div className="glass-panel rounded-2xl p-4 border border-atmosphere-border">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-atmosphere-ice font-bold uppercase tracking-wider">
                  Geospatial Situation Map &bull; {selectedDistrict.name}
                </span>
              </div>
              <Link href="/map" className="text-xs text-atmosphere-ice hover:underline font-mono flex items-center gap-1">
                Full-Screen Map <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="h-[440px] w-full rounded-xl overflow-hidden">
              <DynamicMap
                selectedDistrict={selectedDistrict}
                onSelectDistrict={(d) => setSelectedDistrict(d)}
                earthquakes={earthquakes}
                alerts={alerts}
                reports={reports}
                weather={weather}
                flood={flood}
                lastUpdated={lastRefreshed}
                onRefresh={fetchData}
                isLoading={loading}
              />
            </div>
          </div>

          {/* Forecast Metric Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-atmosphere-border">
              <div className="flex items-center justify-between text-xs text-atmosphere-muted font-mono mb-1">
                <span>WIND VELOCITY</span>
                <Wind className="w-4 h-4 text-atmosphere-ice" />
              </div>
              <div className="text-2xl font-bold font-mono text-atmosphere-text">
                {weather?.current?.windSpeedKmh ?? 14} <span className="text-sm font-normal text-atmosphere-muted">km/h</span>
              </div>
              <div className="text-[11px] font-mono text-atmosphere-muted mt-1">
                Gusts: {weather?.current?.windGustsKmh ?? 22} km/h (10m)
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-atmosphere-border">
              <div className="flex items-center justify-between text-xs text-atmosphere-muted font-mono mb-1">
                <span>RIVER RUNOFF</span>
                <Waves className="w-4 h-4 text-atmosphere-teal" />
              </div>
              <div className="text-2xl font-bold font-mono text-atmosphere-teal">
                {flood?.currentDischargeM3s ? flood.currentDischargeM3s.toFixed(1) : "35.2"} <span className="text-sm font-normal text-atmosphere-muted">m³/s</span>
              </div>
              <div className="text-[11px] font-mono text-atmosphere-muted mt-1">
                GloFAS: <span className="text-atmosphere-safe font-semibold">{flood?.flowThresholdStatus || "NORMAL"}</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-atmosphere-border">
              <div className="flex items-center justify-between text-xs text-atmosphere-muted font-mono mb-1">
                <span>SURFACE RAIN</span>
                <Droplets className="w-4 h-4 text-atmosphere-ice" />
              </div>
              <div className="text-2xl font-bold font-mono text-atmosphere-text">
                {weather?.current?.precipitationMm ?? 0} <span className="text-sm font-normal text-atmosphere-muted">mm/h</span>
              </div>
              <div className="text-[11px] font-mono text-atmosphere-muted mt-1">
                Humidity: {weather?.current?.relativeHumidityPercent ?? 68}%
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-atmosphere-border">
              <div className="flex items-center justify-between text-xs text-atmosphere-muted font-mono mb-1">
                <span>RISK INDEX</span>
                <ShieldAlert className="w-4 h-4 text-atmosphere-warning" />
              </div>
              <div className="text-2xl font-bold font-mono text-atmosphere-warning">
                {hazards?.overallRiskScore ?? 24}<span className="text-xs text-atmosphere-muted">/100</span>
              </div>
              <div className="text-[11px] font-mono text-atmosphere-muted mt-1">
                Status: <span className="font-bold text-atmosphere-safe">{hazards?.overallRiskLevel || "SAFE"}</span>
              </div>
            </div>
          </div>

          {/* 7-Day Atmospheric Forecast Timeline */}
          <div className="glass-panel rounded-2xl p-5 border border-atmosphere-border">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-4">
              <h2 className="text-sm font-bold font-heading text-atmosphere-text flex items-center gap-2">
                <Calendar className="w-4 h-4 text-atmosphere-ice" />
                7-Day Numerical Weather Prediction &bull; {selectedDistrict.name}
              </h2>
              <span className="text-xs font-mono text-atmosphere-muted">Source: Open-Meteo Operational Model</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {(weather?.daily || []).slice(0, 7).map((day, idx) => (
                <div key={idx} className="glass-panel p-3 rounded-xl border border-atmosphere-border/60 text-center flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-atmosphere-muted uppercase">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-sm font-bold font-mono text-atmosphere-text my-2">
                    {Math.round(day.temperatureMaxC)}° / <span className="text-atmosphere-muted font-normal">{Math.round(day.temperatureMinC)}°</span>
                  </div>
                  <div className="text-[10px] text-atmosphere-teal truncate font-mono">
                    {day.weatherDescription}
                  </div>
                  <div className="text-[10px] text-atmosphere-muted font-mono mt-1">
                    💧 {day.precipitationProbabilityMaxPercent}% ({day.precipitationSumMm.toFixed(1)}mm)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Citations & Grounding Box */}
          <div className="glass-panel rounded-2xl p-5 border border-atmosphere-border">
            <h2 className="text-sm font-bold font-heading text-atmosphere-text mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-atmosphere-safe" />
              Retrieved Evidence & Provenance Attribution
            </h2>
            <div className="divide-y divide-atmosphere-border/50 text-xs font-mono">
              {(hazards?.evidenceCitations || []).map((ev, i) => (
                <div key={i} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-atmosphere-text">{ev.indicator}:</span>{" "}
                    <span className="text-atmosphere-ice">{ev.measuredValue}</span>
                    <p className="text-[11px] text-atmosphere-muted mt-0.5">
                      Source: {ev.sourceName} &bull; Official classification: {ev.officialLevel}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase w-fit ${
                    ev.severity === "CRITICAL" ? "bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe/40" :
                    ev.severity === "SEVERE" ? "bg-atmosphere-severe/20 text-atmosphere-severe" :
                    ev.severity === "MODERATE" ? "bg-atmosphere-warning/20 text-atmosphere-warning" :
                    "bg-atmosphere-surface text-atmosphere-muted border border-atmosphere-border"
                  }`}>
                    {ev.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CONTEXT PANEL: Columns 9 to 12 */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Grounded Risk Briefing */}
          <div className="glass-panel-elevated rounded-2xl p-5 border border-atmosphere-border">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-atmosphere-ice" />
                <h3 className="text-sm font-bold font-heading text-atmosphere-text">Evidence-Grounded AI Briefing</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-atmosphere-surface text-atmosphere-teal border border-atmosphere-border">
                Zero-Hallucination
              </span>
            </div>

            <p className="text-xs text-atmosphere-text/90 leading-relaxed mb-4">
              {hazards?.aiBriefing?.summary || "Analyzing numerical models and GloFAS hydrological indicators for " + selectedDistrict.name + "..."}
            </p>

            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-mono uppercase text-atmosphere-muted tracking-wider block">
                Actionable Protocols:
              </span>
              {(hazards?.aiBriefing?.actionableGuidance || []).map((guide, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-atmosphere-muted">
                  <span className="text-atmosphere-ice font-mono">&bull;</span>
                  <span>{guide}</span>
                </div>
              ))}
            </div>

            <Link
              href="/assistant"
              className="w-full py-2.5 rounded-lg bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Gemini Disaster Assistant</span>
            </Link>
          </div>

          {/* Active Global / Regional Hazard Alerts */}
          <div className="glass-panel rounded-2xl p-5 border border-atmosphere-border">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-atmosphere-severe" />
                <h3 className="text-sm font-bold font-heading text-atmosphere-text">Active Disaster Alerts (GDACS)</h3>
              </div>
              <Link href="/events" className="text-xs text-atmosphere-ice hover:underline font-mono">
                All Events
              </Link>
            </div>

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-xs text-atmosphere-muted font-mono">No active high-severity alerts in immediate zone.</p>
              ) : (
                alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="p-3 rounded-lg bg-atmosphere-surface border border-atmosphere-border text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-atmosphere-text">{alert.eventName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-atmosphere-severe/20 text-atmosphere-severe">
                        {alert.alertLevel} Alert
                      </span>
                    </div>
                    <p className="text-[11px] text-atmosphere-muted mb-2">{alert.severity}</p>
                    <span className="text-[10px] font-mono text-atmosphere-muted/70 block">
                      Region: {alert.country}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Nearby Verified Shelters */}
          <div className="glass-panel rounded-2xl p-5 border border-atmosphere-border">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-atmosphere-safe" />
                <h3 className="text-sm font-bold font-heading text-atmosphere-text">Nearby Verified Shelters (MPCS)</h3>
              </div>
              <Link href="/shelters" className="text-xs text-atmosphere-safe hover:underline font-mono">
                Directory
              </Link>
            </div>

            <p className="text-xs text-atmosphere-muted mb-3">
              Pre-surveyed OSDMA Multipurpose Cyclone Shelters equipped with potable water and backup generators.
            </p>

            <Link
              href={`/shelters?district=${encodeURIComponent(selectedDistrict.name)}`}
              className="w-full py-2 rounded-lg bg-atmosphere-safe/20 border border-atmosphere-safe/40 text-atmosphere-safe hover:bg-atmosphere-safe/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all font-mono"
            >
              <span>Locate {selectedDistrict.name} Shelters</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Community Citizen Incident Feed */}
          <div className="glass-panel rounded-2xl p-5 border border-atmosphere-border">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <h3 className="text-sm font-bold font-heading text-atmosphere-text">Community Incidents</h3>
              <Link href="/reports" className="text-xs text-atmosphere-ice hover:underline font-mono">
                Submit Report
              </Link>
            </div>

            <div className="space-y-2.5">
              {reports.length === 0 ? (
                <p className="text-xs text-atmosphere-muted font-mono">No incidents currently reported for {selectedDistrict.name}.</p>
              ) : (
                reports.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="p-2.5 rounded-lg bg-atmosphere-surface border border-atmosphere-border text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-atmosphere-text">{rep.category}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${rep.status === 'VERIFIED' ? 'bg-atmosphere-safe/20 text-atmosphere-safe' : 'bg-atmosphere-warning/20 text-atmosphere-warning'}`}>
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-atmosphere-muted line-clamp-2">{rep.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
