"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeatherData, FloodData, GdacsAlert, UsgsEarthquake } from "@/types";
import { formatTimeIST } from "./weather-utils";
import {
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Waves,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Compass,
  X,
  ExternalLink,
  AlertTriangle,
  Building2,
  Activity
} from "lucide-react";

interface WeatherCardsProps {
  weather: WeatherData;
  flood?: FloodData | null;
  alerts?: GdacsAlert[];
  earthquakes?: UsgsEarthquake[];
  className?: string;
}

type CardType = "temperature" | "precipitation" | "wind" | "humidity" | "flood" | "disasters";

export default function WeatherCards({
  weather,
  flood,
  alerts = [],
  earthquakes = [],
  className = "",
}: WeatherCardsProps) {
  const [expandedCard, setExpandedCard] = useState<CardType | null>(null);

  const toggleCard = (type: CardType) => {
    setExpandedCard(expandedCard === type ? null : type);
  };

  const current = weather.current;

  // 8-hour telemetry data
  const hourlySubset = (weather.hourly || []).slice(0, 8);

  // Cards Configuration
  const cardsConfig: Record<CardType, any> = {
    temperature: {
      title: "Temperature",
      value: `${Math.round(current.temperatureC)}°C`,
      subtitle: `Feels like ${Math.round(current.apparentTemperatureC)}°C`,
      icon: Thermometer,
      accentColor: "text-amber-400",
      bgLight: "bg-amber-400/10",
      borderHover: "hover:border-amber-400/40",
      unit: "°C",
      metricList: hourlySubset.map(h => ({
        label: formatTimeIST(h.time),
        val: Math.round(h.temperatureC),
      })),
    },
    precipitation: {
      title: "Rainfall Inflow",
      value: `${current.precipitationMm.toFixed(1)} mm`,
      subtitle: `${hourlySubset[0]?.precipitationProbabilityPercent ?? 0}% Probability`,
      icon: CloudRain,
      accentColor: "text-atmosphere-ice",
      bgLight: "bg-atmosphere-ice/10",
      borderHover: "hover:border-atmosphere-ice/40",
      unit: "mm",
      metricList: hourlySubset.map(h => ({
        label: formatTimeIST(h.time),
        val: Number(h.precipitationMm.toFixed(1)),
        prob: h.precipitationProbabilityPercent,
      })),
    },
    wind: {
      title: "Wind Dynamics",
      value: `${Math.round(current.windSpeedKmh)} km/h`,
      subtitle: `Gusts up to ${Math.round(current.windGustsKmh)} km/h`,
      icon: Wind,
      accentColor: "text-atmosphere-teal",
      bgLight: "bg-atmosphere-teal/10",
      borderHover: "hover:border-atmosphere-teal/40",
      unit: "km/h",
      metricList: hourlySubset.map(h => ({
        label: formatTimeIST(h.time),
        val: Math.round(h.windSpeedKmh),
        gust: Math.round(h.windGustsKmh),
      })),
    },
    humidity: {
      title: "Relative Humidity",
      value: `${Math.round(current.relativeHumidityPercent)}%`,
      subtitle: current.relativeHumidityPercent > 70 ? "High Coastal Humidity" : "Moderate Humidity",
      icon: Droplets,
      accentColor: "text-blue-400",
      bgLight: "bg-blue-500/10",
      borderHover: "hover:border-blue-400/40",
      unit: "%",
      metricList: hourlySubset.map(h => ({
        label: formatTimeIST(h.time),
        val: Math.round(h.relativeHumidityPercent),
      })),
    },
    flood: {
      title: "GloFAS River Runoff",
      value: flood ? `${Math.round(flood.currentDischargeM3s)} m³/s` : "Baseline Inflow",
      subtitle: flood?.flowThresholdStatus ? `${flood.flowThresholdStatus} Hydrological Inflow` : "Modeled Copernicus Runoff",
      icon: Waves,
      accentColor: flood?.flowThresholdStatus === "HIGH" || flood?.flowThresholdStatus === "CRITICAL" ? "text-atmosphere-severe" : "text-atmosphere-teal",
      bgLight: "bg-atmosphere-teal/10",
      borderHover: "hover:border-atmosphere-teal/40",
      unit: "m³/s",
      metricList: (flood?.dailyDischarge || []).slice(0, 7).map(d => ({
        label: d.date.slice(5),
        val: Math.round(d.riverDischargeM3s),
      })),
    },
    disasters: {
      title: "Multi-Hazard Alerts",
      value: `${alerts.length + earthquakes.length} Events`,
      subtitle: alerts.length > 0 ? `${alerts.length} GDACS Active Alert(s)` : "No Active GDACS Watch",
      icon: ShieldAlert,
      accentColor: alerts.length > 0 || earthquakes.length > 0 ? "text-atmosphere-warning" : "text-atmosphere-safe",
      bgLight: alerts.length > 0 ? "bg-atmosphere-severe/15" : "bg-atmosphere-safe/10",
      borderHover: "hover:border-atmosphere-warning/40",
      unit: "events",
      metricList: [],
    },
  };

  const cardKeys: CardType[] = ["temperature", "precipitation", "wind", "humidity", "flood", "disasters"];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {cardKeys.map((type) => {
        const config = cardsConfig[type];
        const isExpanded = expandedCard === type;

        return (
          <div key={type} className={isExpanded ? "col-span-1 sm:col-span-2 lg:col-span-3" : ""}>
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <ExpandedCard
                  key={`expanded-${type}`}
                  type={type}
                  config={config}
                  weather={weather}
                  flood={flood}
                  alerts={alerts}
                  earthquakes={earthquakes}
                  onCollapse={() => toggleCard(type)}
                />
              ) : (
                <CollapsedCard
                  key={`collapsed-${type}`}
                  type={type}
                  config={config}
                  onExpand={() => toggleCard(type)}
                />
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function CollapsedCard({
  type,
  config,
  onExpand,
}: {
  type: CardType;
  config: any;
  onExpand: () => void;
}) {
  const Icon = config.icon;

  return (
    <motion.button
      layoutId={`card-container-${type}`}
      onClick={onExpand}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className={`glass-panel p-5 rounded-2xl w-full text-left border border-atmosphere-border ${config.borderHover} transition-all relative overflow-hidden group shadow-lg cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${config.bgLight} ${config.accentColor} shadow-inner`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-atmosphere-muted group-hover:text-atmosphere-ice transition-colors">
          Tap to Expand &rarr;
        </span>
      </div>

      <p className="text-xs font-mono text-atmosphere-muted mb-1">{config.title}</p>
      <p className="text-2xl font-bold font-heading text-atmosphere-text mb-1 tracking-tight">
        {config.value}
      </p>
      <p className="text-xs text-atmosphere-muted/80 truncate font-sans">
        {config.subtitle}
      </p>
    </motion.button>
  );
}

function ExpandedCard({
  type,
  config,
  weather,
  flood,
  alerts,
  earthquakes,
  onCollapse,
}: {
  type: CardType;
  config: any;
  weather: WeatherData;
  flood?: FloodData | null;
  alerts: GdacsAlert[];
  earthquakes: UsgsEarthquake[];
  onCollapse: () => void;
}) {
  const Icon = config.icon;
  const metrics = config.metricList;

  // Calculate statistics for the 8-hour window
  const numericValues = metrics.map((m: any) => m.val).filter((v: any) => typeof v === "number" && !isNaN(v));
  const min = numericValues.length ? Math.min(...numericValues) : 0;
  const max = numericValues.length ? Math.max(...numericValues) : 0;
  const avg = numericValues.length ? Math.round(numericValues.reduce((a: number, b: number) => a + b, 0) / numericValues.length) : 0;

  return (
    <motion.div
      layoutId={`card-container-${type}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel-elevated p-6 sm:p-7 rounded-2xl border border-atmosphere-ice/30 shadow-atmospheric relative overflow-hidden"
    >
      {/* Top Close Button */}
      <button
        onClick={onCollapse}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-atmosphere-surface hover:bg-atmosphere-border text-atmosphere-muted hover:text-atmosphere-text flex items-center justify-center transition-all z-20 border border-atmosphere-border"
        title="Collapse details"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pr-8">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${config.bgLight} ${config.accentColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-atmosphere-muted uppercase">{config.title} Detail</span>
            <h3 className="text-2xl font-bold font-heading text-atmosphere-text">
              {config.value}
            </h3>
            <p className="text-xs text-atmosphere-muted">{config.subtitle}</p>
          </div>
        </div>

        {numericValues.length > 0 && (
          <div className="flex items-center gap-6 font-mono text-xs glass-panel px-4 py-2 rounded-xl border border-atmosphere-border">
            <div className="text-center">
              <span className="text-atmosphere-muted block text-[10px] uppercase">Min</span>
              <span className="text-atmosphere-teal font-bold">{min} {config.unit}</span>
            </div>
            <div className="text-center">
              <span className="text-atmosphere-muted block text-[10px] uppercase">Avg</span>
              <span className="text-atmosphere-text font-bold">{avg} {config.unit}</span>
            </div>
            <div className="text-center">
              <span className="text-atmosphere-muted block text-[10px] uppercase">Max</span>
              <span className="text-atmosphere-warning font-bold">{max} {config.unit}</span>
            </div>
          </div>
        )}
      </div>

      {/* Specialized Content: GloFAS Flood Details */}
      {type === "flood" && (
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl bg-atmosphere-surface/80 border border-atmosphere-border text-xs leading-relaxed text-atmosphere-muted">
            <p className="font-semibold text-atmosphere-text mb-1 flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-atmosphere-teal" />
              Copernicus GloFAS River Flow Intelligence
            </p>
            <p>
              {flood?.disclaimer || "Discharge values represent Copernicus EMS / GloFAS v4.0 gridded hydrological model simulations. Data is uncalibrated and intended for regional indicator awareness."}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] text-atmosphere-text">
              <span>Threshold Status: <strong className="text-atmosphere-teal">{flood?.flowThresholdStatus || "NORMAL"}</strong></span>
              <span>Discharge Percentile: <strong className="text-atmosphere-ice">{flood?.dischargePercentile || 50}th</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Specialized Content: Multi-Hazard Intelligence */}
      {type === "disasters" && (
        <div className="space-y-3 mb-6">
          {alerts.length === 0 && earthquakes.length === 0 ? (
            <div className="p-4 rounded-xl bg-atmosphere-surface border border-atmosphere-border text-center text-xs text-atmosphere-muted font-mono">
              No active high-severity GDACS watches or USGS earthquakes detected in the local vicinity.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {alerts.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-atmosphere-severe/10 border border-atmosphere-severe/30 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-atmosphere-severe flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {a.eventName}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-atmosphere-severe/20 text-atmosphere-severe">
                      GDACS {a.alertLevel}
                    </span>
                  </div>
                  <p className="text-atmosphere-muted text-[11px]">{a.description || a.severity}</p>
                </div>
              ))}
              {earthquakes.map((eq) => (
                <div key={eq.id} className="p-3 rounded-xl bg-atmosphere-warning/10 border border-atmosphere-warning/30 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-atmosphere-warning flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" />
                      M {eq.magnitude.toFixed(1)} &bull; {eq.place}
                    </span>
                    <span className="text-[10px] font-mono text-atmosphere-muted">{eq.depthKm} km</span>
                  </div>
                  <p className="text-atmosphere-muted text-[11px] font-mono">{eq.formattedTime}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8-Slot Hourly Grid Timeline */}
      {metrics.length > 0 && (
        <div>
          <span className="text-[11px] font-mono text-atmosphere-muted uppercase block mb-2">
            Chronological Progression (Next Intervals)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {metrics.map((m: any, idx: number) => (
              <div
                key={idx}
                className="glass-panel p-2.5 rounded-xl border border-atmosphere-border text-center hover:border-atmosphere-ice/40 transition-colors"
              >
                <p className="text-[10px] font-mono text-atmosphere-muted mb-1">{m.label}</p>
                <p className="text-sm font-bold font-mono text-atmosphere-text">
                  {m.val} <span className="text-[10px] font-normal text-atmosphere-muted">{config.unit}</span>
                </p>
                {typeof m.prob === "number" && (
                  <p className="text-[10px] font-mono text-atmosphere-teal mt-0.5">{m.prob}%</p>
                )}
                {typeof m.gust === "number" && (
                  <p className="text-[9px] font-mono text-atmosphere-warning mt-0.5">G: {m.gust}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
