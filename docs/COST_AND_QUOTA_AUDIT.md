# DISASTERSENSE AI — COST AND QUOTA AUDIT
**Target Operational Budget: ₹0.00 / $0.00 (Zero Paid Services)**
**Date of Audit:** November 2026

---

## 1. Executive Summary
DisasterSense AI has been engineered strictly to operate within eligible free tiers of all upstream data providers, hosting environments, and artificial intelligence APIs. No billable credit cards or paid cloud commitments are required to deploy, execute, or maintain the platform.

| Service / Provider | Role | Free-Tier Quota & Allowances | DisasterSense Strategy | Actual Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Google Gemini API** | AI Explainer & Multilingual Reasoning | 15 RPM / 1,500 RPD on `gemini-1.5-flash` | Strict request budgeting, 24-hr cache for identical queries, deterministic fallback engine | **₹0.00** |
| **Open-Meteo Weather API** | Hourly NWP Forecasts & Telemetry | Up to 10,000 daily API calls for non-commercial open-access | 10-minute in-memory TTL cache across 30 districts (~4,320 requests/day max) | **₹0.00** |
| **Open-Meteo Flood (GloFAS)** | River Discharge Hydrology | Up to 10,000 daily calls | 60-minute in-memory TTL cache (~720 requests/day max) | **₹0.00** |
| **GDACS (UN OCHA / EC-JRC)** | Global Disaster Event Alerts | Public Open Data REST / RSS feeds | 15-minute global TTL cache (~96 requests/day) | **₹0.00** |
| **USGS Earthquake Hazards** | Regional Seismic Network | Public Domain US Government Data | 15-minute regional TTL cache (~96 requests/day) | **₹0.00** |
| **OpenStreetMap & CartoDB** | Cartographic Dark Map Tiles | Free web tile usage under fair usage guidelines | Browser client caching with proper attribution headers | **₹0.00** |
| **Vercel** | Serverless Edge Hosting & Next.js Runtime | Vercel Hobby Tier (100 GB bandwidth, unlimited serverless functions within hobby limits) | Edge caching, static asset compression, zero build workers | **₹0.00** |

---

## 2. In-Memory Cache & Rate Limiting Architecture
To safeguard against upstream rate limit exhaustion and sudden denial-of-service, DisasterSense AI incorporates an internal FIFO memory cache (`src/lib/cache.ts`):
1. **Dynamic Expiration**: Every entry is tagged with an absolute millisecond timestamp (`expiresAt`).
2. **Cap on RAM Footprint**: A hard limit of 200 concurrent active entries is maintained in serverless RAM to prevent memory leaks during long-running invocations.
3. **Telemetry Tracking**: The system actively records hits, misses, evictions, and calculates live hit rates displayed in the `/admin/system-health` console.

---

## 3. High-Fidelity Fallback Protocol (Zero-Quota Mode)
If `GEMINI_API_KEY` is not supplied or if upstream Google Cloud quotas are reached:
1. The assistant gracefully steps down to the **DisasterSense Grounded Rule Synthesizer**.
2. It constructs structured, evidence-grounded responses in English, Hindi, and Odia directly from retrieved Open-Meteo and GloFAS numerical data.
3. No user request ever receives a raw 500 error, ensuring 100% service availability with zero downtime and ₹0 expenditure.
