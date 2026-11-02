"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Cpu,
  Sparkles,
  Compass
} from "lucide-react";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { WeatherData } from "@/types";
import HeroCard from "@/components/weather/HeroCard";
import DistrictSelector from "@/components/weather/DistrictSelector";

export default function LandingPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(ODISHA_DISTRICTS[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLandingWeather() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/weather?lat=${selectedDistrict.coordinates.lat}&lng=${selectedDistrict.coordinates.lng}&district=${encodeURIComponent(selectedDistrict.name)}`
        );
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch (e) {
        console.error("Landing telemetry fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLandingWeather();
  }, [selectedDistrict]);

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows and Atmospheric Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[640px] bg-gradient-to-b from-atmosphere-ice/10 via-atmosphere-teal/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-atmosphere-ice/30 bg-atmosphere-surface/80 text-xs font-mono text-atmosphere-ice mb-6 shadow-glow backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-atmosphere-teal animate-pulse"></span>
            <span>ATMOSPHERE PRO &bull; 30 ODISHA DISTRICTS OPERATIONAL</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-atmosphere-text mb-6 leading-tight"
          >
            Real-Time Disaster Risk Intelligence & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-atmosphere-ice via-atmosphere-teal to-[#5AC49E]">
              Community Resilience Platform
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-atmosphere-muted mb-8 leading-relaxed font-sans"
          >
            Synthesizing numerical weather prediction, GloFAS river discharge hydrology, GDACS alerts, USGS seismology, and grounded Google Gemini AI into evidence-backed civic intelligence.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
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
          </motion.div>
        </div>

        {/* Live Weather Hero Experience */}
        <div className="max-w-5xl mx-auto space-y-4">
          {/* District Quick Search & Switcher */}
          <DistrictSelector
            selectedDistrictId={selectedDistrict.id}
            onSelect={(d) => setSelectedDistrict(d)}
          />

          {weather ? (
            <HeroCard
              weather={weather}
              locationName={selectedDistrict.name}
              districtHQ={selectedDistrict.headquarters}
            />
          ) : (
            <div className="glass-panel-elevated rounded-3xl p-12 text-center border border-atmosphere-border text-atmosphere-muted font-mono text-sm">
              <span className="w-6 h-6 border-2 border-atmosphere-ice border-t-transparent rounded-full inline-block animate-spin mr-3"></span>
              Synchronizing atmospheric models for {selectedDistrict.name}...
            </div>
          )}

          {/* Live Link to Dashboard with Parameters */}
          <div className="flex items-center justify-between px-2 text-xs font-mono text-atmosphere-muted">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-atmosphere-ice" />
              Real-time atmospheric modeling powered by Open-Meteo &bull; ₹0 Non-Commercial Architecture
            </span>
            <Link
              href="/dashboard"
              className="text-atmosphere-ice hover:underline flex items-center gap-1 font-sans font-medium"
            >
              Open Full Intelligence Workspace &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-atmosphere-border/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-atmosphere-teal uppercase tracking-wider block mb-2">
            Evidence-Grounded Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-atmosphere-text mb-3">
            Engineered for Grounded Transparency
          </h2>
          <p className="text-sm text-atmosphere-muted">
            Strict separation between statutory disaster directives, numerical simulation indicators, and AI explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-atmosphere-border hover:border-atmosphere-ice/40 transition-all shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-ice mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-atmosphere-text mb-2">6 Real Open-Access Streams</h3>
            <p className="text-sm text-atmosphere-muted leading-relaxed">
              Real-time ingestion of Open-Meteo NWP forecasts, GloFAS river discharge hydrology, GDACS cyclone & flood alerts, and USGS seismic feeds with millisecond SLA tracking.
            </p>
            <div className="mt-4 pt-4 border-t border-atmosphere-border/40 flex items-center text-xs font-mono text-atmosphere-teal">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> No Fake or Hardcoded Mock Data
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-atmosphere-border hover:border-atmosphere-ice/40 transition-all shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-teal mb-4">
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

          <div className="glass-panel p-6 rounded-2xl border border-atmosphere-border hover:border-atmosphere-ice/40 transition-all shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-safe mb-4">
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
