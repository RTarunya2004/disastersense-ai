"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setLoggedIn(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel-elevated p-8 rounded-2xl border border-atmosphere-border shadow-atmospheric text-center">
        <div className="w-12 h-12 rounded-xl bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-ice mx-auto mb-4 shadow-glow">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-bold font-heading text-atmosphere-text mb-2">DisasterSense Sign In</h1>
        <p className="text-xs text-atmosphere-muted mb-6">
          Access saved emergency locations, custom SMS alert thresholds, and community reporting keys.
        </p>

        {loggedIn ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-atmosphere-safe/20 border border-atmosphere-safe/40 text-atmosphere-safe text-xs font-mono">
              Successfully authenticated session as <strong>{email}</strong>
            </div>
            <Link
              href="/dashboard"
              className="w-full py-2.5 rounded-lg bg-atmosphere-ice text-atmosphere-bg font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <span>Proceed to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-mono text-atmosphere-muted block mb-1">Official / Resident Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-atmosphere-muted" />
                <input
                  type="email"
                  required
                  placeholder="resident@disastersense.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-atmosphere-muted block mb-1">Security Credential / Passcode</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-atmosphere-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-atmosphere-ice to-atmosphere-teal text-atmosphere-bg font-bold text-xs hover:opacity-90 transition-all shadow-glow mt-4"
            >
              Sign In to Civic Portal
            </button>

            <p className="text-[11px] text-center text-atmosphere-muted/70 font-mono mt-4">
              Public weather and shelter feeds remain accessible without sign in.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
