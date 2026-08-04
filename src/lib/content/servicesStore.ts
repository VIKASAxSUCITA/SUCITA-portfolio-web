import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  serviceCategories as defaultServices,
  type ServiceCategory,
  type ServiceItem,
} from "@/data/services";
import {
  asLocalized,
  type LocalizedString,
} from "@/lib/i18n/config";
import { getFirebaseDb } from "@/lib/firebase/client";
import { readContentJson } from "./blobJson";

/** Legacy Blob JSON path — read-only fallback for content saved before Firestore. */
const LEGACY_BLOB_PATH = "sucita/content/services.json";

function servicesDoc() {
  return doc(getFirebaseDb(), "pages", "services");
}

function mergeLocalized(
  raw: unknown,
  fallback: string | LocalizedString | undefined,
  empty = ""
): LocalizedString {
  const base = asLocalized(fallback, empty);
  if (raw == null || raw === "") return base;
  if (typeof raw === "string") {
    // Plain English CMS value — keep default KM/ZH unless EN was customized
    if (raw === base.en) return base;
    return { en: raw, km: base.km, zh: base.zh };
  }
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    return {
      en: String(obj.en ?? base.en),
      km: String(obj.km ?? base.km),
      zh: String(obj.zh ?? base.zh),
    };
  }
  return base;
}

function normalizeItem(
  raw: unknown,
  fallback?: ServiceItem
): ServiceItem | null {
  if (!raw || typeof raw !== "object") return fallback ?? null;
  const item = raw as Record<string, unknown>;
  const label = mergeLocalized(item.label, fallback?.label);
  if (!label.en.trim()) return null;

  const fallbackChildren = fallback?.children ?? [];
  const rawChildren = Array.isArray(item.children)
    ? item.children
        .map((child, index) =>
          mergeLocalized(child, fallbackChildren[index])
        )
        .filter((child) => child.en.trim())
    : [];
  const children =
    rawChildren.length > 0
      ? rawChildren
      : fallbackChildren.map((child) => asLocalized(child));

  return children.length ? { label, children } : { label };
}

function normalizeCategory(
  raw: unknown,
  fallback?: ServiceCategory
): ServiceCategory | null {
  if (!raw || typeof raw !== "object") return fallback ?? null;
  const cat = raw as Record<string, unknown>;
  const rawItems = Array.isArray(cat.items)
    ? cat.items
        .map((item, index) => normalizeItem(item, fallback?.items[index]))
        .filter((item): item is ServiceItem => !!item)
    : [];
  const items =
    rawItems.length > 0
      ? rawItems
      : (fallback?.items ?? []).map((item) => ({
          label: asLocalized(item.label),
          children: item.children?.map((c) => asLocalized(c)),
        }));

  return {
    id: String(cat.id ?? fallback?.id ?? "service"),
    letter: String(cat.letter ?? fallback?.letter ?? "A"),
    title: mergeLocalized(cat.title, fallback?.title, "Service"),
    description: mergeLocalized(cat.description, fallback?.description),
    bodyHtml: mergeLocalized(cat.bodyHtml, fallback?.bodyHtml, "<p></p>"),
    coverImage: String(cat.coverImage ?? fallback?.coverImage ?? ""),
    items,
  };
}

function normalizeCategories(raw: unknown): ServiceCategory[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return defaultServices.map((s) => ({
      ...s,
      title: asLocalized(s.title),
      description: asLocalized(s.description),
      bodyHtml: asLocalized(s.bodyHtml, "<p></p>"),
      coverImage: s.coverImage ?? "",
      items: s.items.map((item) => ({
        label: asLocalized(item.label),
        children: item.children?.map((c) => asLocalized(c)),
      })),
    }));
  }
  return raw
    .map((item, index) => {
      const id =
        item && typeof item === "object"
          ? String((item as { id?: unknown }).id ?? "")
          : "";
      const fallback =
        defaultServices.find((s) => s.id === id) ?? defaultServices[index];
      return normalizeCategory(item, fallback);
    })
    .filter((item): item is ServiceCategory => !!item);
}

/** Firestore rejects `undefined` field values — emit plain objects only. */
function toFirestoreCategories(categories: ServiceCategory[]) {
  return categories.map((cat) => ({
    id: cat.id,
    letter: cat.letter,
    title: asLocalized(cat.title),
    description: asLocalized(cat.description),
    bodyHtml: asLocalized(cat.bodyHtml, "<p></p>"),
    coverImage: cat.coverImage ?? "",
    items: cat.items.map((item) => {
      const row: Record<string, unknown> = {
        label: asLocalized(item.label),
      };
      if (item.children?.length) {
        row.children = item.children.map((c) => asLocalized(c));
      }
      return row;
    }),
  }));
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const snap = await getDoc(servicesDoc());
    if (snap.exists()) {
      const data = snap.data() as { categories?: unknown[] };
      if (Array.isArray(data.categories) && data.categories.length) {
        return normalizeCategories(data.categories);
      }
    }
  } catch (error) {
    console.error("Firestore read failed for services", error);
  }

  // Legacy fallback: content saved to Blob JSON before the Firestore migration
  if (typeof window === "undefined") {
    try {
      const data = await readContentJson<{ categories?: unknown[] }>(
        LEGACY_BLOB_PATH
      );
      return normalizeCategories(data?.categories);
    } catch {
      return normalizeCategories(null);
    }
  }
  return normalizeCategories(null);
}

export async function saveServiceCategories(categories: ServiceCategory[]) {
  const normalized = normalizeCategories(categories);
  await setDoc(
    servicesDoc(),
    {
      categories: toFirestoreCategories(normalized),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
