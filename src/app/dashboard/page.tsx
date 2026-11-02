"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DynamicMap from "@/components/DynamicMap";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { WeatherData, FloodData, GdacsAlert, UsgsEarthquake, MultiHazardAssessment, CommunityReport } from "@/types";
import HeroCard from "@/components/weather/HeroCard";
import WeatherCards from "@/components/weather/WeatherCards";
import AdvancedDataPanel from "@/components/weather/AdvancedDataPanel";
import DistrictSelector from "@/components/weather/DistrictSelector";
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
  Info,
  Sparkles,
  Compass
} from "lucide-react";

export default function DashboardPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(ODISHA_DISTRICTS[0]);
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

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Intelligence Control Bar */}
      <div className="glass-panel-elevated rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border border-atmosphere-border shadow-atmospheric">
        {/* District Selector & Location Search */}
        <div className="flex-1 max-w-2xl">
          <DistrictSelector
            selectedDistrictId={selectedDistrict.id}
            onSelect={(d) => setSelectedDistrict(d)}
          />
        </div>

        {/* Telemetry Status, Language & Refresh Controls */}
        <div className="flex flex-wrap items-center gap-3 justify-end text-xs font-mono text-atmosphere-muted">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-atmosphere-surface border border-atmosphere-border shadow-sm">
            <span className="w-2 h-2 rounded-full bg-atmosphere-safe animate-pulse"></span>
            <span>TELEMETRY LIVE</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text">
            <span className="text-atmosphere-muted">Sync:</span>
            <span className="font-bold">{lastRefreshed || "Just now"}</span>
          </div>

          {/* Multilingual Switcher */}
          <div className="flex items-center rounded-xl border border-atmosphere-border bg-atmosphere-surface p-0.5">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                language === "en" ? "bg-atmosphere-ice text-atmosphere-bg font-bold shadow-glow" : "text-atmosphere-muted hover:text-atmosphere-text"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                language === "hi" ? "bg-atmosphere-ice text-atmosphere-bg font-bold shadow-glow" : "text-atmosphere-muted hover:text-atmosphere-text"
              }`}
            >
              HI
            </button>
            <button
              onClick={() => setLanguage("or")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                language === "or" ? "bg-atmosphere-ice text-atmosphere-bg font-bold shadow-glow" : "text-atmosphere-muted hover:text-atmosphere-text"
              }`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-xl bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice transition-all disabled:opacity-50 shadow-sm"
            title="Refresh All Feeds"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Hero Weather Card */}
      {weather && (
        <HeroCard
          weather={weather}
          locationName={selectedDistrict.name}
          districtHQ={selectedDistrict.headquarters}
        />
      )}

      {/* Expandable & Morphing Weather Cards */}
      {weather && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-atmosphere-muted uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-atmosphere-ice" />
              Interactive Telemetry Modules (Tap any card to expand)
            </span>
            <span className="text-xs font-mono text-atmosphere-teal">
              6 Real-Time Modules
            </span>
          </div>
          <WeatherCards
            weather={weather}
            flood={flood}
            alerts={alerts}
            earthquakes={earthquakes}
          />
        </div>
      )}

      {/* Tabbed Meteorological Trend Suite */}
      {weather && <AdvancedDataPanel weather={weather} />}

      {/* 2-Column Split: Geographic Situation Map (Left) & AI Resilience Intelligence (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Real-Time Geographic Map & 7-Day NWP Forecast */}
        <div className="lg:col-span-8 space-y-6">
          {/* Geospatial Situation Map Card */}
          <div className="glass-panel-elevated rounded-3xl p-5 border border-atmosphere-border shadow-atmospheric">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-atmosphere-ice animate-pulse"></span>
                <span className="text-xs font-mono text-atmosphere-text font-bold uppercase tracking-wider">
                  Geospatial Situation Map &bull; {selectedDistrict.name} Focus
                </span>
              </div>
              <Link
                href="/map"
                className="text-xs text-atmosphere-ice hover:underline font-mono flex items-center gap-1"
              >
                <span>Full-Screen Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="h-[460px] w-full rounded-2xl overflow-hidden border border-atmosphere-border">
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

          {/* 7-Day Numerical Weather Prediction Horizontal Timeline */}
          <div className="glass-panel rounded-3xl p-6 border border-atmosphere-border shadow-atmospheric">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-4">
              <h3 className="text-sm font-bold font-heading text-atmosphere-text flex items-center gap-2">
                <Calendar className="w-4 h-4 text-atmosphere-ice" />
                7-Day Operational Numerical Weather Prediction &bull; {selectedDistrict.name}
              </h3>
              <span className="text-xs font-mono text-atmosphere-muted">Open-Meteo NWP ECMWF Run</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {(weather?.daily || []).slice(0, 7).map((day, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-3.5 rounded-2xl border border-atmosphere-border hover:border-atmosphere-ice/30 transition-all text-center flex flex-col justify-between"
                >
                  <div className="text-[11px] font-mono text-atmosphere-muted uppercase">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
                  </div>
                  <div className="text-base font-bold font-heading text-atmosphere-text my-2">
                    {Math.round(day.temperatureMaxC)}°{" "}
                    <span className="text-atmosphere-muted font-normal text-xs font-mono">
                      / {Math.round(day.temperatureMinC)}°
                    </span>
                  </div>
                  <div className="text-[11px] text-atmosphere-teal truncate font-mono">
                    {day.weatherDescription}
                  </div>
                  <div className="text-[10px] text-atmosphere-muted font-mono mt-1 pt-1 border-t border-atmosphere-border/50">
                    💧 {day.precipitationProbabilityMaxPercent}% ({day.precipitationSumMm.toFixed(1)}mm)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retrieved Evidence Provenance & Attribution Table */}
          <div className="glass-panel rounded-3xl p-6 border border-atmosphere-border shadow-atmospheric">
            <h3 className="text-sm font-bold font-heading text-atmosphere-text mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-atmosphere-safe" />
              Retrieved Scientific Evidence & Grounding Traceability
            </h3>
            <div className="divide-y divide-atmosphere-border/50 text-xs font-mono">
              {(hazards?.evidenceCitations || []).map((ev, i) => (
                <div key={i} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-atmosphere-text">{ev.indicator}:</span>{" "}
                    <span className="text-atmosphere-ice">{ev.measuredValue}</span>
                    <p className="text-[11px] text-atmosphere-muted mt-0.5">
                      Source: {ev.sourceName} &bull; Classification: {ev.officialLevel}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase w-fit ${
                      ev.severity === "CRITICAL"
                        ? "bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe/40"
                        : ev.severity === "SEVERE"
                        ? "bg-atmosphere-severe/20 text-atmosphere-severe"
                        : ev.severity === "MODERATE"
                        ? "bg-atmosphere-warning/20 text-atmosphere-warning"
                        : "bg-atmosphere-surface text-atmosphere-muted border border-atmosphere-border"
                    }`}
                  >
                    {ev.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): AI Grounded Briefing, GDACS Alerts, Shelters, Reports */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Grounded Risk Briefing */}
          <div className="glass-panel-elevated rounded-3xl p-6 border border-atmosphere-border shadow-atmospheric">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-atmosphere-ice" />
                <h3 className="text-sm font-bold font-heading text-atmosphere-text">
                  Grounded Gemini AI Briefing
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-atmosphere-surface text-atmosphere-teal border border-atmosphere-border">
                Zero-Hallucination
              </span>
            </div>

            <p className="text-xs text-atmosphere-text/90 leading-relaxed mb-4 font-sans">
              {hazards?.aiBriefing?.summary ||
                `Synthesizing numerical models and GloFAS hydrological indicators for ${selectedDistrict.name}...`}
            </p>

            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-mono uppercase text-atmosphere-muted tracking-wider block">
                Evidence-Backed Action Protocols:
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
              className="w-full py-2.5 rounded-xl bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Gemini Disaster Assistant</span>
            </Link>
          </div>

          {/* Active Global / Regional Hazard Alerts */}
          <div className="glass-panel rounded-3xl p-6 border border-atmosphere-border shadow-atmospheric">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-atmosphere-severe" />
                <h3 className="text-sm font-bold font-heading text-atmosphere-text">
                  Active Disaster Alerts (GDACS)
                </h3>
              </div>
              <Link href="/events" className="text-xs text-atmosphere-ice hover:underline font-mono">
                All Events
              </Link>
            </div>

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-xs text-atmosphere-muted font-mono">
                  No active high-severity alerts returned for the immediate zone.
                </p>
              ) : (
                alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-atmosphere-text">{alert.eventName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-atmosphere-severe/20 text-atmosphere-severe">
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
          <div className="glass-panel rounded-3xl p-6 border border-atmosphere-border shadow-atmospheric">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-atmosphere-safe" />
                <h3 className="text-sm font-bold font-heading text-atmosphere-text">
                  Verified MPCS Shelters Cadastre
                </h3>
              </div>
              <Link href="/shelters" className="text-xs text-atmosphere-safe hover:underline font-mono">
                Directory
              </Link>
            </div>

            <p className="text-xs text-atmosphere-muted mb-3 font-sans">
              Pre-surveyed OSDMA Multipurpose Cyclone Shelters equipped with potable water, elevated plinths, and backup diesel gensets.
            </p>

            <Link
              href={`/shelters?district=${encodeURIComponent(selectedDistrict.name)}`}
              className="w-full py-2.5 rounded-xl bg-atmosphere-safe/20 border border-atmosphere-safe/40 text-atmosphere-safe hover:bg-atmosphere-safe/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all font-mono shadow-sm"
            >
              <span>Locate {selectedDistrict.name} Shelters</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Community Citizen Incident Feed */}
          <div className="glass-panel rounded-3xl p-6 border border-atmosphere-border shadow-atmospheric">
            <div className="flex items-center justify-between pb-3 border-b border-atmosphere-border/60 mb-3">
              <h3 className="text-sm font-bold font-heading text-atmosphere-text">
                Community Citizen Reports
              </h3>
              <Link href="/reports" className="text-xs text-atmosphere-ice hover:underline font-mono">
                Submit Report
              </Link>
            </div>

            <div className="space-y-2.5">
              {reports.length === 0 ? (
                <p className="text-xs text-atmosphere-muted font-mono">
                  No active citizen incident reports logged for {selectedDistrict.name}.
                </p>
              ) : (
                reports.slice(0, 3).map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-atmosphere-text">{rep.category}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          rep.status === "VERIFIED"
                            ? "bg-atmosphere-safe/20 text-atmosphere-safe"
                            : "bg-atmosphere-warning/20 text-atmosphere-warning"
                        }`}
                      >
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
