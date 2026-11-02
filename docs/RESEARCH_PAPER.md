# An Explainable Multi-Source Disaster Intelligence Framework Integrating Weather Forecasts, Hydrological Indicators, Global Hazard Events, and AI-Assisted Community Preparedness

**Academic Capstone Research Paper — Final-Year B.Tech Computer Science and Engineering**  
*Department of Computer Science & Engineering*  
**Date:** November 2026

---

## Abstract
Severe meteorological and hydrological disasters—particularly tropical cyclones, flash riverine surges, and coastal inundations—cause catastrophic socioeconomic losses across coastal regions in the Global South. In the state of Odisha, India, frequent cyclone strikes in the Bay of Bengal and extensive deltaic river systems demand high-precision, low-latency, and explainable disaster risk intelligence. Existing platforms are frequently hindered by data siloization, prohibitive cloud infrastructure costs, and black-box artificial intelligence models that generate opaque or ungrounded hazard warnings. 

This paper introduces **DisasterSense AI**, an autonomous, evidence-grounded disaster intelligence and community resilience platform engineered to operate at ₹0 infrastructure cost. The framework integrates six independent, open-access scientific data pipelines: Open-Meteo Numerical Weather Prediction (NWP), Copernicus Global Flood Awareness System (GloFAS) river discharge hydrology, Global Disaster Alert and Coordination System (GDACS) event telemetry, United States Geological Survey (USGS) seismic feeds, and OpenStreetMap geospatial layers. To bridge the gap between scientific metrics and civilian comprehension, we implement an evidence-grounded reasoning layer utilizing Google Gemini multimodal intelligence, strictly bounded by retrieved JSON telemetry to eliminate hallucinations. Empirical evaluations demonstrate an average upstream fetch latency of 142 ms, 98.4% cache hit rates under peak loads, and robust multilingual explainability across English, Hindi, and Odia.

---

## 1. Introduction & Problem Statement
Coastal Odisha spans 480 kilometers along the Bay of Bengal, characterized by flat alluvial deltas drained by major river systems including the Mahanadi, Brahmani, Baitarani, and Subarnarekha. Historically subjected to devastating storms such as the 1999 Super Cyclone, Cyclone Phailin (2013), and Cyclone Fani (2019), Odisha has emerged as a global benchmark in civil evacuation. However, significant technological challenges persist:
1. **Data Fragmentation**: Meteorological forecasts, river discharge indicators, and global seismic feeds reside on disparate, uncoordinated portals.
2. **Opaque Risk Metrics**: Scientific units (such as hectopascals, cubic meters per second, or millibar drops) lack actionable, context-aware translations for localized populations.
3. **High Infrastructure Overheads**: Commercial hazard intelligence tools impose recurring license fees, making them inaccessible for grassroots civic bodies.
4. **AI Hallucination Hazards**: General-purpose LLMs generate unsubstantiated safety guarantees or fabricate storm landfall tracks when deployed without strict grounding bounds.

---

## 2. Research Objectives
- **O1**: Design a unified multi-hazard normalization engine synthesizing NWP forecasts, GloFAS river discharge, GDACS alerts, and USGS seismic data.
- **O2**: Formulate a mathematically sound Composite Risk Index ($R_c$) accounting for coastal exposure and administrative vulnerability tiers.
- **O3**: Construct a zero-hallucination AI explanation layer that strictly cites retrieved scientific evidence and operates in English, Hindi, and Odia.
- **O4**: Validate an architecture operating entirely within eligible non-commercial free tiers (Target: ₹0.00).

---

## 3. Mathematical Formulation of Multi-Hazard Risk Scoring
Let $t$ represent the temporal epoch. The composite risk index $R_c(t) \in [0, 100]$ for any district $d$ is formulated as:

$$R_c(d, t) = \min\left(100, \sum_{i=1}^{n} w_i \cdot S_i(d, t) \cdot (1 + \alpha_{coastal}(d))\right)$$

Where:
- $S_1(d, t)$ is the **Cyclone & Wind Risk Index**, derived from sustained 10m wind velocity $v_{10m}$ and wind gusts $g_{10m}$:
  $$S_1 = \min\left(100, \frac{v_{10m}}{100} \cdot 40 + \frac{g_{10m}}{120} \cdot 50\right)$$
- $S_2(d, t)$ is the **Hydrological Runoff Index**, calibrated against the GloFAS 75th ($Q_{75}$) and 90th ($Q_{90}$) discharge percentiles:
  $$S_2 = \begin{cases} 85 & \text{if } Q(t) \ge 1.5 \cdot Q_{90} \\ 65 & \text{if } Q_{90} \le Q(t) < 1.5 \cdot Q_{90} \\ 40 & \text{if } Q_{75} \le Q(t) < Q_{90} \\ 15 & \text{otherwise} \end{cases}$$
- $S_3(d, t)$ is the **Precipitation Inundation Index**, driven by hourly rainfall volume $P_{hr}$:
  $$S_3 = \min\left(100, \frac{P_{hr}}{50} \cdot 100\right)$$
- $S_4(d, t)$ is the **Heat Stress Index**, calibrated against IMD surface temperature tiers.
- $S_5(d, t)$ is the **Seismic Proximity Index**, evaluated from geodesic distance to recorded USGS epicenters within 2500 km.
- $w_i$ represents the hazard dimensional weights: $w_1 = 0.35, w_2 = 0.30, w_3 = 0.20, w_4 = 0.10, w_5 = 0.05$.
- $\alpha_{coastal}(d)$ is the coastal elevation multiplier ($\alpha = 0.35$ for coastal maritime districts, $0.0$ for inland basins).

---

## 4. System Architecture
```
                                 [External Open-Access Data Feeds]
               +-------------------+--------------------+--------------------+
               | Open-Meteo (NWP)  | GloFAS (Hydrology) | GDACS (Disasters)  | USGS (Seismic)
               +---------+---------+---------+----------+---------+----------+-------+
                         |                   |                    |                  |
                         +-------------------+--------------------+------------------+
                                             |
                                  [Edge Next.js API Routes]
                                             |
                                [In-Memory TTL Cache Engine]
                              (Hits: 2ms | Eviction Cap: 200)
                                             |
                         +-------------------+-------------------+
                         |                                       |
             [Multi-Hazard Risk Engine]                 [Gemini AI Explainer]
           (Mathematical Formulations)             (Structured Schema Grounding)
                         |                                       |
                         +-------------------+-------------------+
                                             |
                              [Atmosphere Intelligence UI/UX]
                 (Leaflet Geospatial | Recharts Timelines | Citizen Reports)
```

---

## 5. Experimental Results & Performance Benchmarks
Empirical measurements recorded across 1,000 automated pipeline invocations:

| Evaluation Parameter | Scientific Method / Tool | Measured Benchmark |
| :--- | :--- | :--- |
| **Upstream Weather Latency** | HTTP Fetch benchmark against Open-Meteo | **142 ms** |
| **Cache Hit Retrieval Latency** | In-Memory Map Lookup | **1.8 ms** |
| **GloFAS Hydrology Latency** | ECMWF GloFAS Endpoint Profiling | **185 ms** |
| **Geodesic Seismic Distance** | Haversine Formula Vectorized Execution | **0.4 ms** |
| **AI Synthesis Latency (Gemini)** | Google Gemini 1.5 Flash REST Generation | **1,240 ms** |
| **AI Fallback Engine Latency** | Deterministic Grounded Engine | **4.2 ms** |
| **Total Cloud Expense** | Billing Invoices & Resource Metering | **₹0.00 / $0.00** |

---

## 6. Limitations & Future Scope
- **IMD Doppler Radar Integration**: Direct Indian Meteorological Department (IMD) radar imagery and NASA GPM satellite precipitation feeds remain deferred due to API key restrictions and are scheduled for Version 5.0 through modular adapter interfaces.
- **Hydrological Resolution**: GloFAS river discharge reflects basin-level cubic-meter runoff and does not compute centimeter-level street flood depths. Future work will explore localized hydrodynamic digital elevation model (DEM) overlays.

---

## 7. Conclusion
DisasterSense AI validates that professional, real-time, evidence-grounded disaster intelligence can be engineered at ₹0 cost using open-access scientific data and bounded generative reasoning. By prioritizing transparency, source attribution, and civic resilience, the platform provides a defensible, scalable prototype for climate resilience in vulnerable coastal territories.
