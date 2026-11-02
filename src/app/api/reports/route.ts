import { NextRequest, NextResponse } from "next/server";
import { CommunityReport } from "@/types";

// In-memory persistent collection for community reports
const initialReports: CommunityReport[] = [
  {
    id: "REP-2026-001",
    district: "Khordha (Bhubaneswar)",
    locationName: "Iskcon Temple Low-Lying Underpass, Nayapalli",
    coordinates: { lat: 20.2985, lng: 85.8142 },
    category: "Waterlogging / Flood",
    description: "Knee-deep water accumulation after 35 minutes of intense rain shower. Two-wheelers stalled.",
    severity: "MEDIUM",
    status: "VERIFIED",
    reportedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    reporterAlias: "Satyajit M.",
    upvotes: 14
  },
  {
    id: "REP-2026-002",
    district: "Puri",
    locationName: "Marine Drive Road near Balighai",
    coordinates: { lat: 19.8240, lng: 85.8650 },
    category: "Tree / Powerline Down",
    description: "Casuarina tree branch snapped and resting on 11kV electrical distribution line. Road partially blocked.",
    severity: "HIGH",
    status: "VERIFIED",
    reportedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    reporterAlias: "Priyadarshi S.",
    upvotes: 28
  },
  {
    id: "REP-2026-003",
    district: "Balasore (Baleswar)",
    locationName: "Jalaka River Embankment, Basta Block",
    coordinates: { lat: 21.5600, lng: 87.0500 },
    category: "Waterlogging / Flood",
    description: "River water touching embankment crest at Mathani. Local volunteers monitoring sandbags.",
    severity: "CRITICAL",
    status: "UNDER_REVIEW",
    reportedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    reporterAlias: "Gram Panchayat Volunteer",
    upvotes: 42
  },
  {
    id: "REP-2026-004",
    district: "Cuttack",
    locationName: "Badambadi Bus Terminal Perimeter",
    coordinates: { lat: 20.4502, lng: 85.8720 },
    category: "Waterlogging / Flood",
    description: "Drainage overflow along the main entrance road. Commuters facing difficulty.",
    severity: "MEDIUM",
    status: "VERIFIED",
    reportedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    reporterAlias: "Rakesh K.",
    upvotes: 9
  }
];

let globalReports = [...initialReports];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  let filtered = globalReports;
  if (district && district !== "ALL") {
    filtered = filtered.filter(r => r.district.toLowerCase().includes(district.toLowerCase()));
  }
  if (category && category !== "ALL") {
    filtered = filtered.filter(r => r.category === category);
  }
  if (status && status !== "ALL") {
    filtered = filtered.filter(r => r.status === status);
  }

  return NextResponse.json({
    reports: filtered,
    totalCount: globalReports.length,
    retrievedAt: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { district, locationName, category, description, coordinates, reporterAlias, severity = "MEDIUM" } = body;

    if (!district || !locationName || !description) {
      return NextResponse.json({ error: "Missing required report fields" }, { status: 400 });
    }

    const newReport: CommunityReport = {
      id: `REP-2026-${String(globalReports.length + 1).padStart(3, "0")}`,
      district,
      locationName,
      coordinates: coordinates || { lat: 20.2961, lng: 85.8245 },
      category: category || "Waterlogging / Flood",
      description,
      severity,
      status: "UNVERIFIED", // citizen reports start unverified as per prompt rules!
      reportedAt: new Date().toISOString(),
      reporterAlias: reporterAlias || "Anonymous Resident",
      upvotes: 1
    };

    globalReports.unshift(newReport);

    return NextResponse.json({
      success: true,
      report: newReport,
      message: "Report submitted successfully. Marked as UNVERIFIED pending verification triage."
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit report" }, { status: 500 });
  }
}

// Support updating report status (for Admin moderation)
export async function PATCH(request: NextRequest) {
  try {
    const { id, status, upvote } = await request.json();
    const reportIndex = globalReports.findIndex(r => r.id === id);

    if (reportIndex === -1) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (status) {
      globalReports[reportIndex].status = status;
    }
    if (upvote) {
      globalReports[reportIndex].upvotes += 1;
    }

    return NextResponse.json({ success: true, report: globalReports[reportIndex] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
