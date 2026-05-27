import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Throttle login attempts per ip — keeps brute-force tries to a sane rate
  // without locking out a legitimate operator who mistypes a couple of times.
  const ip = clientIp(request);
  const limit = rateLimit(`login:${ip}`, { max: 8, windowMs: 60_000 });
  if (!limit.ok) {
    const seconds = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: `登录尝试过于频繁,请 ${seconds} 秒后再试` },
      { status: 429, headers: { "Retry-After": String(seconds) } }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式有误" }, { status: 400 });
  }

  const username = body.username?.trim();
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }

  await createSession(user.username);
  return NextResponse.json({ ok: true });
}
