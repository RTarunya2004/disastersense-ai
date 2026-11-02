"use client";

import { User, Phone, MapPin, Bell, Shield, Heart } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-atmosphere-border">
        <h1 className="text-2xl font-bold font-heading text-atmosphere-text">Resident Profile & Family Safety Network</h1>
        <p className="text-xs font-mono text-atmosphere-muted">Manage household emergency contacts, priority district, and alert dispatch channels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-atmosphere-border text-center">
          <div className="w-20 h-20 rounded-full bg-atmosphere-surface border-2 border-atmosphere-ice flex items-center justify-center text-atmosphere-ice mx-auto mb-4">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-base font-bold font-heading text-atmosphere-text">Soumya Ranjan Mohapatra</h2>
          <p className="text-xs font-mono text-atmosphere-teal mt-0.5">Civil Defense Volunteer</p>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40 mt-3 inline-block">
            Verified Resident
          </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-atmosphere-border md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold font-heading text-atmosphere-text flex items-center gap-2">
            <Shield className="w-4 h-4 text-atmosphere-ice" />
            Household Emergency Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border">
              <span className="text-atmosphere-muted block mb-1">PRIMARY DISTRICT</span>
              <span className="text-atmosphere-text font-bold">Khordha (Bhubaneswar)</span>
            </div>
            <div className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border">
              <span className="text-atmosphere-muted block mb-1">MUNICIPAL WARD</span>
              <span className="text-atmosphere-text font-bold">BMC Ward 28 (Nayapalli)</span>
            </div>
            <div className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border">
              <span className="text-atmosphere-muted block mb-1">EMERGENCY SMS NUMBER</span>
              <span className="text-atmosphere-text font-bold">+91-94371-XXXXX</span>
            </div>
            <div className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border">
              <span className="text-atmosphere-muted block mb-1">CLOSEST DESIGNATED SHELTER</span>
              <span className="text-atmosphere-safe font-bold">Balianta MPCS (3.4 km)</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-mono text-atmosphere-muted uppercase tracking-wider block mb-2">
              Family Dependents
            </span>
            <div className="p-3 rounded-xl bg-atmosphere-surface border border-atmosphere-border text-xs text-atmosphere-text flex items-center justify-between">
              <div>
                <span className="font-bold">4 Family Members (Includes 1 Senior Citizen &bull; Special Evacuation Flagged)</span>
              </div>
              <span className="text-[10px] font-mono text-atmosphere-warning bg-atmosphere-warning/20 px-2 py-0.5 rounded">
                High Priority
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
