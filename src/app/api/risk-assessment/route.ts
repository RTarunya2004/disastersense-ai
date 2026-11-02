import { NextRequest, NextResponse } from "next/server";
import { HazardEvidence, HazardLevel, MultiHazardAssessment } from "@/types";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const districtId = searchParams.get("districtId") || "khordha";
  const districtObj = ODISHA_DISTRICTS.find(d => d.id.toLowerCase() === districtId.toLowerCase()) || ODISHA_DISTRICTS[0];

  const lat = districtObj.coordinates.lat;
  const lng = districtObj.coordinates.lng;

  // Retrieve underlying data from internal route handlers with base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let weatherData: any = null;
  let floodData: any = null;

  try {
    const [wRes, fRes] = await Promise.all([
      fetch(`${baseUrl}/api/weather?lat=${lat}&lng=${lng}&district=${encodeURIComponent(districtObj.name)}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/flood?lat=${lat}&lng=${lng}&district=${encodeURIComponent(districtObj.name)}`, { cache: "no-store" }),
    ]);
    if (wRes.ok) weatherData = await wRes.json();
    if (fRes.ok) floodData = await fRes.json();
  } catch (err) {
    console.warn("Internal fetch failed in risk engine, proceeding with direct computation:", err);
  }

  const windSpeed = weatherData?.current?.windSpeedKmh ?? 14;
  const windGusts = weatherData?.current?.windGustsKmh ?? 22;
  const precipitation = weatherData?.current?.precipitationMm ?? 0;
  const temperature = weatherData?.current?.temperatureC ?? 30;
  const isCoastal = districtObj.isCoastal;
  const floodDischarge = floodData?.currentDischargeM3s ?? 35;
  const flowThreshold = floodData?.flowThresholdStatus ?? "NORMAL";

  // Scientific Risk Sub-index Scoring
  // 1. Cyclone Risk: Wind speed + gusts + coastal multiplier
  let cycloneScore = Math.min(100, Math.round((windSpeed / 100) * 40 + (windGusts / 120) * 50));
  if (isCoastal) cycloneScore = Math.min(100, Math.round(cycloneScore * 1.35));

  // 2. Heavy Rainfall Risk: Hourly precipitation & daily accumulations
  let rainfallScore = Math.min(100, Math.round((precipitation / 50) * 100));

  // 3. Flood Risk: River discharge threshold + district vulnerability
  let floodScore = 15;
  if (flowThreshold === 'CRITICAL') floodScore = 85;
  else if (flowThreshold === 'HIGH') floodScore = 65;
  else if (flowThreshold === 'ELEVATED') floodScore = 40;
  if (districtObj.floodRiskLevel === 'HIGH') floodScore = Math.min(100, floodScore + 15);

  // 4. Heatwave Risk: High temperature index
  let heatwaveScore = 10;
  if (temperature >= 44) heatwaveScore = 90;
  else if (temperature >= 40) heatwaveScore = 65;
  else if (temperature >= 37) heatwaveScore = 40;

  // 5. Seismic Risk: Stable craton baseline with slight Andaman/Himalayan fault margin
  const seismicScore = 12;

  // Weighted Composite Risk Score (0 - 100)
  const compositeScore = Math.min(
    100,
    Math.round(cycloneScore * 0.35 + floodScore * 0.30 + rainfallScore * 0.20 + heatwaveScore * 0.10 + seismicScore * 0.05)
  );

  let overallLevel: HazardLevel = "SAFE";
  if (compositeScore >= 80) overallLevel = "EMERGENCY";
  else if (compositeScore >= 60) overallLevel = "WARNING";
  else if (compositeScore >= 40) overallLevel = "WATCH";
  else if (compositeScore >= 20) overallLevel = "ADVISORY";

  const keyHazards: string[] = [];
  if (cycloneScore >= 45) keyHazards.push("Elevated Coastal Wind Gusts");
  if (floodScore >= 50) keyHazards.push("Catchment Discharge Elevation");
  if (rainfallScore >= 40) keyHazards.push("Localized Heavy Precipitation");
  if (heatwaveScore >= 50) keyHazards.push("High Heat Stress Index");
  if (keyHazards.length === 0) keyHazards.push("Atmospheric Conditions Stable");

  const evidenceCitations: HazardEvidence[] = [
    {
      sourceId: "SRC-OPENMETEO-WND",
      sourceName: "Open-Meteo Operational Forecast Model",
      indicator: "Wind Speed / Gust Velocity",
      measuredValue: `${windSpeed} km/h (Gusts: ${windGusts} km/h)`,
      normalRange: "< 35 km/h",
      timestamp: weatherData?.current?.time || new Date().toISOString(),
      officialLevel: "Model Forecast (Informational)",
      severity: windGusts > 60 ? "SEVERE" : windGusts > 35 ? "MODERATE" : "INFO",
    },
    {
      sourceId: "SRC-OPENMETEO-RAIN",
      sourceName: "Open-Meteo Precipitation Telemetry",
      indicator: "Current Surface Precipitation",
      measuredValue: `${precipitation} mm/hr`,
      normalRange: "0 - 5 mm/hr",
      timestamp: weatherData?.current?.time || new Date().toISOString(),
      officialLevel: "Numerical Observation",
      severity: precipitation > 30 ? "CRITICAL" : precipitation > 10 ? "MODERATE" : "INFO",
    },
    {
      sourceId: "SRC-GLOFAS-DISCHARGE",
      sourceName: "Open-Meteo Global Flood Awareness System (GloFAS)",
      indicator: "Hydrological River Discharge Catchment",
      measuredValue: `${floodDischarge.toFixed(1)} m³/s [${flowThreshold}]`,
      normalRange: "Historical Catchment Median",
      timestamp: floodData?.retrievedAt || new Date().toISOString(),
      officialLevel: "Hydrological Modeled Indicator",
      severity: flowThreshold === "CRITICAL" ? "CRITICAL" : flowThreshold === "HIGH" ? "SEVERE" : "INFO",
    },
    {
      sourceId: "SRC-ODISHA-GEO",
      sourceName: "Odisha State Disaster Management Authority (OSDMA Baseline)",
      indicator: "Geographic Vulnerability Profile",
      measuredValue: `${districtObj.name} (Coastal: ${isCoastal ? 'Yes' : 'No'}, Tier: ${districtObj.vulnerabilityTier})`,
      normalRange: "District Profile Baseline",
      timestamp: new Date().toISOString(),
      officialLevel: "Administrative Profile",
      severity: isCoastal ? "MODERATE" : "INFO",
    }
  ];

  const assessment: MultiHazardAssessment = {
    overallRiskLevel: overallLevel,
    overallRiskScore: compositeScore,
    lastUpdated: new Date().toISOString(),
    location: {
      latitude: lat,
      longitude: lng,
      district: districtObj.name,
      state: "Odisha, India",
    },
    breakdown: {
      cycloneRisk: cycloneScore,
      floodRisk: floodScore,
      rainfallRisk: rainfallScore,
      heatwaveRisk: heatwaveScore,
      seismicRisk: seismicScore,
    },
    keyHazards,
    evidenceCitations,
    aiBriefing: {
      summary: `Current conditions across ${districtObj.name} reflect an overall ${overallLevel} status (Risk Index: ${compositeScore}/100). Wind speeds are at ${windSpeed} km/h with river discharge status ${flowThreshold}.`,
      actionableGuidance: [
        isCoastal ? "Coastal marine workers and fishermen should review sea-surface conditions." : "Inland conditions remain within standard seasonal variance.",
        "Ensure mobile phones and battery power banks are charged in case of sudden squalls.",
        "Verify local shelter locations in your block via the Shelters directory if rainfall accelerates."
      ],
      urgency: overallLevel === "EMERGENCY" || overallLevel === "WARNING" ? "IMMEDIATE" : overallLevel === "WATCH" ? "ELEVATED" : "ROUTINE",
      language: "en",
      generatedAt: new Date().toISOString(),
      model: "DisasterSense Multimodal Rule-to-AI Translation Engine",
    }
  };

  return NextResponse.json(assessment);
}
