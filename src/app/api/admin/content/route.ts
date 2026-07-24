import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/verifyFirebaseIdToken";
import { writeContentJson } from "@/lib/content/blobJson";
import type { HomePageContent } from "@/lib/content/homeTypes";
import type { SiteContent, CmsInsight, CmsEvent } from "@/lib/content/types";
import type { ServiceCategory } from "@/data/services";

export const runtime = "nodejs";

const PATHS = {
  home: "sucita/content/home.json",
  site: "sucita/content/site.json",
  services: "sucita/content/services.json",
  insights: "sucita/content/insights.json",
  events: "sucita/content/events.json",
} as const;

type Collection = keyof typeof PATHS;

type Body =
  | { collection: "home"; data: HomePageContent }
  | { collection: "site"; data: SiteContent }
  | { collection: "services"; data: { categories: ServiceCategory[] } }
  | { collection: "insights"; data: CmsInsight[] }
  | { collection: "events"; data: CmsEvent[] };

function isCollection(value: unknown): value is Collection {
  return typeof value === "string" && value in PATHS;
}

export async function PUT(request: Request) {
  const user = await requireAdminFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { error: "Please sign in again before saving." },
      { status: 401 }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isCollection(body.collection) || body.data == null) {
    return NextResponse.json(
      { error: "Expected { collection, data }." },
      { status: 400 }
    );
  }

  try {
    const url = await writeContentJson(PATHS[body.collection], body.data);
    return NextResponse.json({ ok: true, url, savedBy: user.email ?? user.localId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not save content.",
      },
      { status: 500 }
    );
  }
}
