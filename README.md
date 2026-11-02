# DisasterSense AI 🌪️🌊
**Real-Time Disaster Risk Intelligence & Community Resilience Platform**  
*Final-Year B.Tech Computer Science & Engineering Capstone Project — 2026*  
*Odisha-First Geographic Scope (All 30 Districts Modeled)*

---

## 🛰️ Executive Overview
DisasterSense AI is an evidence-grounded multi-source disaster intelligence platform designed to address the severe cyclone, flooding, and climate risks confronting the state of Odisha, India. 

Rather than functioning as a generic weather dashboard or a black-box machine-learning model, DisasterSense AI unifies six independent open-access scientific pipelines into a transparent, explainable resilience system:
- **Numerical Weather Prediction (NWP)**: Open-Meteo operational models (ECMWF & GFS) for hourly precipitation, wind velocity, and surface temperature.
- **Hydrological River Discharge**: Copernicus Global Flood Awareness System (GloFAS v4.0) for basin runoff volume and threshold tracking.
- **Global Disaster Monitoring**: United Nations OCHA / European Commission JRC (GDACS) for tropical cyclone and flood alerts.
- **Regional Seismology**: United States Geological Survey (USGS) ANSS real-time network for Bay of Bengal and Andaman plate telemetry.
- **Evidence-Grounded AI Explainer**: Google Gemini 1.5 Flash synthesizing structured citizen guidance in English, Hindi, and Odia.
- **Resilience Cadastre**: Official OSDMA Multipurpose Cyclone Shelter (MPCS) mapping and citizen crowdsourced hazard reporting.

---

## 💎 Core Architecture & ₹0 Cost Strategy
The platform is designed to operate on a strict ₹0.00 infrastructure budget:
- **Zero Paid APIs**: Ingests exclusively eligible non-commercial and public-domain feeds.
- **Server-Side TTL Caching**: In-memory FIFO cache throttles upstream calls (10 min for weather, 60 min for flood, 15 min for GDACS/USGS).
- **High-Fidelity Deterministic Fallback**: In the absence of an API key or upon quota exhaustion, the grounded rule synthesis engine serves full guidance with zero downtime.
- **Vercel Hobby Tier Compatible**: Serverless edge architecture ready for zero-cost deployment.

---

## 🗺️ Odisha-First District Coverage
Full telemetry models are established for all 30 districts of Odisha:
- **High Vulnerability Coastal Belt**: Khordha (Bhubaneswar), Cuttack, Puri, Balasore, Kendrapara, Jagatsinghpur, Ganjam, Bhadrak.
- **Major Inland River Basins**: Sambalpur, Mayurbhanj, Jajpur, Angul, Dhenkanal, Koraput, Kalahandi, Rayagada, Malkangiri, Subarnapur, Bolangir, Bargarh, Jharsuguda, Sundargarh, Keonjhar, Kandhamal, Boudh, Nuapada, Gajapati, Deogarh, Nabarangpur.

---

## 🚀 Quickstart Local Execution

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm 9+ or 11+

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/your-username/disastersense-ai.git
cd disastersense-ai

# Install dependencies
npm install

# Configure local environment variables
cp .env.example .env.local
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification
```bash
# Verify TypeScript Type Check
npx tsc --noEmit

# Production Build
npm run build
```

---

## 📜 Scientific Disclaimers
1. **Model Forecasts vs. Statutory Directives**: DisasterSense AI provides informational synthesis from numerical simulations. It does not supersede statutory evacuation orders issued by the Odisha State Disaster Management Authority (OSDMA) or the India Meteorological Department (IMD).
2. **Hydrological River Discharge**: GloFAS discharge forecasts indicate catchment runoff volume ($m^3/s$) and do not establish street-level water depth or neighborhood inundation.
3. **Seismic Telemetry**: USGS earthquake data represents recorded observations. The system makes no claim of exact future earthquake prediction.

---

## 📄 License & Attribution
- Open-Meteo data under Open-Meteo Non-Commercial Terms.
- Copernicus GloFAS data courtesy of the European Commission.
- GDACS data courtesy of UN OCHA & EC-JRC.
- USGS data courtesy of the U.S. Geological Survey.
- Map tiles &copy; OpenStreetMap contributors, &copy; CARTO.
