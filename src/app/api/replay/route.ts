import { NextResponse } from "next/server";
import { canonicalApplication, createApplication } from "@/lib/agra/fixtures";

export async function POST() {
  const application = createApplication(
    canonicalApplication,
    canonicalApplication.submittedAt,
  );
  return NextResponse.json({ application });
}
