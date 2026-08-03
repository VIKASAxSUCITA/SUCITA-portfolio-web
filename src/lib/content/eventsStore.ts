import { events as defaultEvents, type EventItem, type EventType } from "@/data/events";
import { slugify } from "./slug";
import type { CmsEvent } from "./types";
import { readContentJson } from "./blobJson";
import { adminPutContent, fetchContentJson } from "./adminClient";
import { htmlToParagraphs } from "./richText";
import { asLocalized } from "@/lib/i18n/config";

const PATH = "sucita/content/events.json";

function normalize(raw: Record<string, unknown>, id: string): CmsEvent {
  const title = String(raw.title ?? "Untitled");
  const slug = String(raw.slug || slugify(title) || id);
  const type: EventType = raw.type === "announcement" ? "announcement" : "event";
  const description = Array.isArray(raw.description)
    ? raw.description.map(String).filter(Boolean)
    : typeof raw.description === "string"
      ? String(raw.description)
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

  return {
    id,
    slug,
    type,
    title: asLocalized(raw.title as string | undefined, title),
    excerpt: asLocalized(raw.excerpt as string | undefined, String(raw.excerpt ?? "")),
    description,
    bodyHtml: raw.bodyHtml
      ? asLocalized(raw.bodyHtml as string | Record<string, string>, "<p></p>")
      : undefined,
    date: String(raw.date ?? new Date().toISOString().slice(0, 10)),
    time: raw.time ? String(raw.time) : undefined,
    location: raw.location ? String(raw.location) : undefined,
    isUpcoming: Boolean(raw.isUpcoming ?? true),
    coverImage: String(raw.coverImage ?? "/assets/img/events/tax-workshop.png"),
  };
}

function toEvent(item: CmsEvent): EventItem {
  const { id: _id, ...rest } = item;
  return rest;
}

function defaults(): CmsEvent[] {
  return defaultEvents.map((item) => ({ ...item, id: item.slug }));
}

function normalizeList(raw: unknown): CmsEvent[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaults();
  return raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const id = String(record.id ?? record.slug ?? `event-${index}`);
      return normalize(record, id);
    })
    .filter((item): item is CmsEvent => !!item)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function readList(): Promise<CmsEvent[]> {
  if (typeof window === "undefined") {
    return normalizeList(await readContentJson<unknown>(PATH));
  }
  return normalizeList(await fetchContentJson<unknown>("events"));
}

export async function listEvents(): Promise<CmsEvent[]> {
  try {
    return await readList();
  } catch {
    return defaults();
  }
}

export async function getPublicEvents(): Promise<EventItem[]> {
  return (await listEvents()).map(toEvent);
}

export async function getPublicEventBySlug(
  slug: string
): Promise<EventItem | undefined> {
  return (await getPublicEvents()).find((item) => item.slug === slug);
}

export async function getEventById(id: string): Promise<CmsEvent | null> {
  return (await listEvents()).find((item) => item.id === id) ?? null;
}

export async function saveEvent(
  input: Omit<CmsEvent, "id"> & { id?: string }
): Promise<string> {
  const titleLocal = asLocalized(input.title);
  const id = input.id || slugify(titleLocal.en) || `event-${Date.now()}`;
  const bodyHtml = input.bodyHtml
    ? asLocalized(input.bodyHtml, "<p></p>")
    : undefined;
  const description =
    bodyHtml && bodyHtml.en && bodyHtml.en !== "<p></p>"
      ? htmlToParagraphs(bodyHtml.en)
      : input.description ?? [];
  const nextItem = normalize(
    {
      ...input,
      slug: input.slug || slugify(titleLocal.en) || id,
      title: titleLocal,
      excerpt: asLocalized(input.excerpt),
      bodyHtml,
      description,
      time: input.time || "",
      location: input.location || "",
    },
    id
  );
  const current = await listEvents();
  const without = current.filter((item) => item.id !== id);
  await adminPutContent("events", [nextItem, ...without]);
  return id;
}

export async function deleteEvent(id: string) {
  const current = await listEvents();
  await adminPutContent(
    "events",
    current.filter((item) => item.id !== id)
  );
}

export async function seedEventsIfEmpty() {
  if (typeof window === "undefined") return false;
  const existing = await fetchContentJson<unknown>("events");
  if (Array.isArray(existing) && existing.length > 0) return false;
  await adminPutContent("events", defaults());
  return true;
}
