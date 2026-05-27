import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
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
