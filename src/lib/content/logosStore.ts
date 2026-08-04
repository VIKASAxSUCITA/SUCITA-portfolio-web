import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  runTransaction,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import type { BrandLogo } from "@/data/partners";
import { getFirebaseDb } from "@/lib/firebase/client";

export type LogoGroup = "partners" | "clients";

export type LogosContent = {
  partners: BrandLogo[];
  clients: BrandLogo[];
};

function emptyContent(): LogosContent {
  return { partners: [], clients: [] };
}

function normalizeItem(
  raw: unknown,
  index: number,
  prefix: string
): BrandLogo | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const logo = String(item.logo ?? "").trim();
  if (!logo) return null;
  const normalized: BrandLogo = {
    id: String(item.id ?? `${prefix}-${index}`),
    name: String(item.name ?? "Logo"),
    logo,
  };
  const href = item.href ? String(item.href).trim() : "";
  if (href) normalized.href = href;
  return normalized;
}

/** Firestore rejects `undefined` field values — only keep defined keys. */
function toFirestoreItems(items: BrandLogo[]) {
  return items.map((item) => {
    const row: Record<string, string> = {
      id: item.id,
      name: item.name || "Logo",
      logo: item.logo,
    };
    if (item.href) row.href = item.href;
    return row;
  });
}

export function normalizeLogoList(
  raw: unknown,
  prefix: "p" | "c"
): BrandLogo[] {
  const list = Array.isArray(raw)
    ? raw
    : raw &&
        typeof raw === "object" &&
        Array.isArray((raw as { items?: unknown }).items)
      ? (raw as { items: unknown[] }).items
      : [];

  return list
    .map((item, i) => normalizeItem(item, i, prefix))
    .filter((item): item is BrandLogo => !!item);
}

/** Bust browser/CDN image cache when the list changes. */
export function bustLogoUrl(url: string, version: string | number) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("v", String(version));
    return parsed.toString();
  } catch {
    const join = url.includes("?") ? "&" : "?";
    return `${url}${join}v=${encodeURIComponent(String(version))}`;
  }
}

function groupPrefix(group: LogoGroup): "p" | "c" {
  return group === "partners" ? "p" : "c";
}

export function logoGroupDoc(group: LogoGroup) {
  return doc(getFirebaseDb(), "pages", group);
}

function itemsFromSnap(
  group: LogoGroup,
  data: Record<string, unknown> | undefined
): BrandLogo[] {
  if (!data) return [];
  const prefix = groupPrefix(group);
  const items = normalizeLogoList(data.items, prefix);
  const version =
    data.updatedAt &&
    typeof data.updatedAt === "object" &&
    "toMillis" in data.updatedAt &&
    typeof (data.updatedAt as { toMillis?: () => number }).toMillis === "function"
      ? (data.updatedAt as { toMillis: () => number }).toMillis()
      : Date.now();
  return items.map((item) => ({
    ...item,
    logo: bustLogoUrl(item.logo, `${item.id}-${version}`),
  }));
}

/** Read partners or clients from Firestore only (no Blob JSON fallback). */
export async function readLogoGroup(group: LogoGroup): Promise<BrandLogo[]> {
  try {
    const snap = await getDoc(logoGroupDoc(group));
    if (!snap.exists()) return [];
    return itemsFromSnap(group, snap.data() as Record<string, unknown>);
  } catch (error) {
    console.error(`Firestore read failed for ${group}`, error);
    return [];
  }
}

/** Live updates from Firestore — use in admin / client marquees. */
export function subscribeLogoGroup(
  group: LogoGroup,
  onChange: (items: BrandLogo[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    logoGroupDoc(group),
    (snap) => {
      if (!snap.exists()) {
        onChange([]);
        return;
      }
      onChange(itemsFromSnap(group, snap.data() as Record<string, unknown>));
    },
    (error) => {
      console.error(`Firestore listen failed for ${group}`, error);
      onError?.(error);
    }
  );
}

/** Write partners or clients list to Firestore only (never touches the other group). */
export async function writeLogoGroup(group: LogoGroup, items: BrandLogo[]) {
  const normalized = normalizeLogoList(items, groupPrefix(group));
  await setDoc(
    logoGroupDoc(group),
    {
      items: toFirestoreItems(normalized),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return normalized;
}

/** Append one logo using a transaction so concurrent uploads don't clobber. */
export async function appendLogoItem(group: LogoGroup, item: BrandLogo) {
  const ref = logoGroupDoc(group);
  const prefix = groupPrefix(group);
  return runTransaction(getFirebaseDb(), async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists()
      ? normalizeLogoList(snap.data()?.items, prefix)
      : [];
    const items = [item, ...current.filter((row) => row.id !== item.id)];
    tx.set(
      ref,
      { items: toFirestoreItems(items), updatedAt: serverTimestamp() },
      { merge: true }
    );
    return items;
  });
}

/** Remove one logo using a transaction. */
export async function removeLogoItem(group: LogoGroup, id: string) {
  const ref = logoGroupDoc(group);
  const prefix = groupPrefix(group);
  return runTransaction(getFirebaseDb(), async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists()
      ? normalizeLogoList(snap.data()?.items, prefix)
      : [];
    const items = current.filter((row) => row.id !== id);
    tx.set(
      ref,
      { items: toFirestoreItems(items), updatedAt: serverTimestamp() },
      { merge: true }
    );
    return items;
  });
}

export async function getLogosContent(): Promise<LogosContent> {
  try {
    const [partners, clients] = await Promise.all([
      readLogoGroup("partners"),
      readLogoGroup("clients"),
    ]);
    return { partners, clients };
  } catch {
    return emptyContent();
  }
}

export async function getPublicPartners(): Promise<BrandLogo[]> {
  return (await getLogosContent()).partners;
}

export async function getPublicClients(): Promise<BrandLogo[]> {
  return (await getLogosContent()).clients;
}

export function newLogoId(group: LogoGroup) {
  return `${group.slice(0, 1)}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
