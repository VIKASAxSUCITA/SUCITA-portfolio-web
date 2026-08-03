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
import { adminPutContent, fetchContentJson } from "./adminClient";
import { htmlToParagraphs } from "./richText";
import { asLocalized } from "@/lib/i18n/config";

const PATH = "sucita/content/insights.json";

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

  return {
    id,
    slug,
    type,
    title: asLocalized(raw.title as string | undefined, title),
    excerpt: asLocalized(raw.excerpt as string | undefined, String(raw.excerpt ?? "")),
    content,
    bodyHtml: raw.bodyHtml
      ? asLocalized(raw.bodyHtml as string | Record<string, string>, "<p></p>")
      : undefined,
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

async function readList(): Promise<CmsInsight[]> {
  if (typeof window === "undefined") {
    return normalizeList(await readContentJson<unknown>(PATH));
  }
  return normalizeList(await fetchContentJson<unknown>("insights"));
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
  await adminPutContent("insights", [nextItem, ...without]);
  return id;
}

export async function deleteInsight(id: string) {
  const current = await listInsights();
  await adminPutContent(
    "insights",
    current.filter((item) => item.id !== id)
  );
}

export async function seedInsightsIfEmpty() {
  if (typeof window === "undefined") return false;
  const existing = await fetchContentJson<unknown>("insights");
  if (Array.isArray(existing) && existing.length > 0) return false;
  await adminPutContent("insights", defaults());
  return true;
}
