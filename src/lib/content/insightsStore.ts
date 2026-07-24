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
import {
  insights as defaultInsights,
  insightCategories,
  type Insight,
  type InsightCategory,
  type InsightType,
} from "@/data/insights";
import { slugify } from "./slug";
import type { CmsInsight } from "./types";

const PAGE = ["pages", "insights"] as const;
const ENTRIES = "entries";

function entriesCol() {
  return collection(getFirebaseDb(), ...PAGE, ENTRIES);
}

function entryRef(id: string) {
  return doc(getFirebaseDb(), ...PAGE, ENTRIES, id);
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

  return {
    id,
    slug,
    type,
    title,
    excerpt: String(raw.excerpt ?? ""),
    content,
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

export async function listInsights(): Promise<CmsInsight[]> {
  try {
    const snap = await getDocs(entriesCol());
    if (snap.empty) {
      return defaultInsights.map((item, index) => ({
        ...item,
        id: item.slug || `default-${index}`,
      }));
    }
    return snap.docs
      .map((d) => normalize(d.data() as Record<string, unknown>, d.id))
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  } catch {
    return defaultInsights.map((item, index) => ({
      ...item,
      id: item.slug || `default-${index}`,
    }));
  }
}

export async function getPublicInsights(): Promise<Insight[]> {
  const items = await listInsights();
  return items.map(toInsight);
}

export async function getPublicInsightBySlug(
  slug: string
): Promise<Insight | undefined> {
  const items = await getPublicInsights();
  return items.find((item) => item.slug === slug);
}

export async function getInsightById(id: string): Promise<CmsInsight | null> {
  const snap = await getDoc(entryRef(id));
  if (!snap.exists()) return null;
  return normalize(snap.data() as Record<string, unknown>, snap.id);
}

export async function saveInsight(
  input: Omit<CmsInsight, "id"> & { id?: string }
): Promise<string> {
  const id = input.id || slugify(input.title) || `insight-${Date.now()}`;
  const payload = {
    slug: input.slug || slugify(input.title) || id,
    type: input.type,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    publishedAt: input.publishedAt,
    coverImage: input.coverImage,
    galleryImages: input.galleryImages ?? [],
    client: input.client || "",
    service: input.service || "",
    updatedAt: serverTimestamp(),
  };
  await setDoc(entryRef(id), payload, { merge: true });
  await setDoc(
    doc(getFirebaseDb(), ...PAGE),
    { entriesReady: true, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return id;
}

export async function deleteInsight(id: string) {
  await deleteDoc(entryRef(id));
}

/** Seed defaults into Firestore once (admin helper). */
export async function seedInsightsIfEmpty() {
  const snap = await getDocs(entriesCol());
  if (!snap.empty) return false;
  for (const item of defaultInsights) {
    await saveInsight({ ...item, id: item.slug });
  }
  return true;
}
