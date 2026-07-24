import { defaultHomeContent, mergeHomeContent } from "./homeDefaults";
import type { HomePageContent } from "./homeTypes";
import { readContentJson } from "./blobJson";
import { adminPutContent, fetchContentJson } from "./adminClient";

const PATH = "sucita/content/home.json";

export async function loadHomeContent(): Promise<HomePageContent> {
  try {
    if (typeof window === "undefined") {
      const data = await readContentJson<Partial<HomePageContent>>(PATH);
      return mergeHomeContent(data);
    }
    const data = await fetchContentJson<HomePageContent>("home");
    return mergeHomeContent(data);
  } catch {
    return structuredClone(defaultHomeContent);
  }
}

export async function saveHomeContent(content: HomePageContent) {
  await adminPutContent("home", content);
}
