import { NextResponse } from "next/server";
import { canonicalApplication, createApplication } from "@/lib/agra/fixtures";

export const runtime = "edge";

export async function POST() {
  const application = await createApplication(canonicalApplication);
  return NextResponse.json({ application });
}
