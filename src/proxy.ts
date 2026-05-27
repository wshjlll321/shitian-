import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { SESSION_COOKIE } from "@/lib/auth";
import { SESSION_SECRET_BYTES } from "@/lib/session-secret";

const SECRET = SESSION_SECRET_BYTES;

// Guards the admin area + propagates the request pathname for the root
// layout (so it can pick the right `<html lang>`).
//
// • For every request the proxy attaches an `x-pathname` request header so
//   downstream Server Components can read it via `headers()`.
// • Routes under /admin and /api/admin additionally require a valid
//   session cookie (login page and login/logout API routes stay public).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const passHeaders = new Headers(request.headers);
  passHeaders.set("x-pathname", pathname);

  const isAdminScoped =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isAdminScoped) {
    return NextResponse.next({ request: { headers: passHeaders } });
  }

  const isPublic =
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";
  if (isPublic) {
    return NextResponse.next({ request: { headers: passHeaders } });
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let valid = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET);
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (valid) return NextResponse.next({ request: { headers: passHeaders } });

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Match everything except Next internals and static assets so the root
  // layout can read the pathname for locale resolution. Auth guard inside
  // the handler still scopes itself to /admin and /api/admin only.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|uploads/|robots\\.txt|sitemap\\.xml).*)"]
};
