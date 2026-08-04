import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/verifyFirebaseIdToken";

export const runtime = "nodejs";

function isVercelBlobUrl(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.endsWith(".blob.vercel-storage.com") ||
      host.endsWith(".blob.vercel-storage.com.")
    );
  } catch {
    return false;
  }
}

/** Normalize to a clean blob URL (no query/hash) for reliable deletes. */
function cleanBlobUrl(url: string) {
  const parsed = new URL(url.trim());
  return `${parsed.origin}${parsed.pathname}`;
}

export async function POST(request: Request) {
  const user = await requireAdminFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { error: "Please sign in again before deleting." },
      { status: 401 }
    );
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not set." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    urls?: unknown;
  } | null;

  const urls = Array.isArray(body?.urls)
    ? [
        ...new Set(
          body.urls
            .filter(
              (url): url is string =>
                typeof url === "string" && isVercelBlobUrl(url)
            )
            .map(cleanBlobUrl)
        ),
      ]
    : [];

  if (urls.length === 0) {
    return NextResponse.json(
      { error: "No valid Vercel Blob URLs to delete.", deleted: 0 },
      { status: 400 }
    );
  }

  try {
    await del(urls, { token });
    return NextResponse.json({ ok: true, deleted: urls.length, urls });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Already deleted manually in the Blob UI
    if (/not found|does not exist|404/i.test(message)) {
      return NextResponse.json({
        ok: true,
        deleted: urls.length,
        urls,
        missing: true,
      });
    }
    console.error("Blob delete failed", error);
    return NextResponse.json(
      {
        error: message || "Could not delete blob file(s).",
        deleted: 0,
      },
      { status: 500 }
    );
  }
}
