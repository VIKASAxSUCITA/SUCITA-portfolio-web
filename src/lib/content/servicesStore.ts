import {
  serviceCategories as defaultServices,
  type ServiceCategory,
  type ServiceItem,
} from "@/data/services";
import { readContentJson } from "./blobJson";
import { adminPutContent, fetchContentJson } from "./adminClient";

const PATH = "sucita/content/services.json";

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

function normalizeCategory(
  raw: unknown,
  fallback?: ServiceCategory
): ServiceCategory | null {
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

function normalizeCategories(raw: unknown): ServiceCategory[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return defaultServices.map((s) => ({ ...s }));
  }
  return raw
    .map((item, index) => normalizeCategory(item, defaultServices[index]))
    .filter((item): item is ServiceCategory => !!item);
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    if (typeof window === "undefined") {
      const data = await readContentJson<{ categories?: unknown[] }>(PATH);
      return normalizeCategories(data?.categories);
    }
    const data = await fetchContentJson<{ categories?: unknown[] }>("services");
    return normalizeCategories(data?.categories);
  } catch {
    return defaultServices.map((s) => ({ ...s }));
  }
}

export async function saveServiceCategories(categories: ServiceCategory[]) {
  await adminPutContent("services", {
    categories: normalizeCategories(categories),
  });
}
