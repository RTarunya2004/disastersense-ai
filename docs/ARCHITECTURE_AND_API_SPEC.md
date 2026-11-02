# DISASTERSENSE AI — ARCHITECTURE & API SPECIFICATION

## 1. REST API Specification

### 1.1 Weather Endpoint
- **URL**: `/api/weather`
- **Method**: `GET`
- **Query Parameters**:
  - `lat` (float, required): Latitude (e.g., `20.2961`)
  - `lng` (float, required): Longitude (e.g., `85.8245`)
  - `district` (string, optional): District Name
- **Response Format**: `WeatherData` JSON
- **Cache Policy**: 10 minutes (600,000 ms) TTL
- **Upstream**: Open-Meteo Operational NWP

### 1.2 Flood & Hydrology Endpoint
- **URL**: `/api/flood`
- **Method**: `GET`
- **Query Parameters**: `lat`, `lng`, `district`
- **Response Format**: `FloodData` JSON
- **Hydrological Indicators**: `riverDischargeM3s`, `flowThresholdStatus` (`NORMAL`, `ELEVATED`, `HIGH`, `CRITICAL`), `dischargePercentile`
- **Scientific Disclosure**: Explicit disclaimer on street-level depth non-applicability.
- **Cache Policy**: 60 minutes (3,600,000 ms) TTL
- **Upstream**: Copernicus Global Flood Awareness System (GloFAS v4.0)

### 1.3 GDACS Global Alerts
- **URL**: `/api/gdacs`
- **Method**: `GET`
- **Response Format**: Array of `GdacsAlert` objects
- **Event Filtering**: `TC` (Tropical Cyclones), `FL` (Floods), `EQ` (Earthquakes)
- **Cache Policy**: 15 minutes TTL

### 1.4 USGS Seismic Network
- **URL**: `/api/earthquakes`
- **Method**: `GET`
- **Geographic Bounds**: 2500 km radius around Odisha Geographic Center (`20.2961, 85.8245`)
- **Metric Calculations**: In-memory Haversine distance to Odisha center in kilometers
- **Disclaimer**: Historical & observed telemetry only. No exact future earthquake prediction claimed.

### 1.5 Multi-Hazard Risk Assessment
- **URL**: `/api/risk-assessment`
- **Method**: `GET`
- **Query Parameters**: `districtId` (e.g., `khordha`, `cuttack`, `puri`)
- **Response Format**: `MultiHazardAssessment` JSON
- **Computed Indicators**: Composite Risk Score (0-100), Hazard Level (`SAFE`, `ADVISORY`, `WATCH`, `WARNING`, `EMERGENCY`), Risk Dimension Breakdown, Evidence Citations.

### 1.6 Grounded Gemini Assistant
- **URL**: `/api/assistant`
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "query": "string",
    "district": "string",
    "language": "en" | "hi" | "or"
  }
  ```
- **Response Schema**:
  ```json
  {
    "summary": "string",
    "riskLevel": "string",
    "evidenceCited": ["string"],
    "preparednessChecklist": ["string"],
    "emergencyContacts": ["string"],
    "officialDisclaimer": "string"
  }
  ```
- **Fallback Behavior**: High-fidelity deterministic grounded engine when `GEMINI_API_KEY` is not present or quota is exhausted.

---

## 2. Component Hierarchy
```
RootLayout (/layout.tsx)
├── Navigation (/components/Navigation.tsx)
│   ├── Desktop Header & Brand Radar
│   ├── Quick Links
│   ├── Mobile Bottom Bar
│   └── Mobile Drawer
├── Route Page Handlers
│   ├── / — LandingPage
│   ├── /dashboard — DashboardPage (3-Pane Atmosphere Console)
│   ├── /map — MapPage (Full-Screen Geospatial Monitor)
│   │   └── DynamicMap (/components/DynamicMap.tsx)
│   │       └── MapComponent (/components/MapComponent.tsx - Leaflet)
│   ├── /forecast — ForecastPage (Recharts 24h & 7d)
│   ├── /hazards — HazardsPage (Risk Synthesis Matrix)
│   ├── /districts — DistrictsPage (30 Odisha Districts)
│   ├── /events — EventsPage (GDACS & USGS)
│   ├── /assistant — AssistantPage (Gemini Explainer)
│   ├── /preparedness — PreparednessPage (Safety Directives & Checklist)
│   ├── /shelters — SheltersPage (Verified MPCS Cadastre)
│   ├── /reports — ReportsPage (Citizen Incident Triage)
│   ├── /sources — SourcesPage (Transparency & SLA Health)
│   ├── /about — AboutPage (Academic Capstone Dossier)
│   ├── /login, /profile, /saved-locations, /settings
│   └── /admin, /admin/reports, /admin/sources, /admin/system-health
└── Footer
```
