"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "登录失败");
    } catch {
      setError("网络错误，请重试");
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-carbon-black px-6 text-surface-warm">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
          <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
            Shitian Aviation · 内容后台
          </p>
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-[-0.01em]">
          管理后台登录
        </h1>
        <p className="mt-3 text-sm leading-7 text-surface-warm/55">
          登录后可维护产品、案例、新闻与场景内容。
        </p>

        <form onSubmit={onSubmit} className="mt-9 grid gap-6">
          <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em] text-surface-warm/55">
            用户名
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="min-h-11 w-full border-0 border-b border-surface-warm/20 bg-transparent px-0 text-base text-surface-warm outline-none transition focus:border-aviation-orange"
            />
          </label>
          <label className="grid gap-2 text-[11px] uppercase tracking-[0.18em] text-surface-warm/55">
            密码
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="min-h-11 w-full border-0 border-b border-surface-warm/20 bg-transparent px-0 text-base text-surface-warm outline-none transition focus:border-aviation-orange"
            />
          </label>

          {error ? (
            <p className="border border-signal-red/40 bg-signal-red/10 px-3 py-2 text-[13px] text-signal-red">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex min-h-12 items-center justify-center gap-2 bg-aviation-orange px-6 text-sm font-medium text-surface-warm transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "登录中…" : "登 录"}
          </button>
        </form>
      </div>
    </main>
  );
}
