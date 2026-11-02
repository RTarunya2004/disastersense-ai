"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  CloudRain,
  AlertTriangle,
  Bot,
  ShieldCheck,
  Building2,
  FileText,
  Database,
  Info,
  Menu,
  X,
  Compass,
  History,
  Activity,
  Sliders
} from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Interactive Map", href: "/map", icon: Map },
    { label: "Forecast Timeline", href: "/forecast", icon: CloudRain },
    { label: "Hazard Matrix", href: "/hazards", icon: AlertTriangle },
    { label: "Odisha Districts", href: "/districts", icon: Compass },
    { label: "Event History", href: "/events", icon: History },
    { label: "AI Assistant", href: "/assistant", icon: Bot },
    { label: "Safety & Guides", href: "/preparedness", icon: ShieldCheck },
    { label: "Verified Shelters", href: "/shelters", icon: Building2 },
    { label: "Citizen Reports", href: "/reports", icon: FileText },
    { label: "Data Sources", href: "/sources", icon: Database },
    { label: "About Capstone", href: "/about", icon: Info },
  ];

  const adminNavItems = [
    { label: "Admin Console", href: "/admin", icon: Sliders },
    { label: "System Health", href: "/admin/system-health", icon: Activity },
  ];

  return (
    <>
      {/* Top Banner Bar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-atmosphere-border bg-[#081522]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-atmosphere-ice to-atmosphere-teal flex items-center justify-center p-0.5 shadow-glow">
                <div className="w-full h-full bg-atmosphere-bg rounded-[7px] flex items-center justify-center">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-atmosphere-ice opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-atmosphere-teal"></span>
                  </span>
                </div>
              </div>
              <div>
                <span className="text-lg font-bold font-heading text-atmosphere-text group-hover:text-atmosphere-ice transition-colors tracking-tight">
                  DisasterSense<span className="text-atmosphere-ice">AI</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-atmosphere-border bg-atmosphere-surface text-atmosphere-teal">
                  Odisha-First 2026
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Top Quick Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-atmosphere-surface text-atmosphere-ice border border-atmosphere-ice/30"
                  : "text-atmosphere-muted hover:text-atmosphere-text hover:bg-atmosphere-surface/50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/map"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/map"
                  ? "bg-atmosphere-surface text-atmosphere-ice border border-atmosphere-ice/30"
                  : "text-atmosphere-muted hover:text-atmosphere-text hover:bg-atmosphere-surface/50"
              }`}
            >
              Map
            </Link>
            <Link
              href="/hazards"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/hazards"
                  ? "bg-atmosphere-surface text-atmosphere-ice border border-atmosphere-ice/30"
                  : "text-atmosphere-muted hover:text-atmosphere-text hover:bg-atmosphere-surface/50"
              }`}
            >
              Hazards
            </Link>
            <Link
              href="/assistant"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === "/assistant"
                  ? "bg-atmosphere-ice/20 text-atmosphere-ice border border-atmosphere-ice"
                  : "text-atmosphere-ice/80 hover:text-atmosphere-ice hover:bg-atmosphere-ice/10"
              }`}
            >
              <Bot className="w-4 h-4" />
              AI Assistant
            </Link>
          </div>

          {/* Right Action / Mobile Trigger */}
          <div className="flex items-center space-x-3">
            <Link
              href="/reports"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe/40 hover:bg-atmosphere-severe/30 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Incident</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-atmosphere-muted hover:text-atmosphere-text hover:bg-atmosphere-surface transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#081522]/95 backdrop-blur-xl pt-20 px-4 pb-8 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-atmosphere-muted/70 mb-2">
              Platform Intelligence
            </p>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-atmosphere-surface text-atmosphere-ice border border-atmosphere-ice/30"
                      : "text-atmosphere-muted hover:text-atmosphere-text hover:bg-atmosphere-surface/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-atmosphere-border my-4">
              <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-atmosphere-muted/70 mb-2">
                Administration
              </p>
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-atmosphere-surface text-atmosphere-teal border border-atmosphere-teal/30"
                        : "text-atmosphere-muted hover:text-atmosphere-text hover:bg-atmosphere-surface/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081522]/95 border-t border-atmosphere-border backdrop-blur-lg px-2 py-1.5 flex justify-around">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center py-1 px-3 text-[11px] ${
            pathname === "/dashboard" ? "text-atmosphere-ice font-semibold" : "text-atmosphere-muted"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/map"
          className={`flex flex-col items-center py-1 px-3 text-[11px] ${
            pathname === "/map" ? "text-atmosphere-ice font-semibold" : "text-atmosphere-muted"
          }`}
        >
          <Map className="w-4 h-4 mb-0.5" />
          <span>Map</span>
        </Link>
        <Link
          href="/hazards"
          className={`flex flex-col items-center py-1 px-3 text-[11px] ${
            pathname === "/hazards" ? "text-atmosphere-ice font-semibold" : "text-atmosphere-muted"
          }`}
        >
          <AlertTriangle className="w-4 h-4 mb-0.5" />
          <span>Hazards</span>
        </Link>
        <Link
          href="/assistant"
          className={`flex flex-col items-center py-1 px-3 text-[11px] ${
            pathname === "/assistant" ? "text-atmosphere-ice font-semibold" : "text-atmosphere-muted"
          }`}
        >
          <Bot className="w-4 h-4 mb-0.5" />
          <span>AI Assist</span>
        </Link>
      </nav>
    </>
  );
}
