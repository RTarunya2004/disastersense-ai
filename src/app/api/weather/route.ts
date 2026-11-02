import { NextRequest, NextResponse } from "next/server";
import globalCache from "@/lib/cache";
import { WeatherData, WeatherForecastDay, WeatherForecastHour } from "@/types";

function interpretWmoCode(code: number): string {
  switch (code) {
    case 0: return "Clear Sky";
    case 1: return "Mainly Clear";
    case 2: return "Partly Cloudy";
    case 3: return "Overcast";
    case 45: return "Fog";
    case 48: return "Depositing Rime Fog";
    case 51: return "Light Drizzle";
    case 53: return "Moderate Drizzle";
    case 55: return "Dense Drizzle";
    case 61: return "Slight Rain";
    case 63: return "Moderate Rain";
    case 65: return "Heavy Rain";
    case 80: return "Slight Rain Showers";
    case 81: return "Moderate Rain Showers";
    case 82: return "Violent Rain Showers";
    case 95: return "Thunderstorm";
    case 96: return "Thunderstorm with Slight Hail";
    case 99: return "Severe Thunderstorm with Heavy Hail";
    default: return "Cloudy / Variable";
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "20.2961");
  const lng = parseFloat(searchParams.get("lng") || "85.8245");
  const district = searchParams.get("district") || "Khordha (Bhubaneswar)";

  const cacheKey = `weather_${lat.toFixed(3)}_${lng.toFixed(3)}`;
  const cached = globalCache.get<WeatherData>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached.data, _cached: true });
  }

  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=Asia%2FKolkata&forecast_days=7`;

  try {
    const res = await fetch(endpoint, {
      headers: { "User-Agent": "DisasterSense-AI/1.0" },
      next: { revalidate: 600 }
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP error: ${res.status}`);
    }

    const data = await res.json();

    const hourlyForecast: WeatherForecastHour[] = (data.hourly?.time || []).slice(0, 24).map((timeStr: string, idx: number) => ({
      time: timeStr,
      temperatureC: data.hourly?.temperature_2m?.[idx] ?? 0,
      precipitationMm: data.hourly?.precipitation?.[idx] ?? 0,
      precipitationProbabilityPercent: data.hourly?.precipitation_probability?.[idx] ?? 0,
      windSpeedKmh: data.hourly?.wind_speed_10m?.[idx] ?? 0,
      windGustsKmh: data.hourly?.wind_gusts_10m?.[idx] ?? 0,
      relativeHumidityPercent: data.hourly?.relative_humidity_2m?.[idx] ?? 0,
    }));

    const dailyForecast: WeatherForecastDay[] = (data.daily?.time || []).map((dateStr: string, idx: number) => ({
      date: dateStr,
      temperatureMaxC: data.daily?.temperature_2m_max?.[idx] ?? 0,
      temperatureMinC: data.daily?.temperature_2m_min?.[idx] ?? 0,
      precipitationSumMm: data.daily?.precipitation_sum?.[idx] ?? 0,
      precipitationProbabilityMaxPercent: data.daily?.precipitation_probability_max?.[idx] ?? 0,
      windSpeedMaxKmh: data.daily?.wind_speed_10m_max?.[idx] ?? 0,
      windGustsMaxKmh: data.daily?.wind_gusts_10m_max?.[idx] ?? 0,
      weatherCode: data.daily?.weather_code?.[idx] ?? 0,
      weatherDescription: interpretWmoCode(data.daily?.weather_code?.[idx] ?? 0),
    }));

    const weatherPayload: WeatherData = {
      source: "Open-Meteo Numerical Weather Prediction (NWP)",
      attribution: "Data provided under Open-Meteo Non-Commercial Terms (ECMWF & GFS operational models)",
      retrievedAt: new Date().toISOString(),
      location: {
        latitude: lat,
        longitude: lng,
        district,
        state: "Odisha, India",
        elevationMeters: data.elevation,
      },
      current: {
        time: data.current?.time || new Date().toISOString(),
        temperatureC: data.current?.temperature_2m ?? 28,
        apparentTemperatureC: data.current?.apparent_temperature ?? 30,
        relativeHumidityPercent: data.current?.relative_humidity_2m ?? 70,
        precipitationMm: data.current?.precipitation ?? 0,
        rainMm: data.current?.rain ?? 0,
        windSpeedKmh: data.current?.wind_speed_10m ?? 12,
        windGustsKmh: data.current?.wind_gusts_10m ?? 20,
        windDirectionDegrees: data.current?.wind_direction_10m ?? 180,
        weatherCode: data.current?.weather_code ?? 0,
        weatherDescription: interpretWmoCode(data.current?.weather_code ?? 0),
        surfacePressureHpa: data.current?.surface_pressure ?? 1010,
      },
      hourly: hourlyForecast,
      daily: dailyForecast,
    };

    // Cache for 10 minutes
    globalCache.set(cacheKey, weatherPayload, 10 * 60 * 1000);

    return NextResponse.json(weatherPayload);
  } catch (error: any) {
    console.error("Open-Meteo Weather Fetch Error:", error);
    // Return grounded fallback with clear attribution of offline fallback
    return NextResponse.json({
      error: true,
      message: error?.message || "Failed to fetch upstream weather data",
      source: "Fallback Offline Simulation (Open-Meteo Unreachable)",
      retrievedAt: new Date().toISOString(),
      location: { latitude: lat, longitude: lng, district, state: "Odisha" },
      current: {
        time: new Date().toISOString(),
        temperatureC: 29.5,
        apparentTemperatureC: 32.0,
        relativeHumidityPercent: 68,
        precipitationMm: 0,
        rainMm: 0,
        windSpeedKmh: 14.5,
        windGustsKmh: 22.0,
        windDirectionDegrees: 170,
        weatherCode: 2,
        weatherDescription: "Partly Cloudy (Fallback)",
        surfacePressureHpa: 1011,
      },
      hourly: [],
      daily: [],
    }, { status: 200 });
  }
}
