"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { ODISHA_SHELTERS } from "@/data/odishaShelters";
import { UsgsEarthquake, GdacsAlert, CommunityReport, OdishaDistrict } from "@/types";
import { Layers, Shield, AlertCircle, Droplets, Waves, CheckCircle2 } from "lucide-react";

interface MapProps {
  selectedDistrict: OdishaDistrict;
  onSelectDistrict?: (d: OdishaDistrict) => void;
  earthquakes?: UsgsEarthquake[];
  alerts?: GdacsAlert[];
  reports?: CommunityReport[];
  centerLat?: number;
  centerLng?: number;
  zoomLevel?: number;
}

export default function MapComponent({
  selectedDistrict,
  onSelectDistrict,
  earthquakes = [],
  alerts = [],
  reports = [],
  centerLat,
  centerLng,
  zoomLevel = 7.5,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    districts: true,
    shelters: true,
    earthquakes: true,
    alerts: true,
    reports: true,
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat || selectedDistrict.coordinates.lat, centerLng || selectedDistrict.coordinates.lng],
        zoom: zoomLevel,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark Matter tiles (Free, dark atmospheric theme matching #081522)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
        subdomains: "abcd",
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: "bottomright" })
        .addAttribution('&copy; <a href="https://openstreetmap.org" target="_blank" class="text-atmosphere-ice">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/" target="_blank">CARTO</a>')
        .addTo(map);

      // Zoom Control in top right
      L.control.zoom({ position: "topright" }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Don't necessarily destroy on every render, cleanup handled on unmount
    };
  }, []);

  // Pan to selected district if coordinates change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [centerLat || selectedDistrict.coordinates.lat, centerLng || selectedDistrict.coordinates.lng],
        centerLat ? zoomLevel : 8.5,
        { animate: true }
      );
    }
  }, [selectedDistrict, centerLat, centerLng, zoomLevel]);

  // Re-render layer markers when state or activeLayers change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const group = layerGroupRef.current;
    group.clearLayers();

    // 1. District Markers & Boundary Emulation Circles
    if (activeLayers.districts) {
      ODISHA_DISTRICTS.forEach((d) => {
        const isCurrent = d.id === selectedDistrict.id;
        const radius = isCurrent ? 28000 : 15000;

        const circle = L.circle([d.coordinates.lat, d.coordinates.lng], {
          radius,
          color: isCurrent ? "#61C7E7" : d.isCoastal ? "#47C8C1" : "#28445B",
          fillColor: isCurrent ? "#61C7E7" : d.isCoastal ? "#47C8C1" : "#102538",
          fillOpacity: isCurrent ? 0.35 : 0.15,
          weight: isCurrent ? 2 : 1,
        });

        circle.bindPopup(`
          <div style="background:#102538; color:#F1F7FC; padding:8px; border-radius:6px; font-family:sans-serif; font-size:12px; border:1px solid #28445B;">
            <strong style="color:#61C7E7; font-size:14px;">${d.name}</strong><br/>
            <span>Odia: ${d.nameOdia}</span><br/>
            <span>Type: ${d.isCoastal ? "Coastal District (Vulnerable)" : "Inland District"}</span><br/>
            <span>Vulnerability: <strong>${d.vulnerabilityTier}</strong></span><br/>
            <span>Population: ${d.populationEst}</span>
          </div>
        `);

        circle.on("click", () => {
          if (onSelectDistrict) onSelectDistrict(d);
        });

        group.addLayer(circle);
      });
    }

    // 2. Verified Shelters
    if (activeLayers.shelters) {
      ODISHA_SHELTERS.forEach((s) => {
        const shelterMarker = L.circleMarker([s.coordinates.lat, s.coordinates.lng], {
          radius: 6,
          color: "#5AC49E",
          fillColor: "#5AC49E",
          fillOpacity: 0.8,
          weight: 1.5,
        });

        shelterMarker.bindPopup(`
          <div style="background:#102538; color:#F1F7FC; padding:8px; border-radius:6px; font-family:sans-serif; font-size:12px; border:1px solid #5AC49E;">
            <span style="color:#5AC49E; font-weight:bold;">🛡️ ${s.name}</span><br/>
            <span>District: ${s.district} (Block: ${s.block})</span><br/>
            <span>Capacity: <strong>${s.capacity} persons</strong></span><br/>
            <span>Generator: ${s.backupGenerator ? 'Available' : 'None'} | Water: ${s.potableWater ? 'Yes' : 'No'}</span><br/>
            <span>Contact: ${s.contactNumber}</span>
          </div>
        `);
        group.addLayer(shelterMarker);
      });
    }

    // 3. GDACS Disaster Alerts
    if (activeLayers.alerts && alerts.length > 0) {
      alerts.forEach((alert) => {
        const color = alert.alertLevel === "Red" ? "#E76B70" : alert.alertLevel === "Orange" ? "#E9B45A" : "#5AC49E";
        const marker = L.circleMarker([alert.coordinates[0], alert.coordinates[1]], {
          radius: 9,
          color,
          fillColor: color,
          fillOpacity: 0.7,
          weight: 2,
        });

        marker.bindPopup(`
          <div style="background:#102538; color:#F1F7FC; padding:8px; border-radius:6px; font-family:sans-serif; font-size:12px; border:1px solid ${color};">
            <strong style="color:${color};">GDACS Alert: ${alert.eventName}</strong><br/>
            <span>Severity: ${alert.severity}</span><br/>
            <span>Level: <strong>${alert.alertLevel}</strong></span><br/>
            <span>Region: ${alert.country}</span>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 4. USGS Earthquakes
    if (activeLayers.earthquakes && earthquakes.length > 0) {
      earthquakes.forEach((eq) => {
        const radius = Math.max(5, Math.min(18, eq.magnitude * 2.5));
        const marker = L.circleMarker([eq.coordinates[1], eq.coordinates[0]], {
          radius,
          color: "#E9B45A",
          fillColor: "#E9B45A",
          fillOpacity: 0.6,
          weight: 1.5,
        });

        marker.bindPopup(`
          <div style="background:#102538; color:#F1F7FC; padding:8px; border-radius:6px; font-family:sans-serif; font-size:12px; border:1px solid #E9B45A;">
            <strong style="color:#E9B45A;">USGS M ${eq.magnitude.toFixed(1)} Earthquake</strong><br/>
            <span>Place: ${eq.place}</span><br/>
            <span>Depth: ${eq.depthKm} km</span><br/>
            <span>Distance to Odisha: <strong>~${eq.distanceKmToOdisha} km</strong></span><br/>
            <span style="font-size:10px; color:#A1B6C8;">Time: ${eq.formattedTime}</span>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 5. Citizen Reports
    if (activeLayers.reports && reports.length > 0) {
      reports.forEach((rep) => {
        const isVerified = rep.status === "VERIFIED";
        const color = isVerified ? "#61C7E7" : "#A1B6C8";

        const repMarker = L.circleMarker([rep.coordinates.lat, rep.coordinates.lng], {
          radius: 7,
          color,
          fillColor: color,
          fillOpacity: 0.9,
          weight: 2,
        });

        repMarker.bindPopup(`
          <div style="background:#102538; color:#F1F7FC; padding:8px; border-radius:6px; font-family:sans-serif; font-size:12px; border:1px solid ${color};">
            <strong style="color:${color};">Citizen Incident: ${rep.category}</strong><br/>
            <span>Location: ${rep.locationName}</span><br/>
            <span>Status: <strong>${rep.status}</strong></span><br/>
            <span>"${rep.description}"</span><br/>
            <span style="font-size:10px; color:#A1B6C8;">Reported by: ${rep.reporterAlias}</span>
          </div>
        `);
        group.addLayer(repMarker);
      });
    }
  }, [activeLayers, selectedDistrict, earthquakes, alerts, reports]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-atmosphere-border bg-atmosphere-surface shadow-atmospheric">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-0" />

      {/* Layer Control Bar Overlay */}
      <div className="absolute top-3 left-3 z-10 glass-panel p-2 rounded-lg border border-atmosphere-border flex flex-wrap gap-1.5 shadow-lg max-w-[95%]">
        <span className="text-[11px] font-mono text-atmosphere-muted uppercase flex items-center gap-1 px-1.5 py-1">
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
          Districts
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
          Shelters
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
          GDACS
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
          USGS Quakes
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
          Reports
        </button>
      </div>

      {/* Map Legend Footer */}
      <div className="absolute bottom-2 left-2 z-10 glass-panel px-3 py-1.5 rounded-md border border-atmosphere-border text-[11px] font-mono text-atmosphere-muted flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-atmosphere-ice inline-block"></span> Current District
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-atmosphere-safe inline-block"></span> Shelter (MPCS)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-atmosphere-severe inline-block"></span> Hazard Event
        </span>
      </div>
    </div>
  );
}
