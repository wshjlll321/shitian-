"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BilingualField } from "@/components/admin/BilingualField.client";
import { AdminEditToolbar } from "@/components/admin/AdminEditToolbar";
import {
  LanguageModeSwitcher,
  type EditMode
} from "@/components/admin/LanguageModeSwitcher.client";
import { computeProgress } from "@/lib/i18n-progress";
import type { ContactInfo, HomeHeroContent } from "@/types/content";
import type { SiteProfile } from "@/lib/cms";

type SettingsFormProps = {
  site: SiteProfile;
  contact: ContactInfo;
  home: HomeHeroContent;
};

const fieldClass =
  "min-h-10 w-full border border-carbon-black/15 bg-white px-2.5 text-sm text-carbon-black outline-none transition focus:border-aviation-orange";
const labelClass = "grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-metal-gray";

export function SettingsForm({ site, contact, home }: SettingsFormProps) {
  const router = useRouter();

  // Site profile (single language).
  const [siteName, setSiteName] = useState(site.name);
  const [positioning, setPositioning] = useState(site.positioning);
  const [description, setDescription] = useState(site.description);

  // Home hero — bilingual marketing copy.
  const [heroEyebrow, setHeroEyebrow] = useState(home.eyebrow);
  const [heroEyebrowEn, setHeroEyebrowEn] = useState(home.eyebrowEn ?? "");
  const [heroTitle, setHeroTitle] = useState(home.title);
  const [heroTitleEn, setHeroTitleEn] = useState(home.titleEn ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(home.subtitle);
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(home.subtitleEn ?? "");

  // Contact — company identity and channels (a few fields are bilingual).
  const [companyName, setCompanyName] = useState(contact.companyName);
  const [companyNameEn, setCompanyNameEn] = useState(contact.companyNameEn ?? "");
  const [contactPerson, setContactPerson] = useState(contact.contactPerson);
  const [contactPersonEn, setContactPersonEn] = useState(contact.contactPersonEn ?? "");
  const [phone, setPhone] = useState(contact.phone);
  const [telephone, setTelephone] = useState(contact.telephone);
  const [email, setEmail] = useState(contact.email);
  const [website, setWebsite] = useState(contact.website);
  const [address, setAddress] = useState(contact.addresses[0]?.value ?? "");
  const [addressEn, setAddressEn] = useState(contact.addresses[0]?.valueEn ?? "");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [mode, setMode] = useState<EditMode>("zh");
  const formId = "admin-settings-form";

  // Strip an empty trimmed string and return undefined so we don't save empty
  // EN strings into the database.
  const clean = (v: string) => {
    const t = v.trim();
    return t.length > 0 ? t : undefined;
  };

  const progress = computeProgress(
    {
      eyebrowEn: heroEyebrowEn,
      titleEn: heroTitleEn,
      subtitleEn: heroSubtitleEn,
      companyNameEn,
      contactPersonEn,
      addressEn
    },
    ["eyebrow", "title", "subtitle", "companyName", "contactPerson", "address"]
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setSaving(true);

    const nextSite: Partial<SiteProfile> = {
      name: siteName,
      positioning,
      description
    };
    const nextContact: Partial<ContactInfo> = {
      companyName,
      companyNameEn: clean(companyNameEn),
      contactPerson,
      contactPersonEn: clean(contactPersonEn),
      phone,
      telephone,
      email,
      website,
      addresses: [
        {
          value: address,
          valueEn: clean(addressEn),
          status: "approved"
        },
        ...contact.addresses.slice(1)
      ]
    };
    const nextHome: Partial<HomeHeroContent> = {
      eyebrow: heroEyebrow,
      eyebrowEn: clean(heroEyebrowEn),
      title: heroTitle,
      titleEn: clean(heroTitleEn),
      subtitle: heroSubtitle,
      subtitleEn: clean(heroSubtitleEn)
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: nextSite, contact: nextContact, home: nextHome })
      });
      if (res.ok) {
        setMessage({ type: "ok", text: "已保存，前台页头、页脚与主页 Hero 已更新。" });
        router.refresh();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage({ type: "err", text: data.error ?? "保存失败" });
      }
    } catch {
      setMessage({ type: "err", text: "网络错误，请重试。" });
    }
    setSaving(false);
  }

  return (
    <div className="px-10 py-10">
      <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
        Settings · 公司信息
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em]">公司信息</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-carbon-black/60">
        修改公司名称、联系方式、地址，以及主页 Hero 的标题副标。这里的内容会出现在网站页头、页脚、主页与联系页上。
      </p>

      <AdminEditToolbar
        formId={formId}
        saving={saving}
        title="公司信息维护操作"
        description="保存后会同步页头、页脚、主页与联系页。"
        viewHref="/contact"
      />

      <div className="mt-5 max-w-3xl">
        <LanguageModeSwitcher mode={mode} onChange={setMode} progress={progress} />
      </div>

      <form id={formId} onSubmit={onSubmit} className="mt-8 max-w-3xl">
        {/* ---- Site profile (single language) ---- */}
        <section className="grid gap-6 border-t border-carbon-black/12 pt-7">
          <h2 className="font-display text-base font-semibold">网站信息</h2>
          <label className={labelClass}>
            网站简称 Site name
            <input className={fieldClass} value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </label>
          <label className={labelClass}>
            定位语 Positioning
            <input
              className={fieldClass}
              value={positioning}
              onChange={(e) => setPositioning(e.target.value)}
            />
          </label>
          <label className={labelClass}>
            介绍文案 Description
            <textarea
              className={`${fieldClass} min-h-24 py-2 leading-6`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </section>

        {/* ---- Home hero (bilingual marketing copy) ---- */}
        <section className="mt-8 grid gap-6 border-t border-carbon-black/12 pt-7">
          <div>
            <h2 className="font-display text-base font-semibold">主页 Hero</h2>
            <p className="mt-1 text-[12px] text-carbon-black/50">
              主页第一屏的眉标、标题与副标。点击「+ 添加 English」即可补充英文版本。
            </p>
          </div>
          <BilingualField
            label="眉标 Eyebrow"
            kind="text"
            valueZh={heroEyebrow}
            valueEn={heroEyebrowEn}
            onChangeZh={setHeroEyebrow}
            onChangeEn={setHeroEyebrowEn}
            mode={mode}
          />
          <BilingualField
            label="主标题 Title"
            kind="text"
            valueZh={heroTitle}
            valueEn={heroTitleEn}
            onChangeZh={setHeroTitle}
            onChangeEn={setHeroTitleEn}
            mode={mode}
          />
          <BilingualField
            label="副标描述 Subtitle"
            kind="textarea"
            valueZh={heroSubtitle}
            valueEn={heroSubtitleEn}
            onChangeZh={setHeroSubtitle}
            onChangeEn={setHeroSubtitleEn}
            mode={mode}
          />
        </section>

        {/* ---- Contact ---- */}
        <section className="mt-8 grid gap-6 border-t border-carbon-black/12 pt-7">
          <h2 className="font-display text-base font-semibold">联系方式</h2>
          <BilingualField
            label="公司全称 Company name"
            kind="text"
            valueZh={companyName}
            valueEn={companyNameEn}
            onChangeZh={setCompanyName}
            onChangeEn={setCompanyNameEn}
            mode={mode}
          />
          <BilingualField
            label="联系人 Contact"
            kind="text"
            valueZh={contactPerson}
            valueEn={contactPersonEn}
            onChangeZh={setContactPerson}
            onChangeEn={setContactPersonEn}
            mode={mode}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <label className={labelClass}>
              手机 Mobile
              <input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className={labelClass}>
              座机 Office phone
              <input
                className={fieldClass}
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </label>
            <label className={labelClass}>
              邮箱 Email
              <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className={labelClass}>
              官网 Website
              <input
                className={fieldClass}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>
          <BilingualField
            label="公司地址 Address"
            kind="text"
            valueZh={address}
            valueEn={addressEn}
            onChangeZh={setAddress}
            onChangeEn={setAddressEn}
            mode={mode}
          />
        </section>

        {message ? (
          <p
            className={`mt-7 border px-3 py-2 text-[13px] ${
              message.type === "ok"
                ? "border-aviation-orange/40 bg-aviation-orange/5 text-aviation-orange"
                : "border-signal-red/40 bg-signal-red/10 text-signal-red"
            }`}
          >
            {message.text}
          </p>
        ) : null}

        <div className="mt-7 flex items-center gap-4 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-11 items-center justify-center bg-aviation-orange px-7 text-sm font-medium text-surface-warm transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "保存中…" : "保存修改"}
          </button>
        </div>
      </form>
    </div>
  );
}
