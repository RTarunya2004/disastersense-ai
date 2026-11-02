import { NextRequest, NextResponse } from "next/server";
import { ODISHA_SHELTERS } from "@/data/odishaShelters";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");
  const query = searchParams.get("q");

  let list = ODISHA_SHELTERS;

  if (district && district !== "ALL") {
    list = list.filter(s => s.district.toLowerCase() === district.toLowerCase());
  }

  if (query) {
    const qLower = query.toLowerCase();
    list = list.filter(s =>
      s.name.toLowerCase().includes(qLower) ||
      s.block.toLowerCase().includes(qLower) ||
      s.village.toLowerCase().includes(qLower)
    );
  }

  return NextResponse.json({
    shelters: list,
    totalCount: list.length,
    attribution: "Odisha State Disaster Mitigation Authority (OSDMA) MPCS Cadastre",
    retrievedAt: new Date().toISOString()
  });
}
