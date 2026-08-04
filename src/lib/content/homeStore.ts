import { defaultHomeContent } from "./homeDefaults";
import type { HomePageContent } from "./homeTypes";

/** Home copy is static in code (`homeDefaults` / `src/data`). Not stored in Blob. */
export async function loadHomeContent(): Promise<HomePageContent> {
  return structuredClone(defaultHomeContent);
}

export function getHomeContent(): HomePageContent {
  return structuredClone(defaultHomeContent);
}
