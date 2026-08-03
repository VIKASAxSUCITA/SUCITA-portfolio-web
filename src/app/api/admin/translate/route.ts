import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/verifyFirebaseIdToken";
import { locales, type Locale } from "@/lib/i18n/config";

export const runtime = "nodejs";

const MYMEMORY_LANG: Record<Locale, string> = {
  en: "en",
  km: "km",
  zh: "zh-CN",
};

async function translateText(text: string, from: Locale, to: Locale) {
  if (!text.trim() || from === to) return text;
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text.slice(0, 450));
  url.searchParams.set(
    "langpair",
    `${MYMEMORY_LANG[from]}|${MYMEMORY_LANG[to]}`
  );

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Translate request failed");
  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
  };
  const translated = data.responseData?.translatedText?.trim();
  if (!translated || data.responseStatus !== 200) {
    throw new Error("Could not translate text");
  }
  // MyMemory sometimes returns MATCH warnings as the text
  if (translated.toUpperCase().includes("MYMEMORY WARNING")) {
    throw new Error("Translate limit reached. Try again later.");
  }
  return translated;
}

export async function POST(request: Request) {
  const user = await requireAdminFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { text?: string; from?: Locale; to?: Locale | Locale[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = String(body.text ?? "").trim();
  const from = body.from;
  if (!text || !from || !locales.includes(from)) {
    return NextResponse.json(
      { error: "Expected { text, from, to }" },
      { status: 400 }
    );
  }

  const targets = Array.isArray(body.to)
    ? body.to
    : body.to
      ? [body.to]
      : locales.filter((l) => l !== from);

  try {
    const translations: Partial<Record<Locale, string>> = { [from]: text };
    for (const to of targets) {
      if (!locales.includes(to) || to === from) continue;
      translations[to] = await translateText(text, from, to);
    }
    return NextResponse.json({ translations });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Translate failed",
      },
      { status: 502 }
    );
  }
}
