export interface WeatherCondition {
  code: number;
  label: string;
  description: string;
  icon: string;
  category: 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog';
  gradient: string;
}

export const WEATHER_CONDITIONS: WeatherCondition[] = [
  { code: 0, label: "Clear Sky", description: "Clear and sunny sky", icon: "☀️", category: "clear", gradient: "from-amber-500/20 via-atmosphere-ice/15 to-transparent" },
  { code: 1, label: "Mainly Clear", description: "Mostly clear skies with pleasant sunlight", icon: "🌤️", category: "clear", gradient: "from-amber-400/20 via-atmosphere-teal/15 to-transparent" },
  { code: 2, label: "Partly Cloudy", description: "Scattered cloud cover with sunny intervals", icon: "⛅", category: "cloudy", gradient: "from-atmosphere-ice/20 via-atmosphere-surface to-transparent" },
  { code: 3, label: "Overcast", description: "Dense persistent cloud cover", icon: "☁️", category: "cloudy", gradient: "from-slate-500/25 via-atmosphere-surface to-transparent" },
  { code: 45, label: "Foggy", description: "Dense fog with restricted visibility", icon: "🌫️", category: "fog", gradient: "from-slate-400/20 via-atmosphere-elevated to-transparent" },
  { code: 48, label: "Depositing Rime Fog", description: "Freezing fog and icy moisture", icon: "🌫️", category: "fog", gradient: "from-teal-300/20 via-atmosphere-elevated to-transparent" },
  { code: 51, label: "Light Drizzle", description: "Fine light intermittent drizzle", icon: "🌦️", category: "rain", gradient: "from-atmosphere-teal/25 via-atmosphere-surface to-transparent" },
  { code: 53, label: "Moderate Drizzle", description: "Steady continuous drizzle", icon: "🌦️", category: "rain", gradient: "from-atmosphere-ice/25 via-atmosphere-surface to-transparent" },
  { code: 55, label: "Dense Drizzle", description: "Dense heavy drizzle with wet surface conditions", icon: "🌧️", category: "rain", gradient: "from-blue-500/25 via-atmosphere-surface to-transparent" },
  { code: 61, label: "Slight Rain", description: "Light steady rainfall", icon: "🌧️", category: "rain", gradient: "from-atmosphere-ice/30 via-atmosphere-surface to-transparent" },
  { code: 63, label: "Moderate Rain", description: "Moderate steady rainfall across district", icon: "🌧️", category: "rain", gradient: "from-blue-600/30 via-atmosphere-surface to-transparent" },
  { code: 65, label: "Heavy Rain", description: "Intense torrential downpour with localized pooling", icon: "🌧️", category: "rain", gradient: "from-blue-700/35 via-atmosphere-elevated to-transparent" },
  { code: 71, label: "Slight Snow", description: "Light sporadic snow flurries", icon: "❄️", category: "clear", gradient: "from-cyan-300/20 via-atmosphere-surface to-transparent" },
  { code: 73, label: "Moderate Snow", description: "Steady snow accumulation", icon: "❄️", category: "clear", gradient: "from-cyan-400/25 via-atmosphere-surface to-transparent" },
  { code: 75, label: "Heavy Snow", description: "Heavy blizzard conditions", icon: "❄️", category: "clear", gradient: "from-cyan-500/30 via-atmosphere-elevated to-transparent" },
  { code: 80, label: "Light Showers", description: "Brief passing rain showers", icon: "🌦️", category: "rain", gradient: "from-teal-400/25 via-atmosphere-surface to-transparent" },
  { code: 81, label: "Moderate Showers", description: "Squally passing rain showers", icon: "🌧️", category: "rain", gradient: "from-blue-500/30 via-atmosphere-surface to-transparent" },
  { code: 82, label: "Violent Showers", description: "Severe torrential rain bursts", icon: "⛈️", category: "storm", gradient: "from-indigo-600/35 via-atmosphere-elevated to-transparent" },
  { code: 95, label: "Thunderstorm", description: "Active convective thunderstorm with lightning", icon: "⛈️", category: "storm", gradient: "from-amber-500/30 via-purple-900/30 to-transparent" },
  { code: 96, label: "Thunderstorm w/ Hail", description: "Thunderstorm accompanied by hail stones", icon: "⛈️", category: "storm", gradient: "from-atmosphere-severe/35 via-purple-900/35 to-transparent" },
  { code: 99, label: "Severe Thunderstorm", description: "Severe convective cyclone squall with destructive gusts", icon: "🌪️", category: "storm", gradient: "from-red-600/40 via-purple-950/40 to-transparent" },
];

export function getWeatherCondition(code: number): WeatherCondition {
  return (
    WEATHER_CONDITIONS.find((c) => c.code === code) || {
      code,
      label: "Variable",
      description: "Atmospheric cloudiness with variable winds",
      icon: "🌤️",
      category: "cloudy",
      gradient: "from-atmosphere-ice/15 via-atmosphere-surface to-transparent",
    }
  );
}

export function getWindCompass(degrees: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  const idx = Math.round((degrees % 360) / 22.5);
  return directions[idx % 16];
}

export function formatTimeIST(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return isoString.slice(11, 16);
  }
}

export function formatDateIST(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return isoString;
  }
}
