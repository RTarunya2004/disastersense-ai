"use client";

import { useState, useEffect } from "react";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { WeatherData } from "@/types";
import { CloudRain, Wind, Droplets, Thermometer, Compass, Calendar, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function ForecastPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(ODISHA_DISTRICTS[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecast() {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?lat=${selectedDistrict.coordinates.lat}&lng=${selectedDistrict.coordinates.lng}&district=${encodeURIComponent(selectedDistrict.name)}`);
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchForecast();
  }, [selectedDistrict]);

  // Hourly chart data formatting
  const hourlyChartData = (weather?.hourly || []).map((h) => {
    const timeLabel = new Date(h.time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
    return {
      time: timeLabel,
      temp: Math.round(h.temperatureC),
      precip: Number(h.precipitationMm.toFixed(1)),
      wind: Math.round(h.windSpeedKmh),
      gusts: Math.round(h.windGustsKmh),
      humidity: h.relativeHumidityPercent,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-atmosphere-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-atmosphere-muted hover:text-atmosphere-ice">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-bold font-heading text-atmosphere-text">
              Numerical Weather Prediction & Timelines
            </h1>
          </div>
          <p className="text-xs font-mono text-atmosphere-muted">
            High-Resolution Operational NWP &bull; ECMWF / GFS Operational Models
          </p>
        </div>

        {/* District Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="forecast-district-select" className="text-xs font-mono text-atmosphere-muted">District:</label>
          <select
            id="forecast-district-select"
            aria-label="Select Odisha District for Forecast Analysis"
            value={selectedDistrict.id}
            onChange={(e) => {
              const d = ODISHA_DISTRICTS.find(x => x.id === e.target.value);
              if (d) setSelectedDistrict(d);
            }}
            className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-atmosphere-ice"
          >
            {ODISHA_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} &bull; {d.headquarters}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 24-Hour Temperature & Wind Gust Trend Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-atmosphere-border">
        <div className="flex items-center justify-between pb-4 border-b border-atmosphere-border/60 mb-6">
          <div>
            <h2 className="text-base font-bold font-heading text-atmosphere-text flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-atmosphere-ice" />
              24-Hour Temperature Curve (°C)
            </h2>
            <p className="text-xs font-mono text-atmosphere-muted">Surface air temperature progression over next 24 hours</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-atmosphere-surface text-atmosphere-ice border border-atmosphere-border">
            Current: {weather?.current?.temperatureC ?? 29}°C
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyChartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#61C7E7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#61C7E7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#28445B" opacity={0.5} />
              <XAxis dataKey="time" stroke="#A1B6C8" fontSize={11} tickLine={false} />
              <YAxis stroke="#A1B6C8" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "#102538", borderColor: "#28445B", borderRadius: "8px", fontSize: "12px", color: "#F1F7FC" }}
              />
              <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#61C7E7" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 24-Hour Precipitation Volume Bar Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-atmosphere-border">
        <div className="flex items-center justify-between pb-4 border-b border-atmosphere-border/60 mb-6">
          <div>
            <h2 className="text-base font-bold font-heading text-atmosphere-text flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-atmosphere-teal" />
              24-Hour Precipitation Forecast (mm/hr)
            </h2>
            <p className="text-xs font-mono text-atmosphere-muted">Precipitation volume expectations per hour</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-atmosphere-surface text-atmosphere-teal border border-atmosphere-border">
            Total Today: {weather?.daily?.[0]?.precipitationSumMm?.toFixed(1) ?? 0} mm
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#28445B" opacity={0.5} />
              <XAxis dataKey="time" stroke="#A1B6C8" fontSize={11} tickLine={false} />
              <YAxis stroke="#A1B6C8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#102538", borderColor: "#28445B", borderRadius: "8px", fontSize: "12px", color: "#F1F7FC" }}
              />
              <Bar dataKey="precip" name="Precipitation (mm)" fill="#47C8C1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Day-by-Day Forecast Breakdown */}
      <div className="glass-panel rounded-2xl p-6 border border-atmosphere-border">
        <div className="flex items-center justify-between pb-4 border-b border-atmosphere-border/60 mb-6">
          <h2 className="text-base font-bold font-heading text-atmosphere-text flex items-center gap-2">
            <Calendar className="w-4 h-4 text-atmosphere-ice" />
            7-Day Synoptic Meteorological Outlook &bull; {selectedDistrict.name}
          </h2>
          <span className="text-xs font-mono text-atmosphere-muted">Updated Operational Run</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {(weather?.daily || []).map((day, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-atmosphere-surface border border-atmosphere-border flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-atmosphere-muted uppercase">
                  {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                </span>
                <div className="text-lg font-bold font-mono text-atmosphere-text my-2">
                  {Math.round(day.temperatureMaxC)}° / <span className="text-sm font-normal text-atmosphere-muted">{Math.round(day.temperatureMinC)}°C</span>
                </div>
                <p className="text-xs text-atmosphere-teal font-medium mb-3">
                  {day.weatherDescription}
                </p>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-atmosphere-muted pt-3 border-t border-atmosphere-border/60">
                <div className="flex justify-between">
                  <span>Rain Chance:</span>
                  <span className="text-atmosphere-ice">{day.precipitationProbabilityMaxPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Accumulation:</span>
                  <span>{day.precipitationSumMm.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Gusts:</span>
                  <span>{day.windGustsMaxKmh} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
