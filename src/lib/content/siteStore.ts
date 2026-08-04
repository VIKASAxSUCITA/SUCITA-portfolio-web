import { siteConfig as defaultSite } from "@/data/site";
import type { SiteContent } from "./types";

/** Site contact/footer copy is static in code (`src/data/site`). Not stored in Blob. */
export async function getSiteContent(): Promise<SiteContent> {
  return { ...defaultSite };
}

export function getSiteConfig(): SiteContent {
  return { ...defaultSite };
}
