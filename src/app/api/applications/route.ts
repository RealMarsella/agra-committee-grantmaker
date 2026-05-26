import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/agra/schema";
import { addApplication, listApplications } from "@/lib/agra/store";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({ applications: await listApplications() });
}

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", issues: null },
      { status: 400 },
    );
  }

  const parsed = applicationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid application", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const application = await addApplication(parsed.data);
  return NextResponse.json({ application }, { status: 201 });
}
