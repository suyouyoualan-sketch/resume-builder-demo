import { NextResponse } from "next/server";
import { hasPrivateSession } from "@/lib/privateAuth";
import { getStoredResume, saveStoredResume } from "@/lib/privateResumeStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_SIZE = 100_000;
const noStoreHeaders = { "Cache-Control": "no-store" };

function unauthorized() {
  return NextResponse.json(
    { error: "Authentication required." },
    { status: 401, headers: noStoreHeaders }
  );
}

export async function GET() {
  if (!(await hasPrivateSession())) return unauthorized();

  try {
    const snapshot = await getStoredResume();

    return NextResponse.json(
      {
        resume: snapshot?.resume || null,
        updatedAt: snapshot?.updatedAt || null,
      },
      { headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("Failed to load private resume:", error);

    return NextResponse.json(
      { error: "Unable to load the cloud backup." },
      { status: 500, headers: noStoreHeaders }
    );
  }
}

export async function PUT(request: Request) {
  if (!(await hasPrivateSession())) return unauthorized();

  const bodyText = await request.text();

  if (bodyText.length > MAX_BODY_SIZE) {
    return NextResponse.json(
      { error: "Resume data is too large." },
      { status: 413, headers: noStoreHeaders }
    );
  }

  let resume: unknown;

  try {
    const body = JSON.parse(bodyText) as { resume?: unknown };
    resume = body.resume;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON data." },
      { status: 400, headers: noStoreHeaders }
    );
  }

  if (!resume || typeof resume !== "object" || Array.isArray(resume)) {
    return NextResponse.json(
      { error: "Invalid resume data." },
      { status: 400, headers: noStoreHeaders }
    );
  }

  try {
    const updatedAt = await saveStoredResume(resume as Record<string, unknown>);

    return NextResponse.json(
      { ok: true, updatedAt },
      { headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("Failed to save private resume:", error);

    return NextResponse.json(
      { error: "Unable to save the cloud backup." },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
