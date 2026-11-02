"use client";

import { useState, useEffect } from "react";
import { GdacsAlert, UsgsEarthquake } from "@/types";
import { History, AlertTriangle, Waves, Wind, ExternalLink, Calendar, MapPin, RefreshCw } from "lucide-react";

export default function EventsPage() {
  const [alerts, setAlerts] = useState<GdacsAlert[]>([]);
  const [earthquakes, setEarthquakes] = useState<UsgsEarthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventTypeFilter, setEventTypeFilter] = useState<"ALL" | "TC" | "FL" | "EQ">("ALL");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [gRes, eqRes] = await Promise.all([
        fetch("/api/gdacs"),
        fetch("/api/earthquakes"),
      ]);
      if (gRes.ok) {
        const d = await gRes.json();
        setAlerts(d.alerts || []);
      }
      if (eqRes.ok) {
        const d = await eqRes.json();
        setEarthquakes(d.earthquakes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredAlerts = alerts.filter(a => eventTypeFilter === "ALL" || a.eventType === eventTypeFilter);
  const showEarthquakes = eventTypeFilter === "ALL" || eventTypeFilter === "EQ";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-atmosphere-border">
        <div>
          <h1 className="text-2xl font-bold font-heading text-atmosphere-text">
            Global & Regional Disaster Event History
          </h1>
          <p className="text-xs font-mono text-atmosphere-muted">
            Live Feeds from GDACS (UN OCHA / EC-JRC) & USGS Earthquake Hazards Program
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-atmosphere-border bg-atmosphere-surface p-0.5 text-xs font-mono">
            <button
              onClick={() => setEventTypeFilter("ALL")}
              className={`px-3 py-1.5 rounded ${eventTypeFilter === "ALL" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              All Events
            </button>
            <button
              onClick={() => setEventTypeFilter("TC")}
              className={`px-3 py-1.5 rounded ${eventTypeFilter === "TC" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              Cyclones
            </button>
            <button
              onClick={() => setEventTypeFilter("FL")}
              className={`px-3 py-1.5 rounded ${eventTypeFilter === "FL" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              Floods
            </button>
            <button
              onClick={() => setEventTypeFilter("EQ")}
              className={`px-3 py-1.5 rounded ${eventTypeFilter === "EQ" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              Earthquakes
            </button>
          </div>

          <button
            onClick={fetchEvents}
            disabled={loading}
            className="p-2 rounded-lg bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Global Alerts Feed */}
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-bold font-heading text-atmosphere-text mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-atmosphere-severe" />
            GDACS Monitored Cyclone & Hydrological Events ({filteredAlerts.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlerts.map((a) => (
              <div key={a.id} className="glass-panel p-5 rounded-xl border border-atmosphere-border flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold font-heading text-atmosphere-text">{a.eventName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      a.alertLevel === "Red" ? "bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe/40" :
                      a.alertLevel === "Orange" ? "bg-atmosphere-warning/20 text-atmosphere-warning border border-atmosphere-warning/40" :
                      "bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40"
                    }`}>
                      {a.alertLevel} Alert
                    </span>
                  </div>
                  <p className="text-xs text-atmosphere-muted mb-3 leading-relaxed">{a.description}</p>
                </div>

                <div className="pt-3 border-t border-atmosphere-border/50 text-[11px] font-mono text-atmosphere-muted flex items-center justify-between">
                  <span>Region: {a.country}</span>
                  <a
                    href={a.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-atmosphere-ice hover:underline flex items-center gap-1 font-sans"
                  >
                    <span>GDACS Report</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* USGS Earthquakes Feed */}
        {showEarthquakes && (
          <div className="pt-6 border-t border-atmosphere-border">
            <h2 className="text-base font-bold font-heading text-atmosphere-text mb-4 flex items-center gap-2">
              <Waves className="w-4 h-4 text-atmosphere-warning" />
              USGS Recorded Seismicity &bull; Regional Network ({earthquakes.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earthquakes.map((eq) => (
                <div key={eq.id} className="glass-panel p-4 rounded-xl border border-atmosphere-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold font-mono text-atmosphere-warning">
                        M {eq.magnitude.toFixed(1)}
                      </span>
                      <span className="text-[10px] font-mono text-atmosphere-muted">
                        Depth: {eq.depthKm} km
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-atmosphere-text mb-1">{eq.place}</h3>
                    <p className="text-[11px] font-mono text-atmosphere-muted mb-2">
                      Distance to Odisha: <strong className="text-atmosphere-ice">~{eq.distanceKmToOdisha} km</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-atmosphere-border/50 text-[10px] font-mono text-atmosphere-muted flex items-center justify-between">
                    <span>{eq.formattedTime}</span>
                    <a href={eq.url} target="_blank" rel="noopener noreferrer" className="text-atmosphere-ice hover:underline">
                      USGS &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
