import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import {
  serviceCategories as defaultServices,
  type ServiceCategory,
  type ServiceItem,
} from "@/data/services";

const REF = ["pages", "services"] as const;

function normalizeItem(raw: unknown): ServiceItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const label = String(item.label ?? "").trim();
  if (!label) return null;
  const children = Array.isArray(item.children)
    ? item.children.map(String).map((s) => s.trim()).filter(Boolean)
    : undefined;
  return children?.length ? { label, children } : { label };
}

function normalizeCategory(raw: unknown, fallback?: ServiceCategory): ServiceCategory | null {
  if (!raw || typeof raw !== "object") return fallback ?? null;
  const cat = raw as Record<string, unknown>;
  const items = Array.isArray(cat.items)
    ? cat.items.map(normalizeItem).filter((item): item is ServiceItem => !!item)
    : fallback?.items ?? [];
  return {
    id: String(cat.id ?? fallback?.id ?? "service"),
    letter: String(cat.letter ?? fallback?.letter ?? "A"),
    title: String(cat.title ?? fallback?.title ?? "Service"),
    description: String(cat.description ?? fallback?.description ?? ""),
    items,
  };
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const snap = await getDoc(doc(getFirebaseDb(), ...REF));
    if (!snap.exists()) return defaultServices.map((s) => ({ ...s }));
    const data = snap.data() as { categories?: unknown[] };
    if (!Array.isArray(data.categories) || data.categories.length === 0) {
      return defaultServices.map((s) => ({ ...s }));
    }
    return data.categories
      .map((item, index) => normalizeCategory(item, defaultServices[index]))
      .filter((item): item is ServiceCategory => !!item);
  } catch {
    return defaultServices.map((s) => ({ ...s }));
  }
}

export async function saveServiceCategories(categories: ServiceCategory[]) {
  await setDoc(
    doc(getFirebaseDb(), ...REF),
    { categories, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
