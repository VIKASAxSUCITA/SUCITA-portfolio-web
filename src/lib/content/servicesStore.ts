import {
  serviceCategories as defaultServices,
  type ServiceCategory,
  type ServiceItem,
} from "@/data/services";
import {
  asLocalized,
  type LocalizedString,
} from "@/lib/i18n/config";
import { readContentJson } from "./blobJson";
import { adminPutContent, fetchContentJson } from "./adminClient";

const PATH = "sucita/content/services.json";

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
  const children = Array.isArray(item.children)
    ? item.children
        .map((child, index) =>
          mergeLocalized(child, fallbackChildren[index])
        )
        .filter((child) => child.en.trim())
    : fallbackChildren.map((child) => asLocalized(child));

  return children.length ? { label, children } : { label };
}

function normalizeCategory(
  raw: unknown,
  fallback?: ServiceCategory
): ServiceCategory | null {
  if (!raw || typeof raw !== "object") return fallback ?? null;
  const cat = raw as Record<string, unknown>;
  const items = Array.isArray(cat.items)
    ? cat.items
        .map((item, index) => normalizeItem(item, fallback?.items[index]))
        .filter((item): item is ServiceItem => !!item)
    : (fallback?.items ?? []).map((item) => ({
        label: asLocalized(item.label),
        children: item.children?.map((c) => asLocalized(c)),
      }));

  return {
    id: String(cat.id ?? fallback?.id ?? "service"),
    letter: String(cat.letter ?? fallback?.letter ?? "A"),
    title: mergeLocalized(cat.title, fallback?.title, "Service"),
    description: mergeLocalized(cat.description, fallback?.description),
    items,
  };
}

function normalizeCategories(raw: unknown): ServiceCategory[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return defaultServices.map((s) => ({
      ...s,
      title: asLocalized(s.title),
      description: asLocalized(s.description),
      items: s.items.map((item) => ({
        label: asLocalized(item.label),
        children: item.children?.map((c) => asLocalized(c)),
      })),
    }));
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
    return normalizeCategories(null);
  }
}

export async function saveServiceCategories(categories: ServiceCategory[]) {
  await adminPutContent("services", {
    categories: normalizeCategories(categories),
  });
}
