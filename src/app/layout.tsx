import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "DisasterSense AI — Real-Time Disaster Risk Intelligence & Community Resilience Platform",
  description: "Evidence-grounded multi-source disaster risk intelligence platform for Odisha, integrating real-time weather forecasts, GloFAS river discharge hydrology, GDACS alerts, USGS seismology, and Google Gemini AI.",
  keywords: [
    "Odisha Disaster Intelligence",
    "DisasterSense AI",
    "Cyclone Early Warning",
    "GloFAS Flood Discharge",
    "USGS Earthquake",
    "Bhubaneswar Weather",
    "OSDMA MPCS Cyclone Shelters",
    "Community Resilience"
  ],
  authors: [{ name: "DisasterSense AI Research & Engineering Team" }],
  openGraph: {
    title: "DisasterSense AI — Odisha Disaster Intelligence Platform",
    description: "Real-time multi-hazard assessment, hydrological indicators, verified cyclone shelters, and AI-grounded citizen guidance.",
    url: "https://disastersense.ai",
    siteName: "DisasterSense AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-atmosphere-bg text-atmosphere-text min-h-screen flex flex-col antialiased selection:bg-atmosphere-ice selection:text-atmosphere-bg">
        <Navigation />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <footer className="glass-panel border-t border-atmosphere-border py-6 px-4 sm:px-6 lg:px-8 text-xs font-mono text-atmosphere-muted">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-atmosphere-safe"></span>
              <span>DisasterSense AI v4.0 • Academic Capstone 2026</span>
            </div>
            <div className="flex items-center space-x-6 text-[11px]">
              <span>Scientific Data: Open-Meteo &bull; GloFAS &bull; GDACS &bull; USGS</span>
              <span className="text-atmosphere-ice">Scope: Odisha, India</span>
              <span className="text-atmosphere-teal">₹0 Cost Non-Commercial Architecture</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
