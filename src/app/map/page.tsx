"use client";

import { useState, useEffect } from "react";
import DynamicMap from "@/components/DynamicMap";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { UsgsEarthquake, GdacsAlert, CommunityReport, WeatherData, FloodData } from "@/types";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function MapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(ODISHA_DISTRICTS[0]);
  const [earthquakes, setEarthquakes] = useState<UsgsEarthquake[]>([]);
  const [alerts, setAlerts] = useState<GdacsAlert[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [flood, setFlood] = useState<FloodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchGeodata = async () => {
    setLoading(true);
    try {
      const [eqRes, gRes, repRes, wRes, fRes] = await Promise.all([
        fetch("/api/earthquakes"),
        fetch("/api/gdacs"),
        fetch("/api/reports?district=ALL"),
        fetch(`/api/weather?lat=${selectedDistrict.coordinates.lat}&lng=${selectedDistrict.coordinates.lng}&district=${encodeURIComponent(selectedDistrict.name)}`),
        fetch(`/api/flood?lat=${selectedDistrict.coordinates.lat}&lng=${selectedDistrict.coordinates.lng}&district=${encodeURIComponent(selectedDistrict.name)}`),
      ]);

      if (eqRes.ok) {
        const d = await eqRes.json();
        setEarthquakes(d.earthquakes || []);
      }
      if (gRes.ok) {
        const d = await gRes.json();
        setAlerts(d.alerts || []);
      }
      if (repRes.ok) {
        const d = await repRes.json();
        setReports(d.reports || []);
      }
      if (wRes.ok) {
        setWeather(await wRes.json());
      }
      if (fRes.ok) {
        setFlood(await fRes.json());
      }

      setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeodata();
  }, [selectedDistrict]);

  // Periodic Auto-refresh every 5 minutes (respecting API rate limits)
  useEffect(() => {
    const timer = setInterval(() => {
      fetchGeodata();
    }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [selectedDistrict]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative overflow-hidden bg-atmosphere-bg">
      {/* Map Control Header */}
      <div className="glass-panel px-4 py-3 border-b border-atmosphere-border flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-muted hover:text-atmosphere-ice transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold font-heading text-atmosphere-text">
              Geospatial Multi-Hazard Intelligence Monitor
            </h1>
            <p className="text-xs font-mono text-atmosphere-muted">
              Live GIS layers &bull; OpenStreetMap &bull; Esri Cartography &bull; Real-Time Overlays
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDistrict.id}
            onChange={(e) => {
              const d = ODISHA_DISTRICTS.find(x => x.id === e.target.value);
              if (d) setSelectedDistrict(d);
            }}
            className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text text-xs rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-atmosphere-ice cursor-pointer"
          >
            {ODISHA_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#081522] text-[#F1F7FC]">
                {d.name} &bull; {d.headquarters}
              </option>
            ))}
          </select>

          <button
            onClick={fetchGeodata}
            disabled={loading}
            className="p-1.5 rounded-lg bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice transition-colors"
            title="Refresh Map Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Full Size Interactive Map */}
      <div className="flex-1 w-full h-full relative">
        <DynamicMap
          selectedDistrict={selectedDistrict}
          onSelectDistrict={(d) => setSelectedDistrict(d)}
          earthquakes={earthquakes}
          alerts={alerts}
          reports={reports}
          weather={weather}
          flood={flood}
          zoomLevel={8}
          lastUpdated={lastUpdated}
          onRefresh={fetchGeodata}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
