import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import { SESSION_SECRET_BYTES } from "@/lib/session-secret";

/**
 * Admin session — a signed JWT stored in an httpOnly cookie.
 * Single-admin model: the only thing the token carries is the username.
 */

export const SESSION_COOKIE = "shitian_admin";

const SECRET = SESSION_SECRET_BYTES;

export type AdminSession = {
  username: string;
};

export async function createSession(username: string): Promise<void> {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { username: String(payload.username) };
  } catch {
    return null;
  }
}
