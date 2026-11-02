"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { WeatherData } from "@/types";
import { getWeatherCondition, getWindCompass, formatTimeIST } from "./weather-utils";
import AtmosphereEffects from "./AtmosphereEffects";
import {
  Wind,
  Droplets,
  Gauge,
  CloudRain,
  MapPin,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from "recharts";

interface HeroCardProps {
  weather: WeatherData;
  locationName: string;
  districtHQ?: string;
  className?: string;
}

export default function HeroCard({
  weather,
  locationName,
  districtHQ,
  className = "",
}: HeroCardProps) {
  const chartId = useId();
  const current = weather.current;
  const condition = getWeatherCondition(current.weatherCode);
  const windCompass = getWindCompass(current.windDirectionDegrees);

  // Compute today's min and max from daily forecast if available, or hourly
  const todayDaily = weather.daily?.[0];
  const tempMax = todayDaily ? Math.round(todayDaily.temperatureMaxC) : Math.round(current.temperatureC + 3);
  const tempMin = todayDaily ? Math.round(todayDaily.temperatureMinC) : Math.round(current.temperatureC - 3);

  // Prepare 24-hour temperature chart data
  const chartData = (weather.hourly || []).slice(0, 24).map((h, i) => ({
    time: formatTimeIST(h.time),
    temperature: Math.round(h.temperatureC),
    rawTime: h.time,
    index: i,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-3xl glass-panel-elevated border border-atmosphere-border hover:border-atmosphere-ice/40 shadow-atmospheric transition-all ${className}`}
    >
      {/* Weather-Responsive Atmospheric Motion Background */}
      <AtmosphereEffects weatherCode={current.weatherCode} />

      <div className="relative z-10 p-6 sm:p-8">
        {/* Top Header: Location, Badges & Time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-atmosphere-ice/15 text-atmosphere-ice">
                <MapPin className="w-4 h-4" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-atmosphere-text tracking-tight">
                {locationName}
              </h2>
              {districtHQ && (
                <span className="hidden md:inline-block text-xs font-mono px-2 py-0.5 rounded border border-atmosphere-border bg-atmosphere-surface text-atmosphere-muted">
                  HQ: {districtHQ}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-mono text-atmosphere-muted flex items-center gap-2">
              <span>Odisha, India</span>
              <span>&bull;</span>
              <span>{weather.location.latitude.toFixed(3)}°N, {weather.location.longitude.toFixed(3)}°E</span>
              {weather.location.elevationMeters && (
                <>
                  <span>&bull;</span>
                  <span>{Math.round(weather.location.elevationMeters)}m Elev</span>
                </>
              )}
            </p>
          </div>

          {/* Condition Pill & Operational Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-atmosphere-border bg-atmosphere-surface/80 backdrop-blur-md text-xs font-mono text-atmosphere-text shadow-sm">
              <span className="text-xl">{condition.icon}</span>
              <span className="font-semibold">{condition.label}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-atmosphere-safe/30 bg-atmosphere-safe/10 text-[11px] font-mono text-atmosphere-safe">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NWP Live</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Large Temperature Reading + Trendline Sparkline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-6">
          {/* Temperature and Feeling */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-baseline gap-4 mb-2">
              <motion.span
                key={`temp-${current.temperatureC}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="text-7xl sm:text-8xl font-black font-heading text-atmosphere-text tracking-tighter"
              >
                {Math.round(current.temperatureC)}
              </motion.span>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-light text-atmosphere-ice">°C</span>
                <span className="text-xs font-mono text-atmosphere-muted mt-1">
                  Feels like <strong className="text-atmosphere-text">{Math.round(current.apparentTemperatureC)}°C</strong>
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-atmosphere-muted mb-4 font-sans font-medium">
              {condition.description}
            </p>

            {/* High/Low & Pressure Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-atmosphere-surface/90 border border-atmosphere-border text-atmosphere-text">
                <ArrowUp className="w-3.5 h-3.5 text-atmosphere-warning" />
                <span>High: <strong>{tempMax}°C</strong></span>
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-atmosphere-surface/90 border border-atmosphere-border text-atmosphere-text">
                <ArrowDown className="w-3.5 h-3.5 text-atmosphere-teal" />
                <span>Low: <strong>{tempMin}°C</strong></span>
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-atmosphere-surface/90 border border-atmosphere-border text-atmosphere-muted">
                <Gauge className="w-3.5 h-3.5 text-atmosphere-ice" />
                <span>{Math.round(current.surfacePressureHpa)} hPa</span>
              </span>
            </div>
          </div>

          {/* 24-Hour Temperature Curve */}
          <div className="lg:col-span-7 h-44 sm:h-52 w-full pt-2">
            <div className="flex items-center justify-between mb-1 px-2">
              <span className="text-[11px] font-mono text-atmosphere-muted uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-atmosphere-ice" />
                24-Hour Diurnal Temperature Profile
              </span>
              <span className="text-[11px] font-mono text-atmosphere-ice">
                Peak {tempMax}°C
              </span>
            </div>

            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`${chartId}-grad`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#61C7E7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#47C8C1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#A1B6C8", fontSize: 10 }}
                  tickFormatter={(val, i) => (i % 4 === 0 ? val : "")}
                />
                <YAxis
                  domain={["dataMin - 2", "dataMax + 2"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#A1B6C8", fontSize: 10 }}
                  tickFormatter={(val) => `${val}°`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-panel px-3 py-1.5 rounded-lg border border-atmosphere-ice/40 shadow-lg text-xs font-mono">
                          <p className="text-atmosphere-muted">{payload[0].payload.time}</p>
                          <p className="text-atmosphere-ice font-bold text-sm">
                            {payload[0].value}°C
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  isAnimationActive={false}
                />
                <ReferenceLine
                  y={current.temperatureC}
                  stroke="#47C8C1"
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#61C7E7"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "#61C7E7", stroke: "#081522", strokeWidth: 2 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Key Met Grid: Wind, Rain, Humidity, Inflow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-atmosphere-border/70">
          {/* Wind */}
          <div className="glass-panel p-3 rounded-xl border border-atmosphere-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-atmosphere-ice/10 text-atmosphere-ice">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-atmosphere-muted uppercase">Wind Speed</p>
              <p className="text-base font-bold font-heading text-atmosphere-text">
                {Math.round(current.windSpeedKmh)} <span className="text-xs font-mono font-normal text-atmosphere-muted">km/h</span>
              </p>
              <p className="text-[10px] font-mono text-atmosphere-ice">
                {windCompass} &bull; Gusts {Math.round(current.windGustsKmh)}
              </p>
            </div>
          </div>

          {/* Rainfall */}
          <div className="glass-panel p-3 rounded-xl border border-atmosphere-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-atmosphere-teal/10 text-atmosphere-teal">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-atmosphere-muted uppercase">Precipitation</p>
              <p className="text-base font-bold font-heading text-atmosphere-text">
                {current.precipitationMm.toFixed(1)} <span className="text-xs font-mono font-normal text-atmosphere-muted">mm</span>
              </p>
              <p className="text-[10px] font-mono text-atmosphere-muted">
                {current.precipitationMm > 0 ? "Active Precipitation" : "Zero Inflow"}
              </p>
            </div>
          </div>

          {/* Humidity */}
          <div className="glass-panel p-3 rounded-xl border border-atmosphere-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-atmosphere-muted uppercase">Humidity</p>
              <p className="text-base font-bold font-heading text-atmosphere-text">
                {Math.round(current.relativeHumidityPercent)}<span className="text-xs font-mono font-normal text-atmosphere-muted">%</span>
              </p>
              <p className="text-[10px] font-mono text-atmosphere-muted">
                {current.relativeHumidityPercent > 75 ? "Humid Coastal Air" : "Normal Moisture"}
              </p>
            </div>
          </div>

          {/* Model Attribution & Timestamp */}
          <div className="glass-panel p-3 rounded-xl border border-atmosphere-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-atmosphere-warning/10 text-atmosphere-warning">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-atmosphere-muted uppercase">Latest Run</p>
              <p className="text-xs font-bold font-mono text-atmosphere-text truncate max-w-[140px]">
                {formatTimeIST(weather.retrievedAt || current.time)}
              </p>
              <p className="text-[10px] font-mono text-atmosphere-muted truncate">
                ECMWF / GFS Runs
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
