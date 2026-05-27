import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * DELETE /api/admin/inquiries/:id
 *
 * Removes a single inquiry record. Used by the admin list to clear bogus
 * submissions (spam, accidental duplicates) so sales engineers see a
 * clean queue. The endpoint is mounted under /api/admin/* so the proxy
 * guard requires a valid session.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const numeric = Number.parseInt(id, 10);
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return NextResponse.json({ error: "无效的 id" }, { status: 400 });
  }

  const existing = await prisma.inquirySubmission.findUnique({
    where: { id: numeric }
  });
  if (!existing) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 });
  }

  await prisma.inquirySubmission.delete({ where: { id: numeric } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true });
}
