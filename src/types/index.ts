export type HazardLevel = 'SAFE' | 'ADVISORY' | 'WATCH' | 'WARNING' | 'EMERGENCY';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  district: string;
  state: string;
  elevationMeters?: number;
}

export interface WeatherCurrent {
  time: string;
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidityPercent: number;
  precipitationMm: number;
  rainMm: number;
  windSpeedKmh: number;
  windGustsKmh: number;
  windDirectionDegrees: number;
  weatherCode: number;
  weatherDescription: string;
  surfacePressureHpa: number;
}

export interface WeatherForecastDay {
  date: string;
  temperatureMaxC: number;
  temperatureMinC: number;
  precipitationSumMm: number;
  precipitationProbabilityMaxPercent: number;
  windSpeedMaxKmh: number;
  windGustsMaxKmh: number;
  weatherCode: number;
  weatherDescription: string;
}

export interface WeatherForecastHour {
  time: string;
  temperatureC: number;
  precipitationMm: number;
  precipitationProbabilityPercent: number;
  windSpeedKmh: number;
  windGustsKmh: number;
  relativeHumidityPercent: number;
}

export interface WeatherData {
  source: string;
  attribution: string;
  retrievedAt: string;
  location: LocationCoordinates;
  current: WeatherCurrent;
  hourly: WeatherForecastHour[];
  daily: WeatherForecastDay[];
}

export interface RiverDischargeDay {
  date: string;
  riverDischargeM3s: number;
  riverDischargeMedianM3s?: number;
  riverDischargeMaxM3s?: number;
  riverDischargeP75M3s?: number;
  riverDischargeP90M3s?: number;
}

export interface FloodData {
  source: string;
  attribution: string;
  retrievedAt: string;
  location: LocationCoordinates;
  currentDischargeM3s: number;
  flowThresholdStatus: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  dischargePercentile: number;
  dailyDischarge: RiverDischargeDay[];
  disclaimer: string;
}

export interface GdacsAlert {
  id: string;
  eventType: 'TC' | 'FL' | 'EQ' | 'VO' | 'DR' | 'WF' | 'OTHER';
  eventName: string;
  alertLevel: 'Green' | 'Orange' | 'Red';
  country: string;
  coordinates: [number, number]; // [lat, lng]
  fromdate: string;
  todate: string;
  severity: string;
  description: string;
  sourceUrl: string;
}

export interface UsgsEarthquake {
  id: string;
  title: string;
  magnitude: number;
  depthKm: number;
  place: string;
  time: number;
  formattedTime: string;
  coordinates: [number, number, number]; // [lng, lat, depth]
  distanceKmToOdisha: number;
  tsunamiFlag: number;
  url: string;
}

export interface HazardEvidence {
  sourceId: string;
  sourceName: string;
  indicator: string;
  measuredValue: string | number;
  normalRange: string;
  timestamp: string;
  officialLevel?: string;
  severity: 'INFO' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
}

export interface MultiHazardAssessment {
  overallRiskLevel: HazardLevel;
  overallRiskScore: number; // 0 - 100
  lastUpdated: string;
  location: LocationCoordinates;
  breakdown: {
    cycloneRisk: number;
    floodRisk: number;
    rainfallRisk: number;
    heatwaveRisk: number;
    seismicRisk: number;
  };
  keyHazards: string[];
  evidenceCitations: HazardEvidence[];
  aiBriefing?: {
    summary: string;
    actionableGuidance: string[];
    urgency: 'ROUTINE' | 'ELEVATED' | 'IMMEDIATE';
    language: 'en' | 'hi' | 'or';
    generatedAt: string;
    model: string;
  };
}

export interface OdishaDistrict {
  id: string;
  name: string;
  nameOdia: string;
  nameHindi: string;
  headquarters: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isCoastal: boolean;
  majorRivers: string[];
  vulnerabilityTier: 'VERY_HIGH' | 'HIGH' | 'MODERATE';
  cycloneRiskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  floodRiskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  populationEst: string;
  areaSqKm: number;
}

export interface VerifiedShelter {
  id: string;
  name: string;
  district: string;
  block: string;
  village: string;
  type: 'Multipurpose Cyclone Shelter (MPCS)' | 'Flood Shelter' | 'School Relief Center';
  capacity: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  contactPerson: string;
  contactNumber: string;
  backupGenerator: boolean;
  potableWater: boolean;
  status: 'ACTIVE' | 'STANDBY' | 'MAINTENANCE';
}

export interface CommunityReport {
  id: string;
  district: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: 'Waterlogging / Flood' | 'Tree / Powerline Down' | 'Structural Damage' | 'Road Blocked' | 'Shelter Need' | 'Other';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'UNVERIFIED' | 'UNDER_REVIEW' | 'VERIFIED' | 'RESOLVED';
  reportedAt: string;
  reporterAlias: string;
  upvotes: number;
}

export interface ApiSourceMetadata {
  id: string;
  name: string;
  provider: string;
  category: 'Weather Forecast' | 'Hydrology' | 'Global Alerts' | 'Seismic' | 'Geospatial' | 'Reasoning AI';
  updateCadence: string;
  attribution: string;
  endpointUrl: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'UNAVAILABLE';
  lastPingMs: number;
  isOfficialWarningAuthority: boolean;
}
