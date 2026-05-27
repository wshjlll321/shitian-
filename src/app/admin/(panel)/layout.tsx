import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/AdminSidebar.client";
import { getSession } from "@/lib/auth";

// Admin pages reflect content changes as soon as a record is saved, so we
// opt every panel route out of the build-time data cache.
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  // Middleware already guards /admin, but we re-check here so the layout can
  // hand the username to the sidebar.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-surface-porcelain text-carbon-black">
      <AdminSidebar username={session.username} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
