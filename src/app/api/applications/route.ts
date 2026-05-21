import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/agra/schema";
import { addApplication, listApplications } from "@/lib/agra/store";

export async function GET() {
  return NextResponse.json({ applications: listApplications() });
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = applicationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid application", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const application = addApplication(parsed.data);
  return NextResponse.json({ application }, { status: 201 });
}
