import { NextResponse } from "next/server";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";

export async function GET() {
  return NextResponse.json({
    districts: ODISHA_DISTRICTS,
    totalCount: ODISHA_DISTRICTS.length,
    coastalDistrictsCount: ODISHA_DISTRICTS.filter(d => d.isCoastal).length,
    retrievedAt: new Date().toISOString()
  });
}
