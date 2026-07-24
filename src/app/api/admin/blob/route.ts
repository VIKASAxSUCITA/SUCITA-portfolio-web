import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isVercelBlobUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
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
    ? body.urls.filter(
        (url): url is string => typeof url === "string" && isVercelBlobUrl(url)
      )
    : [];

  if (urls.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  await del(urls, { token });
  return NextResponse.json({ deleted: urls.length });
}
