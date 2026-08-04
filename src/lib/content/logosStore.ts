import type { BrandLogo } from "@/data/partners";
import { readContentJson } from "./blobJson";
import { adminPutContent, fetchContentJson } from "./adminClient";

const PATH = "sucita/content/logos.json";

export type LogosContent = {
  partners: BrandLogo[];
  clients: BrandLogo[];
};

const empty: LogosContent = { partners: [], clients: [] };

function normalizeItem(raw: unknown, index: number, prefix: string): BrandLogo | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const logo = String(item.logo ?? "").trim();
  if (!logo) return null;
  return {
    id: String(item.id ?? `${prefix}-${index}`),
    name: String(item.name ?? "Logo"),
    logo,
    href: item.href ? String(item.href) : undefined,
  };
}

function normalize(raw: unknown): LogosContent {
  if (!raw || typeof raw !== "object") return structuredClone(empty);
  const data = raw as Record<string, unknown>;
  const partners = Array.isArray(data.partners)
    ? data.partners
        .map((item, i) => normalizeItem(item, i, "p"))
        .filter((item): item is BrandLogo => !!item)
    : [];
  const clients = Array.isArray(data.clients)
    ? data.clients
        .map((item, i) => normalizeItem(item, i, "c"))
        .filter((item): item is BrandLogo => !!item)
    : [];
  return { partners, clients };
}

async function readLogos(): Promise<LogosContent> {
  if (typeof window === "undefined") {
    return normalize(await readContentJson<unknown>(PATH));
  }
  return normalize(await fetchContentJson<unknown>("logos"));
}

export async function getLogosContent(): Promise<LogosContent> {
  try {
    return await readLogos();
  } catch {
    return structuredClone(empty);
  }
}

export async function getPublicPartners(): Promise<BrandLogo[]> {
  return (await getLogosContent()).partners;
}

export async function getPublicClients(): Promise<BrandLogo[]> {
  return (await getLogosContent()).clients;
}

export async function saveLogosContent(data: LogosContent) {
  await adminPutContent("logos", normalize(data));
}
