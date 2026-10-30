import { NextResponse } from "next/server";
import { clearPrivateSession } from "@/lib/privateAuth";

export const runtime = "nodejs";

export async function POST() {
  await clearPrivateSession();

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
