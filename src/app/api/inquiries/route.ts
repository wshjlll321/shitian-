import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

type InquiryPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  region?: string;
  product?: string;
  scenario?: string;
  message?: string;
  locale?: string;
  source?: string;
  consent?: boolean;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 2000) : "";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: InquiryPayload;
  try {
    body = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const consent = body.consent === true;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || !isEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ error: "Consent is required" }, { status: 400 });
  }

  const inquiry = await prisma.inquirySubmission.create({
    data: {
      name,
      email,
      consent,
      company: clean(body.company),
      phone: clean(body.phone),
      region: clean(body.region),
      product: clean(body.product),
      scenario: clean(body.scenario),
      message: clean(body.message),
      locale: clean(body.locale) === "en" ? "en" : "zh",
      source: clean(body.source) || "contact"
    },
    select: {
      id: true,
      createdAt: true
    }
  });

  return NextResponse.json({ ok: true, inquiry });
}
