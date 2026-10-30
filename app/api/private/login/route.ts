import { NextResponse } from "next/server";
import {
  createPrivateSession,
  privateAuthIsConfigured,
  verifyPrivatePassword,
} from "@/lib/privateAuth";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

type AttemptState = {
  count: number;
  windowStartedAt: number;
};

type LoginGlobal = typeof globalThis & {
  easyCvLoginAttempts?: Map<string, AttemptState>;
};

const loginGlobal = globalThis as LoginGlobal;
const attempts =
  loginGlobal.easyCvLoginAttempts ||
  (loginGlobal.easyCvLoginAttempts = new Map<string, AttemptState>());

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || now - current.windowStartedAt >= WINDOW_MS) {
    attempts.set(key, { count: 1, windowStartedAt: now });
    return false;
  }

  current.count += 1;
  attempts.set(key, current);

  return current.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  if (!privateAuthIsConfigured()) {
    return NextResponse.json(
      { error: "Private access is not configured." },
      { status: 503 }
    );
  }

  const key = clientKey(request);

  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait 15 minutes." },
      { status: 429 }
    );
  }

  let password = "";

  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!password || password.length > 256 || !verifyPrivatePassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(key);
  await createPrivateSession();

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
