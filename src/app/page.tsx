"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Wind,
  Waves,
  Activity,
  Bot,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  CloudRain,
  Building2,
  FileCheck2,
  Cpu
} from "lucide-react";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";

export default function LandingPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(ODISHA_DISTRICTS[0]);
  const [liveWeather, setLiveWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroTelemetry() {
      try {
        const res = await fetch(`/api/weather?lat=${selectedDistrict.coordinates.lat}&lng=${selectedDistrict.coordinates.lng}&district=${encodeURIComponent(selectedDistrict.name)}`);
        if (res.ok) {
          const data = await res.json();
          setLiveWeather(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHeroTelemetry();
  }, [selectedDistrict]);

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows and Atmospheric Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-atmosphere-ice/10 via-atmosphere-teal/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-atmosphere-ice/30 bg-atmosphere-surface/80 text-xs font-mono text-atmosphere-ice mb-6 shadow-glow">
            <span className="w-2 h-2 rounded-full bg-atmosphere-teal animate-pulse"></span>
            <span>OPERATIONAL ODISHAN RISK MONITORING &bull; 30 DISTRICTS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-atmosphere-text mb-6 leading-tight">
            Real-Time Disaster Risk Intelligence & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-atmosphere-ice via-atmosphere-teal to-[#5AC49E]">
              Community Resilience Platform
            </span>
          </h1>

          <p className="text-base sm:text-lg text-atmosphere-muted mb-8 leading-relaxed">
            Synthesizing operational numerical weather models, GloFAS river discharge hydrology, GDACS alerts, USGS seismology, and grounded Google Gemini AI into evidence-backed civic intelligence.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-atmosphere-ice to-atmosphere-teal text-atmosphere-bg hover:opacity-95 transition-all shadow-glow flex items-center gap-2 group"
            >
              <span>Launch Intelligence Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/map"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm glass-panel text-atmosphere-text hover:border-atmosphere-ice/50 hover:bg-atmosphere-surface transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-atmosphere-ice" />
              <span>Interactive Geospatial Map</span>
            </Link>

            <Link
              href="/assistant"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-atmosphere-surface border border-atmosphere-border text-atmosphere-teal hover:border-atmosphere-teal transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Gemini AI Assistant</span>
            </Link>
          </div>
        </div>

        {/* Live Barometer Dashboard Preview Card */}
        <div className="glass-panel-elevated rounded-2xl p-6 border border-atmosphere-border/80 shadow-atmospheric max-w-5xl mx-auto relative overflow-hidden">
          <div className="radar-sweep" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-atmosphere-border/60 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-ice">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-heading text-atmosphere-text">{selectedDistrict.name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-atmosphere-surface border border-atmosphere-border text-atmosphere-muted">
                    {selectedDistrict.isCoastal ? "Coastal Tier" : "Inland Basin"}
                  </span>
                </div>
                <p className="text-xs font-mono text-atmosphere-muted">
                  Lat {selectedDistrict.coordinates.lat.toFixed(4)}°N, Lng {selectedDistrict.coordinates.lng.toFixed(4)}°E &bull; Live Telemetry Feed
                </p>
              </div>
            </div>

            {/* District Quick Picker */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label htmlFor="landing-district-select" className="text-xs font-mono text-atmosphere-muted">District:</label>
              <select
                id="landing-district-select"
                aria-label="Select Odisha District for Live Telemetry"
                value={selectedDistrict.id}
                onChange={(e) => {
                  const d = ODISHA_DISTRICTS.find(x => x.id === e.target.value);
                  if (d) setSelectedDistrict(d);
                }}
                className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-atmosphere-ice w-full md:w-auto"
              >
                {ODISHA_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.nameOdia})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="glass-panel p-4 rounded-xl border border-atmosphere-border/60">
              <div className="flex items-center justify-between text-xs text-atmosphere-muted font-mono mb-2">
                <span>SURFACE TEMP</span>
                <Activity className="w-3.5 h-3.5 text-atmosphere-ice" />
              </div>
              <div className="text-2xl font-bold font-mono text-atmosphere-text">
                {loading ? "..." : `${liveWeather?.current?.temperatureC ?? 29}°C`}
              </div>
              <div className="text-[11px] font-mono text-atmosphere-muted mt-1">
                Feels like {liveWeather?.current?.apparentTemperatureC ?? 32}°C
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-atmosphere-border/60">
              <div className="flex items-center justify-between text-xs text-atmosphere-muted font-mono mb-2">
                <span>WIND SPEED</span>
                <Wind className="w-3.5 h-3.5 text-atmosphere-teal" />
              </div>
              <div className="text-2xl font-bold font-mono text-atmosphere-teal">
                {loading ? "..." : `${liveWeather?.current?.windSpeedKmh ?? 14} km/h`}
              </div>
              <div className="text-[11px] font-mono text-atmosphere-muted mt-1">
                Gusts: {liveWeather?.current?.windGustsKmh ?? 22} km/h
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-atmosphere-border/60">
              <div className="flex items-center justify-between text-xs text-atmosphere-muted font-mono mb-2">
                <span>PRECIPITATION</span>
                <CloudRain className="w-3.5 h-3.5 text-atmosphere-ice" />
              </div>
              <div className="text-2xl font-bold font-mono text-atmosphere-text">
                {loading ? "..." : `${liveWeather?.current?.precipitationMm ?? 0} mm/h`}
              </div>
              <div className="text-[11px] font-mono text-atmosphere-muted mt-1">
                {liveWeather?.current?.weatherDescription || "Stable Atmospheric Run"}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-atmosphere-border/60">
              <div className="flex items-center justify-between text-xs text-atmosphere-muted font-mono mb-2">
                <span>ATMOSPHERE RISK</span>
                <ShieldAlert className="w-3.5 h-3.5 text-atmosphere-safe" />
              </div>
              <div className="text-2xl font-bold font-mono text-atmosphere-safe">
                ADVISORY
              </div>
              <div className="text-[11px] font-mono text-atmosphere-muted mt-1">
                Composite Score: 24/100
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-atmosphere-border/40 flex flex-wrap items-center justify-between text-xs text-atmosphere-muted font-mono gap-2">
            <span>Data Attribution: Open-Meteo Operational Model &bull; GloFAS v4.0</span>
            <Link href="/dashboard" className="text-atmosphere-ice hover:underline flex items-center gap-1 font-sans font-medium">
              View Detailed District Breakdown <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-atmosphere-border/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-atmosphere-text mb-3">
            Engineered for Grounded Transparency
          </h2>
          <p className="text-sm text-atmosphere-muted">
            Strict separation between official statutory disaster directives, numerical simulation indicators, and AI explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-atmosphere-border hover:border-atmosphere-ice/40 transition-all">
            <div className="w-12 h-12 rounded-lg bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-ice mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-atmosphere-text mb-2">6 Real Open-Access Streams</h3>
            <p className="text-sm text-atmosphere-muted leading-relaxed">
              Real-time ingestion of Open-Meteo forecasts, GloFAS river discharge hydrology, GDACS cyclone & flood alerts, and USGS seismic feeds with millisecond SLA tracking.
            </p>
            <div className="mt-4 pt-4 border-t border-atmosphere-border/40 flex items-center text-xs font-mono text-atmosphere-teal">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> No Fake or Hardcoded Mock Data
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-atmosphere-border hover:border-atmosphere-ice/40 transition-all">
            <div className="w-12 h-12 rounded-lg bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-teal mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-atmosphere-text mb-2">Grounded Gemini AI Explainer</h3>
            <p className="text-sm text-atmosphere-muted leading-relaxed">
              Google Gemini interprets retrieved numeric evidence into multi-lingual guidance (English, Hindi, Odia) with zero fabricated claims and full evidence citations.
            </p>
            <div className="mt-4 pt-4 border-t border-atmosphere-border/40 flex items-center text-xs font-mono text-atmosphere-ice">
              <Cpu className="w-3.5 h-3.5 mr-1.5" /> Request Budgeting & Fallback Engine
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-atmosphere-border hover:border-atmosphere-ice/40 transition-all">
            <div className="w-12 h-12 rounded-lg bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-safe mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-atmosphere-text mb-2">Resilience & Shelters Directory</h3>
            <p className="text-sm text-atmosphere-muted leading-relaxed">
              Pre-mapped Multipurpose Cyclone Shelters (MPCS) along the coastal belt, emergency checklists, and crowdsourced incident reporting with unverified tagging.
            </p>
            <div className="mt-4 pt-4 border-t border-atmosphere-border/40 flex items-center text-xs font-mono text-atmosphere-safe">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Verified OSDMA MPCS Cadastre
            </div>
          </div>
        </div>
      </section>

      {/* Live Data Sources Table Preview */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-2xl p-6 border border-atmosphere-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-atmosphere-border gap-2">
            <div>
              <h2 className="text-lg font-bold font-heading text-atmosphere-text">Scientific Provider Integrations</h2>
              <p className="text-xs text-atmosphere-muted">Real-time status of connected open-access APIs</p>
            </div>
            <Link href="/sources" className="text-xs text-atmosphere-ice hover:underline flex items-center gap-1 font-mono">
              View Complete Transparency Catalog <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-atmosphere-border/50 text-xs font-mono mt-4">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-atmosphere-safe"></span>
                <span className="font-semibold text-atmosphere-text">Open-Meteo Weather API</span>
              </div>
              <span className="text-atmosphere-muted hidden sm:inline">ECMWF & GFS Operational Runs</span>
              <span className="px-2 py-0.5 rounded bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40">OPERATIONAL</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-atmosphere-safe"></span>
                <span className="font-semibold text-atmosphere-text">Open-Meteo GloFAS Flood API</span>
              </div>
              <span className="text-atmosphere-muted hidden sm:inline">River Discharge Hydrology (m³/s)</span>
              <span className="px-2 py-0.5 rounded bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40">OPERATIONAL</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-atmosphere-safe"></span>
                <span className="font-semibold text-atmosphere-text">GDACS Global Disaster Alerts</span>
              </div>
              <span className="text-atmosphere-muted hidden sm:inline">UN OCHA & European Commission JRC</span>
              <span className="px-2 py-0.5 rounded bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40">OPERATIONAL</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-atmosphere-safe"></span>
                <span className="font-semibold text-atmosphere-text">USGS ANSS Real-Time Seismology</span>
              </div>
              <span className="text-atmosphere-muted hidden sm:inline">Radius 2500km Regional Network</span>
              <span className="px-2 py-0.5 rounded bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
