"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeatherData } from "@/types";
import { formatTimeIST } from "./weather-utils";
import {
  Thermometer,
  Wind,
  CloudRain,
  Droplets,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

interface AdvancedDataPanelProps {
  weather: WeatherData;
  className?: string;
}

type TabType = "temperature" | "wind" | "precipitation" | "humidity";

export default function AdvancedDataPanel({
  weather,
  className = "",
}: AdvancedDataPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("temperature");
  const chartId = useId();

  const hourly = (weather.hourly || []).slice(0, 24);

  // Chart datasets
  const tempChartData = hourly.map((h, i) => ({
    time: formatTimeIST(h.time),
    temp: Math.round(h.temperatureC),
    feelsLike: Math.round(h.temperatureC + (h.relativeHumidityPercent > 70 ? 2 : -1)),
    index: i,
  }));

  const windChartData = hourly.map((h, i) => ({
    time: formatTimeIST(h.time),
    speed: Math.round(h.windSpeedKmh),
    gusts: Math.round(h.windGustsKmh),
    index: i,
  }));

  const precipChartData = hourly.map((h, i) => ({
    time: formatTimeIST(h.time),
    precipitation: Number(h.precipitationMm.toFixed(1)),
    probability: h.precipitationProbabilityPercent,
    index: i,
  }));

  const humidityChartData = hourly.map((h, i) => ({
    time: formatTimeIST(h.time),
    humidity: Math.round(h.relativeHumidityPercent),
    index: i,
  }));

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "temperature", label: "Temperature & Feeling", icon: Thermometer },
    { id: "wind", label: "Wind & Squall Dynamics", icon: Wind },
    { id: "precipitation", label: "Precipitation Probability", icon: CloudRain },
    { id: "humidity", label: "Relative Humidity Profile", icon: Droplets },
  ];

  return (
    <div className={`glass-panel-elevated p-6 sm:p-7 rounded-3xl border border-atmosphere-border shadow-atmospheric ${className}`}>
      {/* Top Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-mono text-atmosphere-ice uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            24-Hour Synoptic Diagnostic Suite
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-atmosphere-text">
            Meteorological Trends
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-atmosphere-surface border border-atmosphere-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? "bg-atmosphere-ice text-atmosphere-bg font-semibold shadow-glow"
                    : "text-atmosphere-muted hover:text-atmosphere-text hover:bg-atmosphere-elevated"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Visualization Area */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <AnimatePresence mode="wait">
          {activeTab === "temperature" && (
            <motion.div
              key="tab-temperature"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempChartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#28445B" opacity={0.35} />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#A1B6C8", fontSize: 11 }}
                    tickFormatter={(val, i) => (i % 3 === 0 ? val : "")}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#A1B6C8", fontSize: 11 }}
                    tickFormatter={(val) => `${val}°C`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-panel px-4 py-2.5 rounded-xl border border-atmosphere-ice/40 shadow-xl text-xs font-mono">
                            <p className="text-atmosphere-muted mb-1">{payload[0].payload.time}</p>
                            <p className="text-amber-400 font-bold">
                              Air Temp: {payload[0].value}°C
                            </p>
                            {payload[1] && (
                              <p className="text-atmosphere-teal font-semibold">
                                Feels Like: {payload[1].value}°C
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px", fontSize: "12px", fontFamily: "IBM Plex Mono" }}
                  />
                  <Line
                    type="monotone"
                    name="Air Temperature (°C)"
                    dataKey="temp"
                    stroke="#E9B45A"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#E9B45A" }}
                  />
                  <Line
                    type="monotone"
                    name="Apparent Temperature (°C)"
                    dataKey="feelsLike"
                    stroke="#47C8C1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    activeDot={{ r: 4, fill: "#47C8C1" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {activeTab === "wind" && (
            <motion.div
              key="tab-wind"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={windChartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#28445B" opacity={0.35} />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#A1B6C8", fontSize: 11 }}
                    tickFormatter={(val, i) => (i % 3 === 0 ? val : "")}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#A1B6C8", fontSize: 11 }}
                    tickFormatter={(val) => `${val} km/h`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-panel px-4 py-2.5 rounded-xl border border-atmosphere-teal/40 shadow-xl text-xs font-mono">
                            <p className="text-atmosphere-muted mb-1">{payload[0].payload.time}</p>
                            <p className="text-atmosphere-teal font-bold">
                              Sustained: {payload[0].value} km/h
                            </p>
                            {payload[1] && (
                              <p className="text-atmosphere-warning font-semibold">
                                Peak Gust: {payload[1].value} km/h
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px", fontSize: "12px", fontFamily: "IBM Plex Mono" }}
                  />
                  <Line
                    type="monotone"
                    name="Sustained Wind 10m (km/h)"
                    dataKey="speed"
                    stroke="#47C8C1"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#47C8C1" }}
                  />
                  <Line
                    type="monotone"
                    name="Peak Wind Gusts 10m (km/h)"
                    dataKey="gusts"
                    stroke="#E9B45A"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#E9B45A" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {activeTab === "precipitation" && (
            <motion.div
              key="tab-precipitation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={precipChartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#28445B" opacity={0.35} />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#A1B6C8", fontSize: 11 }}
                    tickFormatter={(val, i) => (i % 3 === 0 ? val : "")}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#A1B6C8", fontSize: 11 }}
                    tickFormatter={(val) => `${val}mm`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#A1B6C8", fontSize: 11 }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-panel px-4 py-2.5 rounded-xl border border-atmosphere-ice/40 shadow-xl text-xs font-mono">
                            <p className="text-atmosphere-muted mb-1">{payload[0].payload.time}</p>
                            <p className="text-atmosphere-ice font-bold">
                              Rain Accumulation: {payload[0].value} mm
                            </p>
                            {payload[1] && (
                              <p className="text-atmosphere-teal font-semibold">
                                Rain Probability: {payload[1].value}%
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px", fontSize: "12px", fontFamily: "IBM Plex Mono" }}
                  />
                  <Bar
                    yAxisId="left"
                    name="Hourly Precipitation (mm)"
                    dataKey="precipitation"
                    fill="#61C7E7"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    name="Rain Probability (%)"
                    dataKey="probability"
                    stroke="#5AC49E"
                    strokeWidth={2}
                    dot={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {activeTab === "humidity" && (
            <motion.div
              key="tab-humidity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={humidityChartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#28445B" opacity={0.35} />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#A1B6C8", fontSize: 11 }}
                    tickFormatter={(val, i) => (i % 3 === 0 ? val : "")}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#A1B6C8", fontSize: 11 }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-panel px-4 py-2.5 rounded-xl border border-blue-400/40 shadow-xl text-xs font-mono">
                            <p className="text-atmosphere-muted mb-1">{payload[0].payload.time}</p>
                            <p className="text-blue-400 font-bold">
                              Relative Humidity: {payload[0].value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px", fontSize: "12px", fontFamily: "IBM Plex Mono" }}
                  />
                  <Bar
                    name="Relative Humidity (%)"
                    dataKey="humidity"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Met Description */}
      <div className="mt-4 pt-3 border-t border-atmosphere-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-atmosphere-muted">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-atmosphere-ice" />
          Model: Open-Meteo High-Resolution NWP Hourly Operational Run
        </span>
        <span className="text-atmosphere-teal">
          Timezone: Asia/Kolkata (IST +05:30)
        </span>
      </div>
    </div>
  );
}
