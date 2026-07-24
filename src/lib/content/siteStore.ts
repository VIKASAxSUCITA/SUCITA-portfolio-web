import { siteConfig as defaultSite } from "@/data/site";
import type { SiteContent } from "./types";
import { readContentJson } from "./blobJson";
import { adminPutContent, fetchContentJson } from "./adminClient";

const PATH = "sucita/content/site.json";

function normalize(data: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    name: String(data?.name ?? defaultSite.name),
    tagline: String(data?.tagline ?? defaultSite.tagline),
    email: String(data?.email ?? defaultSite.email),
    phone: String(data?.phone ?? defaultSite.phone),
    whatsapp: String(data?.whatsapp ?? defaultSite.whatsapp),
    telegram: String(data?.telegram ?? defaultSite.telegram),
    officeHours: String(data?.officeHours ?? defaultSite.officeHours),
    address: String(data?.address ?? defaultSite.address),
    footerCopy: String(data?.footerCopy ?? defaultSite.footerCopy),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    if (typeof window === "undefined") {
      return normalize(await readContentJson<Partial<SiteContent>>(PATH));
    }
    return normalize(await fetchContentJson<Partial<SiteContent>>("site"));
  } catch {
    return { ...defaultSite };
  }
}

export async function saveSiteContent(content: SiteContent) {
  await adminPutContent("site", normalize(content));
}
