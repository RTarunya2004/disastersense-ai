"use client";

import { motion } from "framer-motion";
import { getWeatherCondition } from "./weather-utils";

interface AtmosphereEffectsProps {
  weatherCode: number;
  className?: string;
}

export default function AtmosphereEffects({ weatherCode, className = "" }: AtmosphereEffectsProps) {
  const condition = getWeatherCondition(weatherCode);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Dynamic Atmospheric Ambient Background Gradient */}
      <motion.div
        key={`ambient-${condition.category}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={`absolute inset-0 bg-gradient-to-br ${condition.gradient}`}
      />

      {/* Sunny / Clear Sky Effects */}
      {condition.category === "clear" && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-amber-400/25 via-atmosphere-ice/20 to-transparent blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 15, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-10 w-48 h-48 rounded-full bg-atmosphere-teal/15 blur-2xl"
          />
        </>
      )}

      {/* Cloudy / Overcast Effects */}
      {condition.category === "cloudy" && (
        <>
          <motion.div
            animate={{
              x: [-40, 40, -40],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 -left-20 w-[480px] h-48 bg-gradient-to-r from-transparent via-slate-400/15 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [40, -40, 40],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-6 right-0 w-[400px] h-40 bg-gradient-to-r from-transparent via-atmosphere-ice/15 to-transparent rounded-full blur-2xl"
          />
        </>
      )}

      {/* Fog Effects */}
      {condition.category === "fog" && (
        <motion.div
          animate={{
            opacity: [0.4, 0.7, 0.4],
            y: [-10, 10, -10],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-t from-slate-400/20 via-atmosphere-surface/30 to-transparent backdrop-blur-[2px]"
        />
      )}

      {/* Rain / Drizzle Particle Streaks */}
      {condition.category === "rain" && (
        <div className="absolute inset-0 overflow-hidden opacity-60">
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-atmosphere-teal/10 to-transparent"
          />
          {/* Subtle staggered falling rain lines */}
          {[10, 24, 38, 52, 66, 80, 92].map((leftPercent, i) => (
            <motion.div
              key={i}
              initial={{ y: -60, opacity: 0 }}
              animate={{
                y: [ -60, 400 ],
                opacity: [ 0, 0.75, 0 ],
              }}
              transition={{
                duration: 1.1 + (i % 3) * 0.2,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "linear",
              }}
              style={{ left: `${leftPercent}%` }}
              className="absolute top-0 w-[1.5px] h-12 bg-gradient-to-b from-transparent via-atmosphere-ice/80 to-atmosphere-teal rounded-full"
            />
          ))}
        </div>
      )}

      {/* Storm / Thunderstorm Visuals */}
      {condition.category === "storm" && (
        <>
          <motion.div
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900/50 to-atmosphere-severe/20"
          />
          {/* Gentle, non-flashing ambient lightning glow */}
          <motion.div
            animate={{
              opacity: [0, 0.25, 0, 0.15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              times: [0, 0.08, 0.16, 0.24, 1],
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-tr from-atmosphere-ice/20 via-white/10 to-transparent blur-xl"
          />
          {/* Heavy rain burst streaks */}
          {[12, 28, 45, 62, 78, 90].map((leftPercent, i) => (
            <motion.div
              key={i}
              initial={{ y: -80, opacity: 0 }}
              animate={{
                y: [ -80, 450 ],
                opacity: [ 0, 0.9, 0 ],
              }}
              transition={{
                duration: 0.85 + (i % 2) * 0.15,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "linear",
              }}
              style={{ left: `${leftPercent}%` }}
              className="absolute top-0 w-[2px] h-16 bg-gradient-to-b from-transparent via-white/90 to-atmosphere-ice"
            />
          ))}
        </>
      )}
    </div>
  );
}
