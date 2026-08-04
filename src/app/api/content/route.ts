import { NextResponse } from "next/server";
import { readContentJson } from "@/lib/content/blobJson";
import { defaultHomeContent } from "@/lib/content/homeDefaults";
import { siteConfig } from "@/data/site";
import { serviceCategories } from "@/data/services";
import { insights as defaultInsights } from "@/data/insights";
import { events as defaultEvents } from "@/data/events";
import type { CmsInsight, CmsEvent } from "@/lib/content/types";
import type { ServiceCategory } from "@/data/services";
import { readLogoGroup } from "@/lib/content/logosStore";

export const runtime = "nodejs";

const PATHS = {
  home: "sucita/content/home.json",
  site: "sucita/content/site.json",
  services: "sucita/content/services.json",
  insights: "sucita/content/insights.json",
  events: "sucita/content/events.json",
  logos: "sucita/content/logos.json",
} as const;

type Collection = keyof typeof PATHS;

export async function GET(request: Request) {
  const collection = new URL(request.url).searchParams.get(
    "collection"
  ) as Collection | null;

  if (!collection || !(collection in PATHS)) {
    return NextResponse.json(
      {
        error:
          "Pass ?collection=home|site|services|insights|events|logos",
      },
      { status: 400 }
    );
  }

  try {
    if (collection === "home") {
      return NextResponse.json(structuredClone(defaultHomeContent));
    }
    if (collection === "site") {
      return NextResponse.json({ ...siteConfig });
    }
    if (collection === "services") {
      const data = await readContentJson<{ categories?: ServiceCategory[] }>(
        PATHS.services
      );
      return NextResponse.json({
        categories: data?.categories?.length
          ? data.categories
          : serviceCategories,
      });
    }
    if (collection === "insights") {
      const data = await readContentJson<CmsInsight[]>(PATHS.insights);
      return NextResponse.json(
        Array.isArray(data) && data.length
          ? data
          : defaultInsights.map((item) => ({ ...item, id: item.slug }))
      );
    }
    if (collection === "logos") {
      const [partners, clients] = await Promise.all([
        readLogoGroup("partners"),
        readLogoGroup("clients"),
      ]);
      return NextResponse.json({ partners, clients });
    }
    const data = await readContentJson<CmsEvent[]>(PATHS.events);
    return NextResponse.json(
      Array.isArray(data) && data.length
        ? data
        : defaultEvents.map((item) => ({ ...item, id: item.slug }))
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not load content." },
      { status: 500 }
    );
  }
}
