"use client";

import dynamic from "next/dynamic";
import { OdishaDistrict, UsgsEarthquake, GdacsAlert, CommunityReport } from "@/types";

interface DynamicMapProps {
  selectedDistrict: OdishaDistrict;
  onSelectDistrict?: (d: OdishaDistrict) => void;
  earthquakes?: UsgsEarthquake[];
  alerts?: GdacsAlert[];
  reports?: CommunityReport[];
  centerLat?: number;
  centerLng?: number;
  zoomLevel?: number;
}

const LeafletMap = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] rounded-xl flex flex-col items-center justify-center bg-atmosphere-surface/60 border border-atmosphere-border animate-pulse">
      <div className="w-10 h-10 rounded-full border-2 border-atmosphere-ice border-t-transparent animate-spin mb-3"></div>
      <p className="text-xs font-mono text-atmosphere-muted">Loading Cartographic Engine & Odisha Telemetry...</p>
    </div>
  ),
});

export default function DynamicMap(props: DynamicMapProps) {
  return <LeafletMap {...props} />;
}
