import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { events as defaultEvents, type EventItem, type EventType } from "@/data/events";
import { slugify } from "./slug";
import type { CmsEvent } from "./types";

const PAGE = ["pages", "events"] as const;
const ENTRIES = "entries";

function entriesCol() {
  return collection(getFirebaseDb(), ...PAGE, ENTRIES);
}

function entryRef(id: string) {
  return doc(getFirebaseDb(), ...PAGE, ENTRIES, id);
}

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
    title,
    excerpt: String(raw.excerpt ?? ""),
    description,
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

export async function listEvents(): Promise<CmsEvent[]> {
  try {
    const snap = await getDocs(entriesCol());
    if (snap.empty) {
      return defaultEvents.map((item) => ({ ...item, id: item.slug }));
    }
    return snap.docs
      .map((d) => normalize(d.data() as Record<string, unknown>, d.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return defaultEvents.map((item) => ({ ...item, id: item.slug }));
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
  const snap = await getDoc(entryRef(id));
  if (!snap.exists()) return null;
  return normalize(snap.data() as Record<string, unknown>, snap.id);
}

export async function saveEvent(
  input: Omit<CmsEvent, "id"> & { id?: string }
): Promise<string> {
  const id = input.id || slugify(input.title) || `event-${Date.now()}`;
  await setDoc(
    entryRef(id),
    {
      slug: input.slug || slugify(input.title) || id,
      type: input.type,
      title: input.title,
      excerpt: input.excerpt,
      description: input.description,
      date: input.date,
      time: input.time || "",
      location: input.location || "",
      isUpcoming: input.isUpcoming,
      coverImage: input.coverImage,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  await setDoc(
    doc(getFirebaseDb(), ...PAGE),
    { entriesReady: true, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return id;
}

export async function deleteEvent(id: string) {
  await deleteDoc(entryRef(id));
}

export async function seedEventsIfEmpty() {
  const snap = await getDocs(entriesCol());
  if (!snap.empty) return false;
  for (const item of defaultEvents) {
    await saveEvent({ ...item, id: item.slug });
  }
  return true;
}
