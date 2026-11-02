"use client";

import { ShieldCheck, PhoneCall, AlertTriangle, CheckSquare, Download, Info } from "lucide-react";

export default function PreparednessPage() {
  const cycloneKitItems = [
    "Battery-powered portable radio with extra dry-cell batteries",
    "High-lumen waterproof LED torches / lanterns",
    "Minimum 10 liters of sealed potable water per family member (3-day supply)",
    "Non-perishable food rations (Chuda/Poha, Gur/Jaggery, biscuits, dry fruits)",
    "Waterproof pouch with Aadhaar cards, land records, insurance, and medical files",
    "First aid kit: antiseptic lotions, band-aids, ORS packets, personal prescription medicines",
    "Fully charged mobile phone power banks (20,000 mAh recommended)",
    "Cash in small denominations (ATMs and UPI cease during power grid shutdowns)"
  ];

  const officialContacts = [
    { title: "Odisha State Disaster Management Authority (OSDMA)", number: "0674-2395398 / 2395531", badge: "State HQ" },
    { title: "State Emergency Operation Centre (SEOC) Toll-Free", number: "1070", badge: "Toll-Free 24/7" },
    { title: "District Emergency Operation Centre (DEOC)", number: "1077", badge: "District Level" },
    { title: "Odisha Disaster Rapid Action Force (ODRAF)", number: "0674-2534177", badge: "Search & Rescue" },
    { title: "National Disaster Response Force (NDRF 03 Bn Mundali)", number: "0671-2879710", badge: "Federal Rescue" },
    { title: "Integrated Emergency Services (Police, Fire, Ambulance)", number: "112", badge: "Emergency Hub" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-atmosphere-border">
        <h1 className="text-2xl font-bold font-heading text-atmosphere-text">
          Community Safety & Disaster Preparedness Directives
        </h1>
        <p className="text-xs font-mono text-atmosphere-muted">
          Grounded Civic Readiness &bull; Pre-Landfall Evacuation Protocols &bull; OSDMA Aligned Guidelines
        </p>
      </div>

      {/* Emergency Directory Contacts Card */}
      <div className="glass-panel-elevated rounded-2xl p-6 border border-atmosphere-border">
        <h2 className="text-base font-bold font-heading text-atmosphere-text mb-4 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-atmosphere-safe" />
          Statutory Emergency Hotlines & Rescue Control Rooms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {officialContacts.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-atmosphere-surface border border-atmosphere-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40 uppercase mb-2 inline-block">
                  {c.badge}
                </span>
                <h3 className="text-xs font-bold text-atmosphere-text mb-1">{c.title}</h3>
              </div>
              <a
                href={`tel:${c.number.replace(/[^0-9]/g, '')}`}
                className="text-base font-bold font-mono text-atmosphere-ice hover:underline mt-2 block"
              >
                {c.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 72-Hour Evacuation Kit Checklist */}
      <div className="glass-panel rounded-2xl p-6 border border-atmosphere-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-atmosphere-border/60 mb-6">
          <div>
            <h2 className="text-base font-bold font-heading text-atmosphere-text flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-atmosphere-ice" />
              72-Hour Cyclone & Flood Survival Evacuation Kit
            </h2>
            <p className="text-xs font-mono text-atmosphere-muted">
              Standard civil defense kit for coastal and riverine families
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-atmosphere-surface border border-atmosphere-border text-atmosphere-ice hover:border-atmosphere-ice text-xs font-semibold font-mono flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Print Checklist</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cycloneKitItems.map((item, idx) => (
            <label
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-atmosphere-surface/60 border border-atmosphere-border/60 cursor-pointer hover:bg-atmosphere-surface transition-colors"
            >
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-atmosphere-border text-atmosphere-ice focus:ring-0 bg-atmosphere-bg cursor-pointer"
              />
              <span className="text-xs text-atmosphere-text leading-relaxed">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Guidelines by Hazard Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-atmosphere-border">
          <div className="w-10 h-10 rounded-lg bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-ice mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold font-heading text-atmosphere-text mb-2">During Cyclone Landfall</h3>
          <ul className="text-xs text-atmosphere-muted space-y-1.5 list-disc list-inside">
            <li>Remain indoors in the strongest reinforced room.</li>
            <li>Do not venture out during the calm "eye" passage; winds reverse violently.</li>
            <li>Switch off main electrical circuit breaker and LPG gas valves.</li>
            <li>Stay away from glass windows and loose tin roofs.</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-atmosphere-border">
          <div className="w-10 h-10 rounded-lg bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-teal mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold font-heading text-atmosphere-text mb-2">During Riverine Flooding</h3>
          <ul className="text-xs text-atmosphere-muted space-y-1.5 list-disc list-inside">
            <li>Do not attempt to wade or drive across flooded roads (just 15cm of moving water can sweep cars).</li>
            <li>Move livestock to designated high-elevation cattle mounds.</li>
            <li>Boil all drinking water for minimum 10 minutes to prevent cholera.</li>
            <li>Watch for venomous snakes seeking dry high grounds.</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-atmosphere-border">
          <div className="w-10 h-10 rounded-lg bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-warning mb-3">
            <Info className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold font-heading text-atmosphere-text mb-2">Extreme Heatwaves</h3>
          <ul className="text-xs text-atmosphere-muted space-y-1.5 list-disc list-inside">
            <li>Avoid outdoor direct sun exposure between 11:00 AM and 3:30 PM.</li>
            <li>Drink traditional hydration solutions (Torani, Nimbu Pani, ORS, coconut water).</li>
            <li>Wear loose, light-colored cotton garments.</li>
            <li>Never leave children or pets inside stationary vehicles.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
