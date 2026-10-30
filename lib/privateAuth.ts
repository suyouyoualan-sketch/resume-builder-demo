import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "easycv_private_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function getSessionSecret() {
  const secret = process.env.PRIVATE_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("PRIVATE_SESSION_SECRET must contain at least 32 characters.");
  }

  return secret;
}

function digest(input: string) {
  return createHash("sha256").update(input).digest();
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

export function privateAuthIsConfigured() {
  return Boolean(
    process.env.PRIVATE_ACCESS_PASSWORD &&
      process.env.PRIVATE_SESSION_SECRET &&
      process.env.PRIVATE_SESSION_SECRET.length >= 32
  );
}

export function verifyPrivatePassword(password: string) {
  const expected = process.env.PRIVATE_ACCESS_PASSWORD;

  if (!expected) return false;

  return timingSafeEqual(digest(password), digest(expected));
}

function createSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiresAt);

  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string | undefined) {
  if (!token) return false;

  const [payload, suppliedSignature, extra] = token.split(".");

  if (!payload || !suppliedSignature || extra) return false;

  const expiresAt = Number(payload);

  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now() / 1000) {
    return false;
  }

  const expectedSignature = sign(payload);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);

  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function hasPrivateSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function createPrivateSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
    priority: "high",
  });
}

export async function clearPrivateSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
