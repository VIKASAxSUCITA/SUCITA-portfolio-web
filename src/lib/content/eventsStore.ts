import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { events as defaultEvents, type EventItem, type EventType } from "@/data/events";
import { slugify } from "./slug";
import type { CmsEvent } from "./types";
import { readContentJson } from "./blobJson";
import { fetchContentJson } from "./adminClient";
import { htmlToParagraphs, paragraphsToHtml } from "./richText";
import { asLocalized } from "@/lib/i18n/config";
import { getFirebaseDb } from "@/lib/firebase/client";
import { isEventUpcoming, sortEventsByProximity } from "./eventSort";

/** Legacy Blob JSON path — read-only fallback for content saved before Firestore. */
const LEGACY_BLOB_PATH = "sucita/content/events.json";

function eventsDoc() {
  return doc(getFirebaseDb(), "pages", "events");
}

function normalize(raw: Record<string, unknown>, id: string): CmsEvent {
  const title = String(raw.title ?? "Untitled");
  const slug = String(raw.slug || slugify(title) || id);
  const type: EventType = String(raw.type ?? "").trim() || "event";
  const description = Array.isArray(raw.description)
    ? raw.description.map(String).filter(Boolean)
    : typeof raw.description === "string"
      ? String(raw.description)
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

  // Legacy events only have plain `description` paragraphs — build the rich
  // text body from them so the editor doesn't open empty.
  const bodyHtmlRaw = raw.bodyHtml
    ? asLocalized(raw.bodyHtml as string | Record<string, string>, "<p></p>")
    : undefined;
  const hasBodyHtml =
    !!bodyHtmlRaw && !!bodyHtmlRaw.en.replace(/<[^>]+>/g, "").trim();
  const bodyHtml = hasBodyHtml
    ? bodyHtmlRaw
    : description.length
      ? asLocalized(paragraphsToHtml(description), "<p></p>")
      : undefined;

  return {
    id,
    slug,
    type,
    title: asLocalized(raw.title as string | undefined, title),
    excerpt: asLocalized(raw.excerpt as string | undefined, String(raw.excerpt ?? "")),
    description,
    bodyHtml,
    date: String(raw.date ?? new Date().toISOString().slice(0, 10)),
    time: raw.time ? String(raw.time) : undefined,
    location: raw.location ? String(raw.location) : undefined,
    isUpcoming: isEventUpcoming(
      String(raw.date ?? new Date().toISOString().slice(0, 10))
    ),
    // `||` (not ??) so an empty string also falls back to the default image
    coverImage: String(raw.coverImage || "/assets/img/events/tax-workshop.png"),
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
  if (!Array.isArray(raw) || raw.length === 0) {
    return sortEventsByProximity(defaults());
  }
  const normalized = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const id = String(record.id ?? record.slug ?? `event-${index}`);
      return normalize(record, id);
    })
    .filter((item): item is CmsEvent => !!item);

  return sortEventsByProximity(normalized);
}

/** Firestore rejects `undefined` field values — emit plain objects only. */
function toFirestoreItems(items: CmsEvent[]) {
  return items.map((item) => {
    const row: Record<string, unknown> = {
      id: item.id,
      slug: item.slug,
      type: item.type,
      title: asLocalized(item.title),
      excerpt: asLocalized(item.excerpt),
      description: item.description ?? [],
      date: item.date,
      isUpcoming: item.isUpcoming,
      coverImage: item.coverImage,
    };
    if (item.bodyHtml) row.bodyHtml = asLocalized(item.bodyHtml, "<p></p>");
    if (item.time) row.time = item.time;
    if (item.location) row.location = item.location;
    return row;
  });
}

async function writeList(items: CmsEvent[]) {
  await setDoc(
    eventsDoc(),
    {
      items: toFirestoreItems(items),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function readList(): Promise<CmsEvent[]> {
  try {
    const snap = await getDoc(eventsDoc());
    if (snap.exists()) {
      const data = snap.data() as { items?: unknown[] };
      // An existing doc with an empty list means the admin deleted every
      // event on purpose — don't fall back to defaults.
      if (Array.isArray(data.items)) {
        return data.items.length ? normalizeList(data.items) : [];
      }
    }
  } catch (error) {
    console.error("Firestore read failed for events", error);
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
  await writeList([nextItem, ...without]);
  return id;
}

export async function deleteEvent(id: string) {
  const current = await listEvents();
  await writeList(current.filter((item) => item.id !== id));
}

/**
 * One-time migration: copy the current events (legacy Blob JSON or the
 * hardcoded defaults) into Firestore if the `pages/events` document has never
 * been written. Safe to call repeatedly.
 */
export async function seedEventsIfEmpty(): Promise<boolean> {
  try {
    const snap = await getDoc(eventsDoc());
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
      ? await listEvents()
      : normalizeList(await fetchContentJson<unknown>("events"));
  await writeList(current);
  return true;
}
