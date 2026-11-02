"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { ODISHA_SHELTERS } from "@/data/odishaShelters";
import { UsgsEarthquake, GdacsAlert, CommunityReport, OdishaDistrict, WeatherData, FloodData } from "@/types";
import {
  Layers,
  Shield,
  AlertCircle,
  Droplets,
  Waves,
  CheckCircle2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  MapPin,
  ExternalLink,
  Wind,
  Thermometer,
  Compass,
  Eye,
  Info
} from "lucide-react";

export interface MapProps {
  selectedDistrict: OdishaDistrict;
  onSelectDistrict?: (d: OdishaDistrict) => void;
  earthquakes?: UsgsEarthquake[];
  alerts?: GdacsAlert[];
  reports?: CommunityReport[];
  weather?: WeatherData | null;
  flood?: FloodData | null;
  centerLat?: number;
  centerLng?: number;
  zoomLevel?: number;
  lastUpdated?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

type BasemapType = "osm" | "dark" | "satellite";

export default function MapComponent({
  selectedDistrict,
  onSelectDistrict,
  earthquakes = [],
  alerts = [],
  reports = [],
  weather = null,
  flood = null,
  centerLat,
  centerLng,
  zoomLevel = 8,
  lastUpdated,
  onRefresh,
  isLoading = false,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const baseReferenceLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [currentBasemap, setCurrentBasemap] = useState<BasemapType>("osm");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");

  const [activeLayers, setActiveLayers] = useState({
    districts: true,
    weather: true,
    flood: true,
    shelters: true,
    alerts: true,
    earthquakes: true,
    reports: true,
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Helper to construct Basemap Tile Layers
  const setBasemap = (type: BasemapType) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layers
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }
    if (baseReferenceLayerRef.current) {
      map.removeLayer(baseReferenceLayerRef.current);
      baseReferenceLayerRef.current = null;
    }

    if (type === "osm") {
      // OpenStreetMap Standard Basemap (100% Free, Official OSM Tiles, High Detail Roads, Rivers, Cities)
      const osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      });
      osmLayer.addTo(map);
      baseTileLayerRef.current = osmLayer;
    } else if (type === "dark") {
      // Esri World Dark Gray Canvas (Legitimate, Free, No Watermark, Atmospheric Dark Palette)
      const esriDark = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16,
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      });
      esriDark.addTo(map);
      baseTileLayerRef.current = esriDark;

      // Add Reference labels on top
      const esriLabels = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16,
        attribution: '',
      });
      esriLabels.addTo(map);
      baseReferenceLayerRef.current = esriLabels;
    } else if (type === "satellite") {
      // Esri World Imagery (Satellite)
      const esriSat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
      });
      esriSat.addTo(map);
      baseTileLayerRef.current = esriSat;
    }

    setCurrentBasemap(type);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = centerLat || selectedDistrict.coordinates.lat || 20.2961;
      const initialLng = centerLng || selectedDistrict.coordinates.lng || 85.8245;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: zoomLevel,
        zoomControl: false,
        attributionControl: false,
      });

      // Default Basemap: OpenStreetMap Standard (Guarantees authentic geographic map without watermarks)
      const defaultOsm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      });
      defaultOsm.addTo(map);
      baseTileLayerRef.current = defaultOsm;

      // Attribution Control in bottom-right
      L.control.attribution({ position: "bottomright" }).addTo(map);

      // Dedicated layer group for all disaster telemetry & markers
      const group = L.layerGroup().addTo(map);
      layersGroupRef.current = group;

      mapInstanceRef.current = map;
    }

    return () => {
      // Clean up map instance if unmounted
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center / Zoom when district changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const targetLat = centerLat || selectedDistrict.coordinates.lat;
      const targetLng = centerLng || selectedDistrict.coordinates.lng;
      mapInstanceRef.current.flyTo([targetLat, targetLng], centerLat ? zoomLevel : 8.5, {
        duration: 1.2,
      });
    }
  }, [selectedDistrict, centerLat, centerLng, zoomLevel]);

  // Re-render all GIS & Disaster Telemetry Overlays
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    // 1. DISTRICTS LAYER (Polygons / Boundary Circles & Markers)
    if (activeLayers.districts) {
      ODISHA_DISTRICTS.forEach((d) => {
        const isCurrent = d.id === selectedDistrict.id;
        const radius = isCurrent ? 26000 : 16000;

        // Visual polygon halo
        const circle = L.circle([d.coordinates.lat, d.coordinates.lng], {
          radius,
          color: isCurrent ? "#0284c7" : d.isCoastal ? "#0d9488" : "#475569",
          fillColor: isCurrent ? "#38bdf8" : d.isCoastal ? "#14b8a6" : "#64748b",
          fillOpacity: isCurrent ? 0.35 : 0.15,
          weight: isCurrent ? 2.5 : 1.2,
          dashArray: isCurrent ? undefined : "3, 6",
        });

        const popupContent = `
          <div style="background:#081522; color:#F1F7FC; padding:10px; border-radius:8px; font-family:'DM Sans', sans-serif; font-size:12px; border:1px solid #28445B; min-width:210px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
              <strong style="color:#61C7E7; font-size:14px;">${d.name}</strong>
              <span style="font-size:10px; font-family:monospace; color:#A1B6C8;">${d.vulnerabilityTier}</span>
            </div>
            <div style="color:#47C8C1; font-size:11px; margin-bottom:6px;">${d.nameOdia} &bull; HQ: ${d.headquarters}</div>
            <div style="border-top:1px solid #28445B; padding-top:6px; font-size:11px; color:#A1B6C8; line-height:1.4;">
              <div>Type: <strong style="color:#F1F7FC;">${d.isCoastal ? "Coastal Surge Belt" : "Inland River Catchment"}</strong></div>
              <div>Major Rivers: <strong style="color:#F1F7FC;">${d.majorRivers.slice(0, 2).join(", ")}</strong></div>
              <div>Estimated Population: <strong style="color:#F1F7FC;">${d.populationEst}</strong></div>
            </div>
            <div style="margin-top:8px; text-align:center;">
              <span style="display:inline-block; padding:3px 8px; border-radius:4px; background:#183249; color:#61C7E7; font-size:10px; font-family:monospace; cursor:pointer;">
                ${isCurrent ? "✓ Active Monitored District" : "Click Map Circle to Select"}
              </span>
            </div>
          </div>
        `;

        circle.bindPopup(popupContent);
        circle.on("click", () => {
          if (onSelectDistrict) onSelectDistrict(d);
        });

        group.addLayer(circle);

        // Center Pin with District Label
        const labelMarker = L.circleMarker([d.coordinates.lat, d.coordinates.lng], {
          radius: isCurrent ? 7 : 4,
          color: isCurrent ? "#38bdf8" : "#ffffff",
          fillColor: isCurrent ? "#0284c7" : d.isCoastal ? "#0d9488" : "#334155",
          fillOpacity: 1,
          weight: 2,
        });

        labelMarker.bindTooltip(d.name, {
          permanent: isCurrent,
          direction: "top",
          className: "leaflet-district-tooltip",
          offset: [0, -8],
        });

        labelMarker.on("click", () => {
          if (onSelectDistrict) onSelectDistrict(d);
        });

        group.addLayer(labelMarker);
      });
    }

    // 2. WEATHER TELEMETRY OVERLAY (Open-Meteo Operational NWP)
    if (activeLayers.weather && weather && weather.current) {
      const cur = weather.current;
      const wLat = selectedDistrict.coordinates.lat;
      const wLng = selectedDistrict.coordinates.lng;

      const weatherMarker = L.circleMarker([wLat + 0.04, wLng - 0.04], {
        radius: 9,
        color: "#61C7E7",
        fillColor: "#081522",
        fillOpacity: 0.9,
        weight: 2.5,
      });

      const weatherPopup = `
        <div style="background:#081522; color:#F1F7FC; padding:10px; border-radius:8px; font-family:'DM Sans', sans-serif; font-size:12px; border:1px solid #61C7E7; min-width:220px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="color:#61C7E7; font-size:13px;">🌤️ Weather NWP Telemetry</strong>
            <span style="font-size:9px; font-family:monospace; background:#102538; color:#47C8C1; padding:2px 4px; border-radius:3px;">OPEN-METEO</span>
          </div>
          <div style="font-size:11px; color:#A1B6C8; margin-bottom:6px;">Location: <strong>${selectedDistrict.name}</strong></div>
          <div style="border-top:1px solid #28445B; padding-top:6px; font-family:monospace; font-size:11px; line-height:1.5;">
            <div>Temperature: <strong style="color:#F1F7FC;">${cur.temperatureC}°C</strong> (Feels: ${cur.apparentTemperatureC}°C)</div>
            <div>Wind Speed: <strong style="color:#61C7E7;">${cur.windSpeedKmh} km/h</strong> (Gusts: ${cur.windGustsKmh} km/h)</div>
            <div>Surface Rain: <strong style="color:#47C8C1;">${cur.precipitationMm} mm/hr</strong></div>
            <div>Conditions: <strong style="color:#F1F7FC;">${cur.weatherDescription}</strong></div>
            <div>Pressure: <strong>${cur.surfacePressureHpa} hPa</strong> &bull; Humidity: <strong>${cur.relativeHumidityPercent}%</strong></div>
          </div>
          <div style="margin-top:6px; font-size:9px; color:#A1B6C8; font-style:italic;">
            Classification: Operational Numerical Model Forecast (Informational).
          </div>
        </div>
      `;
      weatherMarker.bindPopup(weatherPopup);
      group.addLayer(weatherMarker);
    }

    // 3. FLOOD & RIVER DISCHARGE OVERLAY (Open-Meteo GloFAS)
    if (activeLayers.flood && flood) {
      const fLat = selectedDistrict.coordinates.lat - 0.04;
      const fLng = selectedDistrict.coordinates.lng + 0.04;
      const flowColor =
        flood.flowThresholdStatus === "CRITICAL" ? "#E76B70" :
        flood.flowThresholdStatus === "HIGH" ? "#E9B45A" :
        flood.flowThresholdStatus === "ELEVATED" ? "#61C7E7" : "#5AC49E";

      const floodMarker = L.circleMarker([fLat, fLng], {
        radius: 8,
        color: flowColor,
        fillColor: flowColor,
        fillOpacity: 0.8,
        weight: 2,
      });

      const floodPopup = `
        <div style="background:#081522; color:#F1F7FC; padding:10px; border-radius:8px; font-family:'DM Sans', sans-serif; font-size:12px; border:1px solid ${flowColor}; min-width:220px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="color:${flowColor}; font-size:13px;">🌊 River Runoff Inflow</strong>
            <span style="font-size:9px; font-family:monospace; background:#102538; color:${flowColor}; padding:2px 4px; border-radius:3px;">GloFAS v4.0</span>
          </div>
          <div style="font-size:11px; color:#A1B6C8; margin-bottom:6px;">Basin: <strong>${selectedDistrict.majorRivers[0] || "Catchment"}</strong> (${selectedDistrict.name})</div>
          <div style="border-top:1px solid #28445B; padding-top:6px; font-family:monospace; font-size:11px; line-height:1.5;">
            <div>Model Discharge: <strong style="color:#F1F7FC;">${flood.currentDischargeM3s.toFixed(1)} m³/s</strong></div>
            <div>Threshold Status: <strong style="color:${flowColor};">${flood.flowThresholdStatus}</strong></div>
            <div>Catchment Percentile: <strong>${flood.dischargePercentile}th %ile</strong></div>
          </div>
          <div style="margin-top:6px; font-size:9px; color:#E9B45A; font-style:italic;">
            Notice: ${flood.disclaimer}
          </div>
        </div>
      `;
      floodMarker.bindPopup(floodPopup);
      group.addLayer(floodMarker);
    }

    // 4. VERIFIED SHELTERS (MPCS - Multipurpose Cyclone Shelters)
    if (activeLayers.shelters) {
      ODISHA_SHELTERS.forEach((s) => {
        const shelterMarker = L.circleMarker([s.coordinates.lat, s.coordinates.lng], {
          radius: 7,
          color: "#5AC49E",
          fillColor: "#081522",
          fillOpacity: 0.9,
          weight: 2,
        });

        const shelterPopup = `
          <div style="background:#081522; color:#F1F7FC; padding:10px; border-radius:8px; font-family:'DM Sans', sans-serif; font-size:12px; border:1px solid #5AC49E; min-width:220px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="color:#5AC49E; font-size:13px;">🛡️ ${s.name}</strong>
              <span style="font-size:9px; font-family:monospace; background:#102538; color:#5AC49E; padding:2px 4px; border-radius:3px;">${s.status}</span>
            </div>
            <div style="color:#A1B6C8; font-size:11px; margin-bottom:6px;">${s.district} &bull; ${s.block} Block &bull; ${s.village}</div>
            <div style="border-top:1px solid #28445B; padding-top:6px; font-size:11px; color:#A1B6C8; line-height:1.4;">
              <div>Capacity: <strong style="color:#F1F7FC;">${s.capacity} persons</strong></div>
              <div>Power Generator: <strong style="color:#F1F7FC;">${s.backupGenerator ? '50kVA Operational' : 'Standard'}</strong></div>
              <div>Drinking Water: <strong style="color:#F1F7FC;">${s.potableWater ? 'Deep Tube-well with Filter' : 'Supply Tanker'}</strong></div>
              <div>Contact Officer: <strong style="color:#F1F7FC;">${s.contactNumber}</strong></div>
            </div>
            <div style="margin-top:8px; text-align:right;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${s.coordinates.lat},${s.coordinates.lng}" target="_blank" rel="noopener noreferrer" style="color:#61C7E7; font-size:11px; text-decoration:underline;">
                Open Directions &rarr;
              </a>
            </div>
          </div>
        `;

        shelterMarker.bindPopup(shelterPopup);
        group.addLayer(shelterMarker);
      });
    }

    // 5. GDACS DISASTER ALERTS
    if (activeLayers.alerts && alerts.length > 0) {
      alerts.forEach((alert) => {
        const color = alert.alertLevel === "Red" ? "#E76B70" : alert.alertLevel === "Orange" ? "#E9B45A" : "#5AC49E";

        const alertMarker = L.circleMarker([alert.coordinates[0], alert.coordinates[1]], {
          radius: 10,
          color,
          fillColor: color,
          fillOpacity: 0.6,
          weight: 2.5,
        });

        const alertPopup = `
          <div style="background:#081522; color:#F1F7FC; padding:10px; border-radius:8px; font-family:'DM Sans', sans-serif; font-size:12px; border:1px solid ${color}; min-width:220px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="color:${color}; font-size:13px;">⚠️ GDACS Alert: ${alert.eventName}</strong>
              <span style="font-size:9px; font-family:monospace; background:#102538; color:${color}; padding:2px 4px; border-radius:3px;">${alert.alertLevel} ALERT</span>
            </div>
            <div style="color:#A1B6C8; font-size:11px; margin-bottom:6px;">Region: <strong>${alert.country}</strong> &bull; Type: <strong>${alert.eventType}</strong></div>
            <div style="border-top:1px solid #28445B; padding-top:6px; font-size:11px; color:#A1B6C8; line-height:1.4;">
              <div>Severity: <strong style="color:#F1F7FC;">${alert.severity}</strong></div>
              <div>Summary: ${alert.description}</div>
            </div>
            <div style="margin-top:8px; text-align:right;">
              <a href="${alert.sourceUrl}" target="_blank" rel="noopener noreferrer" style="color:#61C7E7; font-size:11px; text-decoration:underline;">
                View UN OCHA / GDACS Report &rarr;
              </a>
            </div>
          </div>
        `;

        alertMarker.bindPopup(alertPopup);
        group.addLayer(alertMarker);
      });
    }

    // 6. USGS EARTHQUAKES (Seismic Network within 2500km)
    if (activeLayers.earthquakes && earthquakes.length > 0) {
      earthquakes.forEach((eq) => {
        const radius = Math.max(5, Math.min(16, eq.magnitude * 2.2));

        const quakeMarker = L.circleMarker([eq.coordinates[1], eq.coordinates[0]], {
          radius,
          color: "#E9B45A",
          fillColor: "#E9B45A",
          fillOpacity: 0.6,
          weight: 1.5,
        });

        const quakePopup = `
          <div style="background:#081522; color:#F1F7FC; padding:10px; border-radius:8px; font-family:'DM Sans', sans-serif; font-size:12px; border:1px solid #E9B45A; min-width:220px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="color:#E9B45A; font-size:13px;">🌐 USGS M ${eq.magnitude.toFixed(1)} Earthquake</strong>
              <span style="font-size:9px; font-family:monospace; background:#102538; color:#E9B45A; padding:2px 4px; border-radius:3px;">ANSS</span>
            </div>
            <div style="color:#A1B6C8; font-size:11px; margin-bottom:6px;">${eq.place}</div>
            <div style="border-top:1px solid #28445B; padding-top:6px; font-size:11px; color:#A1B6C8; line-height:1.4;">
              <div>Focal Depth: <strong style="color:#F1F7FC;">${eq.depthKm} km</strong></div>
              <div>Distance to Odisha: <strong style="color:#61C7E7;">~${eq.distanceKmToOdisha} km</strong></div>
              <div>Event Timestamp: <strong>${eq.formattedTime}</strong></div>
            </div>
            <div style="margin-top:6px; font-size:9px; color:#A1B6C8; font-style:italic;">
              Recorded observation. Does not claim future earthquake prediction.
            </div>
          </div>
        `;

        quakeMarker.bindPopup(quakePopup);
        group.addLayer(quakeMarker);
      });
    }

    // 7. CITIZEN INCIDENT REPORTS
    if (activeLayers.reports && reports.length > 0) {
      reports.forEach((rep) => {
        const isVerified = rep.status === "VERIFIED";
        const color = isVerified ? "#61C7E7" : "#E9B45A";

        const repMarker = L.circleMarker([rep.coordinates.lat, rep.coordinates.lng], {
          radius: 7,
          color,
          fillColor: color,
          fillOpacity: 0.85,
          weight: 2,
        });

        const repPopup = `
          <div style="background:#081522; color:#F1F7FC; padding:10px; border-radius:8px; font-family:'DM Sans', sans-serif; font-size:12px; border:1px solid ${color}; min-width:220px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="color:${color}; font-size:13px;">${rep.category}</strong>
              <span style="font-size:9px; font-family:monospace; background:#102538; color:${color}; padding:2px 4px; border-radius:3px;">
                ${isVerified ? 'VERIFIED REPORT' : 'UNVERIFIED CITIZEN REPORT'}
              </span>
            </div>
            <div style="color:#A1B6C8; font-size:11px; margin-bottom:4px;">Location: <strong>${rep.locationName}</strong></div>
            <p style="margin:4px 0; color:#F1F7FC; font-size:11px; line-height:1.4;">"${rep.description}"</p>
            <div style="border-top:1px solid #28445B; padding-top:4px; font-size:10px; color:#A1B6C8; display:flex; justify-content:space-between;">
              <span>Reported by: ${rep.reporterAlias}</span>
              <span>👍 ${rep.upvotes} Confirmations</span>
            </div>
          </div>
        `;

        repMarker.bindPopup(repPopup);
        group.addLayer(repMarker);
      });
    }
  }, [activeLayers, selectedDistrict, earthquakes, alerts, reports, weather, flood]);

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const filteredDistricts = useMemo(() => {
    if (!districtSearch) return ODISHA_DISTRICTS;
    return ODISHA_DISTRICTS.filter(d =>
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.headquarters.toLowerCase().includes(districtSearch.toLowerCase())
    );
  }, [districtSearch]);

  return (
    <div
      ref={mapContainerRef}
      className={`relative w-full h-full min-h-[440px] overflow-hidden border border-atmosphere-border bg-[#081522] ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "rounded-xl shadow-atmospheric"
      }`}
    >
      {/* Map DOM Element */}
      <div className="w-full h-full min-h-[440px] z-0" />

      {/* TOP CONTROLS BAR: Basemap Switcher & District Search */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Side: Basemap Switcher & District Jump */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Basemap Switcher */}
          <div className="glass-panel p-1 rounded-lg border border-atmosphere-border flex items-center gap-1 shadow-lg">
            <button
              onClick={() => setBasemap("osm")}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all flex items-center gap-1 ${
                currentBasemap === "osm"
                  ? "bg-atmosphere-ice text-atmosphere-bg font-bold shadow-sm"
                  : "text-atmosphere-muted hover:text-atmosphere-text"
              }`}
              title="OpenStreetMap Standard (Official High-Detail Roads, Rivers & Towns)"
            >
              <span>🗺️ Standard (OSM)</span>
            </button>

            <button
              onClick={() => setBasemap("dark")}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all flex items-center gap-1 ${
                currentBasemap === "dark"
                  ? "bg-atmosphere-ice text-atmosphere-bg font-bold shadow-sm"
                  : "text-atmosphere-muted hover:text-atmosphere-text"
              }`}
              title="Esri World Dark Gray Canvas (Atmospheric Night Mode)"
            >
              <span>🌙 Dark Canvas</span>
            </button>

            <button
              onClick={() => setBasemap("satellite")}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all flex items-center gap-1 ${
                currentBasemap === "satellite"
                  ? "bg-atmosphere-ice text-atmosphere-bg font-bold shadow-sm"
                  : "text-atmosphere-muted hover:text-atmosphere-text"
              }`}
              title="Esri World Imagery (Satellite Coastal Surge)"
            >
              <span>🛰️ Satellite</span>
            </button>
          </div>

          {/* District Quick Select */}
          <div className="glass-panel px-2.5 py-1 rounded-lg border border-atmosphere-border flex items-center gap-2 shadow-lg">
            <MapPin className="w-3.5 h-3.5 text-atmosphere-ice shrink-0" />
            <select
              value={selectedDistrict.id}
              onChange={(e) => {
                const d = ODISHA_DISTRICTS.find(x => x.id === e.target.value);
                if (d && onSelectDistrict) onSelectDistrict(d);
              }}
              className="bg-transparent text-atmosphere-text text-xs font-mono focus:outline-none cursor-pointer"
            >
              {ODISHA_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#081522] text-[#F1F7FC]">
                  {d.name} &bull; {d.headquarters}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Zoom, Fullscreen & Refresh */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg glass-panel border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice transition-all shadow-lg"
              title="Refresh Live GIS Feeds"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          )}

          <div className="glass-panel p-1 rounded-lg border border-atmosphere-border flex items-center gap-1 shadow-lg">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-7 h-7 rounded text-atmosphere-text hover:bg-atmosphere-surface flex items-center justify-center font-mono font-bold text-sm"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-7 h-7 rounded text-atmosphere-text hover:bg-atmosphere-surface flex items-center justify-center font-mono font-bold text-sm"
              title="Zoom Out"
            >
              &minus;
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg glass-panel border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-muted hover:text-atmosphere-ice transition-all shadow-lg"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* LAYER CONTROLS BAR: Left floating vertical/horizontal panel */}
      <div className="absolute top-16 left-3 z-10 glass-panel p-2 rounded-xl border border-atmosphere-border flex flex-wrap gap-1.5 shadow-lg max-w-[94%]">
        <span className="text-[11px] font-mono text-atmosphere-muted uppercase flex items-center gap-1 px-1 py-1">
          <Layers className="w-3.5 h-3.5 text-atmosphere-ice" />
          Layers:
        </span>

        <button
          onClick={() => toggleLayer("districts")}
          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
            activeLayers.districts
              ? "bg-atmosphere-ice/20 text-atmosphere-ice border border-atmosphere-ice/40"
              : "bg-atmosphere-surface text-atmosphere-muted/60 border border-atmosphere-border"
          }`}
        >
          Districts ({ODISHA_DISTRICTS.length})
        </button>

        <button
          onClick={() => toggleLayer("weather")}
          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
            activeLayers.weather
              ? "bg-atmosphere-ice/20 text-atmosphere-ice border border-atmosphere-ice/40"
              : "bg-atmosphere-surface text-atmosphere-muted/60 border border-atmosphere-border"
          }`}
        >
          <Wind className="w-3 h-3" />
          NWP Weather
        </button>

        <button
          onClick={() => toggleLayer("flood")}
          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
            activeLayers.flood
              ? "bg-atmosphere-teal/20 text-atmosphere-teal border border-atmosphere-teal/40"
              : "bg-atmosphere-surface text-atmosphere-muted/60 border border-atmosphere-border"
          }`}
        >
          <Waves className="w-3 h-3" />
          GloFAS Flow
        </button>

        <button
          onClick={() => toggleLayer("shelters")}
          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
            activeLayers.shelters
              ? "bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40"
              : "bg-atmosphere-surface text-atmosphere-muted/60 border border-atmosphere-border"
          }`}
        >
          <Shield className="w-3 h-3" />
          MPCS Shelters ({ODISHA_SHELTERS.length})
        </button>

        <button
          onClick={() => toggleLayer("alerts")}
          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
            activeLayers.alerts
              ? "bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe/40"
              : "bg-atmosphere-surface text-atmosphere-muted/60 border border-atmosphere-border"
          }`}
        >
          <AlertCircle className="w-3 h-3" />
          GDACS ({alerts.length})
        </button>

        <button
          onClick={() => toggleLayer("earthquakes")}
          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
            activeLayers.earthquakes
              ? "bg-atmosphere-warning/20 text-atmosphere-warning border border-atmosphere-warning/40"
              : "bg-atmosphere-surface text-atmosphere-muted/60 border border-atmosphere-border"
          }`}
        >
          <Waves className="w-3 h-3" />
          USGS Quakes ({earthquakes.length})
        </button>

        <button
          onClick={() => toggleLayer("reports")}
          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
            activeLayers.reports
              ? "bg-atmosphere-teal/20 text-atmosphere-teal border border-atmosphere-teal/40"
              : "bg-atmosphere-surface text-atmosphere-muted/60 border border-atmosphere-border"
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          Reports ({reports.length})
        </button>
      </div>

      {/* BOTTOM LEGEND & ATTRIBUTION CHIP */}
      <div className="absolute bottom-3 left-3 z-10 glass-panel px-3 py-2 rounded-xl border border-atmosphere-border text-[11px] font-mono text-atmosphere-muted flex flex-wrap items-center gap-4 max-w-[94%] shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-atmosphere-ice inline-block"></span>
          <span>{selectedDistrict.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-atmosphere-safe inline-block"></span>
          <span>MPCS Shelter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-atmosphere-severe inline-block"></span>
          <span>Hazard Alert</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-atmosphere-warning inline-block"></span>
          <span>USGS Seismic</span>
        </div>

        {alerts.length === 0 && (
          <span className="text-atmosphere-safe/90 font-sans text-[10px]">
            &bull; No active high-severity events in selected area
          </span>
        )}

        {lastUpdated && (
          <span className="text-atmosphere-muted/70 hidden sm:inline">
            &bull; Feeds Sync: {lastUpdated}
          </span>
        )}
      </div>
    </div>
  );
}
