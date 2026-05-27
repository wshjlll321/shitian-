"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  en: string;
  ready: boolean;
};

// `ready: false` items render dimmed until their admin module ships
// (phase 2b / phase 3), so the sidebar shows the full plan without 404s.
const NAV: NavItem[] = [
  { href: "/admin", label: "仪表盘", en: "Dashboard", ready: true },
  { href: "/admin/home", label: "主页内容", en: "Home", ready: true },
  { href: "/admin/inquiries", label: "询盘线索", en: "Inquiries", ready: true },
  { href: "/admin/about", label: "关于页", en: "About", ready: true },
  { href: "/admin/products", label: "产品", en: "Products", ready: true },
  { href: "/admin/cases", label: "案例", en: "Cases", ready: true },
  { href: "/admin/news", label: "新闻动态", en: "News", ready: true },
  { href: "/admin/scenarios", label: "应用场景", en: "Scenarios", ready: true },
  { href: "/admin/technology", label: "技术能力", en: "Technology", ready: true },
  { href: "/admin/settings", label: "公司信息", en: "Settings", ready: true }
];

export function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-surface-warm/12 bg-carbon-black text-surface-warm">
      <div className="border-b border-surface-warm/12 px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="block h-px w-5 bg-aviation-orange" />
          <p className="font-numeric text-[10px] uppercase tracking-[0.26em] text-aviation-orange">
            Shitian CMS
          </p>
        </div>
        <p className="mt-2 font-display text-lg font-semibold">世天航空 · 内容后台</p>
      </div>

      <nav className="flex-1 px-3 py-5">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          if (!item.ready) {
            return (
              <span
                key={item.href}
                className="flex items-center justify-between px-3 py-2.5 text-sm text-surface-warm/30"
              >
                <span>{item.label}</span>
                <span className="text-[9px] uppercase tracking-[0.16em]">即将上线</span>
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between border-l-2 px-3 py-2.5 text-sm transition ${
                active
                  ? "border-aviation-orange bg-surface-warm/[0.06] text-surface-warm"
                  : "border-transparent text-surface-warm/65 hover:bg-surface-warm/[0.04] hover:text-surface-warm"
              }`}
            >
              <span>{item.label}</span>
              <span className="font-numeric text-[9px] uppercase tracking-[0.16em] text-surface-warm/35">
                {item.en}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-surface-warm/12 px-6 py-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-surface-warm/40">
          当前账号
        </p>
        <p className="mt-1.5 font-numeric text-sm text-surface-warm/80">{username}</p>
        <div className="mt-4 flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-surface-warm/55 transition hover:text-aviation-orange"
          >
            查看网站 ↗
          </a>
          <button
            type="button"
            onClick={logout}
            className="text-[12px] text-surface-warm/55 transition hover:text-signal-red"
          >
            退出登录
          </button>
        </div>
      </div>
    </aside>
  );
}
