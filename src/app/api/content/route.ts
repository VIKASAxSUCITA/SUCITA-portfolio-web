import { NextResponse } from "next/server";
import { readContentJson } from "@/lib/content/blobJson";
import { defaultHomeContent } from "@/lib/content/homeDefaults";
import { siteConfig } from "@/data/site";
import { getServiceCategories } from "@/lib/content/servicesStore";
import { listInsights } from "@/lib/content/insightsStore";
import { listEvents } from "@/lib/content/eventsStore";
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
      // Services live in Firestore (pages/services); falls back internally.
      const categories = await getServiceCategories();
      return NextResponse.json({ categories });
    }
    if (collection === "insights") {
      // Insights live in Firestore (pages/insights); falls back internally.
      return NextResponse.json(await listInsights());
    }
    if (collection === "logos") {
      const [partners, clients] = await Promise.all([
        readLogoGroup("partners"),
        readLogoGroup("clients"),
      ]);
      return NextResponse.json({ partners, clients });
    }
    // Events live in Firestore (pages/events); falls back internally.
    return NextResponse.json(await listEvents());
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not load content." },
      { status: 500 }
    );
  }
}
