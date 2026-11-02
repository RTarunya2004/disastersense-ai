"use client";

import { useState } from "react";
import { Sliders, Bell, Globe, Eye, Shield } from "lucide-react";

export default function SettingsPage() {
  const [units, setUnits] = useState("METRIC");
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-atmosphere-border">
        <h1 className="text-2xl font-bold font-heading text-atmosphere-text">Platform & Accessibility Preferences</h1>
        <p className="text-xs font-mono text-atmosphere-muted">Configure telemetry units, audible siren alerts, and visual motion profiles</p>
      </div>

      <div className="space-y-6">
        {/* Units Configuration */}
        <div className="glass-panel p-6 rounded-2xl border border-atmosphere-border space-y-4">
          <h2 className="text-sm font-bold font-heading text-atmosphere-text flex items-center gap-2">
            <Globe className="w-4 h-4 text-atmosphere-ice" />
            Telemetry Units & Standard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <label className={`p-4 rounded-xl border cursor-pointer transition-all ${units === "METRIC" ? "bg-atmosphere-ice/10 border-atmosphere-ice text-atmosphere-text" : "bg-atmosphere-surface border-atmosphere-border text-atmosphere-muted"}`}>
              <input type="radio" name="units" checked={units === "METRIC"} onChange={() => setUnits("METRIC")} className="sr-only" />
              <span className="font-bold block mb-1">Standard Scientific Metric (Recommended)</span>
              <span className="text-[11px] text-atmosphere-muted">Celsius (°C), km/h, mm/hr, m³/s discharge volume</span>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer transition-all ${units === "IMPERIAL" ? "bg-atmosphere-ice/10 border-atmosphere-ice text-atmosphere-text" : "bg-atmosphere-surface border-atmosphere-border text-atmosphere-muted"}`}>
              <input type="radio" name="units" checked={units === "IMPERIAL"} onChange={() => setUnits("IMPERIAL")} className="sr-only" />
              <span className="font-bold block mb-1">Imperial Navigation</span>
              <span className="text-[11px] text-atmosphere-muted">Fahrenheit (°F), Knots (kts), inches of rain, cfs</span>
            </label>
          </div>
        </div>

        {/* Accessibility & Motion */}
        <div className="glass-panel p-6 rounded-2xl border border-atmosphere-border space-y-4">
          <h2 className="text-sm font-bold font-heading text-atmosphere-text flex items-center gap-2">
            <Eye className="w-4 h-4 text-atmosphere-teal" />
            Accessibility & Motion Safety
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-atmosphere-surface border border-atmosphere-border cursor-pointer">
              <div>
                <span className="text-xs font-bold text-atmosphere-text block">Respect Reduced Motion (prefers-reduced-motion)</span>
                <span className="text-[11px] font-mono text-atmosphere-muted">Suppresses radar scanlines, particle movements, and dynamic transitions.</span>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 rounded border-atmosphere-border text-atmosphere-ice focus:ring-0 bg-atmosphere-bg cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-atmosphere-surface border border-atmosphere-border cursor-pointer">
              <div>
                <span className="text-xs font-bold text-atmosphere-text block">Audible Siren Tone on Emergency Alerts</span>
                <span className="text-[11px] font-mono text-atmosphere-muted">Plays 800Hz warning chime when active red alert or severe flood warning is detected.</span>
              </div>
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => setAudioAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-atmosphere-border text-atmosphere-ice focus:ring-0 bg-atmosphere-bg cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
