import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  insights as defaultInsights,
  insightCategories,
  type Insight,
  type InsightCategory,
  type InsightType,
} from "@/data/insights";
import { slugify } from "./slug";
import type { CmsInsight } from "./types";
import { readContentJson } from "./blobJson";
import { fetchContentJson } from "./adminClient";
import { htmlToParagraphs, paragraphsToHtml } from "./richText";
import { asLocalized } from "@/lib/i18n/config";
import { getFirebaseDb } from "@/lib/firebase/client";

/** Legacy Blob JSON path — read-only fallback for content saved before Firestore. */
const LEGACY_BLOB_PATH = "sucita/content/insights.json";

function insightsDoc() {
  return doc(getFirebaseDb(), "pages", "insights");
}

function normalize(raw: Record<string, unknown>, id: string): CmsInsight {
  const title = String(raw.title ?? "Untitled");
  const slug = String(raw.slug || slugify(title) || id);
  const category = insightCategories.includes(raw.category as InsightCategory)
    ? (raw.category as InsightCategory)
    : "Accounting & Tax";
  const type: InsightType = raw.type === "project" ? "project" : "article";
  const content = Array.isArray(raw.content)
    ? raw.content.map(String).filter(Boolean)
    : typeof raw.content === "string"
      ? String(raw.content)
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];
  const galleryImages = Array.isArray(raw.galleryImages)
    ? raw.galleryImages.map(String).filter(Boolean)
    : [];

  // Legacy articles only have plain `content` paragraphs — build the rich
  // text body from them so the editor doesn't open empty.
  const bodyHtmlRaw = raw.bodyHtml
    ? asLocalized(raw.bodyHtml as string | Record<string, string>, "<p></p>")
    : undefined;
  const hasBodyHtml =
    !!bodyHtmlRaw && !!bodyHtmlRaw.en.replace(/<[^>]+>/g, "").trim();
  const bodyHtml = hasBodyHtml
    ? bodyHtmlRaw
    : content.length
      ? asLocalized(paragraphsToHtml(content), "<p></p>")
      : undefined;

  return {
    id,
    slug,
    type,
    title: asLocalized(raw.title as string | undefined, title),
    excerpt: asLocalized(raw.excerpt as string | undefined, String(raw.excerpt ?? "")),
    content,
    bodyHtml,
    category,
    publishedAt: String(raw.publishedAt ?? new Date().toISOString().slice(0, 10)),
    coverImage: String(raw.coverImage ?? "/assets/img/insights/vat-refund-cover.png"),
    galleryImages,
    client: raw.client ? String(raw.client) : undefined,
    service: raw.service ? String(raw.service) : undefined,
  };
}

function toInsight(item: CmsInsight): Insight {
  const { id: _id, ...rest } = item;
  return rest;
}

function defaults(): CmsInsight[] {
  return defaultInsights.map((item, index) => ({
    ...item,
    id: item.slug || `default-${index}`,
  }));
}

function normalizeList(raw: unknown): CmsInsight[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaults();
  return raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const id = String(record.id ?? record.slug ?? `insight-${index}`);
      return normalize(record, id);
    })
    .filter((item): item is CmsInsight => !!item)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

/** Firestore rejects `undefined` field values — emit plain objects only. */
function toFirestoreItems(items: CmsInsight[]) {
  return items.map((item) => {
    const row: Record<string, unknown> = {
      id: item.id,
      slug: item.slug,
      type: item.type,
      title: asLocalized(item.title),
      excerpt: asLocalized(item.excerpt),
      content: item.content ?? [],
      category: item.category,
      publishedAt: item.publishedAt,
      coverImage: item.coverImage,
      galleryImages: item.galleryImages ?? [],
    };
    if (item.bodyHtml) row.bodyHtml = asLocalized(item.bodyHtml, "<p></p>");
    if (item.client) row.client = item.client;
    if (item.service) row.service = item.service;
    return row;
  });
}

async function writeList(items: CmsInsight[]) {
  await setDoc(
    insightsDoc(),
    {
      items: toFirestoreItems(items),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function readList(): Promise<CmsInsight[]> {
  try {
    const snap = await getDoc(insightsDoc());
    if (snap.exists()) {
      const data = snap.data() as { items?: unknown[] };
      // An existing doc with an empty list means the admin deleted every
      // insight on purpose — don't fall back to defaults.
      if (Array.isArray(data.items)) {
        return data.items.length ? normalizeList(data.items) : [];
      }
    }
  } catch (error) {
    console.error("Firestore read failed for insights", error);
  }

  // Legacy fallback: content saved to Blob JSON before the Firestore migration
  if (typeof window === "undefined") {
    try {
      return normalizeList(await readContentJson<unknown>(LEGACY_BLOB_PATH));
    } catch {
      return defaults();
    }
  }
  return defaults();
}

export async function listInsights(): Promise<CmsInsight[]> {
  try {
    return await readList();
  } catch {
    return defaults();
  }
}

export async function getPublicInsights(): Promise<Insight[]> {
  return (await listInsights()).map(toInsight);
}

export async function getPublicInsightBySlug(
  slug: string
): Promise<Insight | undefined> {
  return (await getPublicInsights()).find((item) => item.slug === slug);
}

export async function getInsightById(id: string): Promise<CmsInsight | null> {
  return (await listInsights()).find((item) => item.id === id) ?? null;
}

export async function saveInsight(
  input: Omit<CmsInsight, "id"> & { id?: string }
): Promise<string> {
  const titleLocal = asLocalized(input.title);
  const id = input.id || slugify(titleLocal.en) || `insight-${Date.now()}`;
  const bodyHtml = input.bodyHtml
    ? asLocalized(input.bodyHtml, "<p></p>")
    : undefined;
  const content =
    bodyHtml && bodyHtml.en && bodyHtml.en !== "<p></p>"
      ? htmlToParagraphs(bodyHtml.en)
      : input.content ?? [];
  const nextItem = normalize(
    {
      ...input,
      slug: input.slug || slugify(titleLocal.en) || id,
      title: titleLocal,
      excerpt: asLocalized(input.excerpt),
      bodyHtml,
      content,
      client: input.client || "",
      service: input.service || "",
      galleryImages: input.galleryImages ?? [],
    },
    id
  );
  const current = await listInsights();
  const without = current.filter((item) => item.id !== id);
  await writeList([nextItem, ...without]);
  return id;
}

export async function deleteInsight(id: string) {
  const current = await listInsights();
  await writeList(current.filter((item) => item.id !== id));
}

/**
 * One-time migration: copy the current insights (Firestore fallback chain —
 * legacy Blob JSON or the hardcoded defaults) into Firestore if the
 * `pages/insights` document is empty. Safe to call repeatedly.
 */
export async function seedInsightsIfEmpty(): Promise<boolean> {
  try {
    const snap = await getDoc(insightsDoc());
    if (snap.exists()) {
      const data = snap.data() as { items?: unknown[] };
      // Any items field (even an empty list) means Firestore is already the
      // source of truth — never overwrite it.
      if (Array.isArray(data.items)) return false;
    }
  } catch {
    return false;
  }
  // In the browser we can't read the legacy Blob JSON directly, so ask the
  // server (which still falls back to Blob, then code defaults) for the list.
  const current =
    typeof window === "undefined"
      ? await listInsights()
      : normalizeList(await fetchContentJson<unknown>("insights"));
  await writeList(current);
  return true;
}
