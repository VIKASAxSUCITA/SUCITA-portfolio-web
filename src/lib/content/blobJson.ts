import { get, put } from "@vercel/blob";

function blobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add it in .env.local to save content."
    );
  }
  return token;
}

async function streamToJson<T>(stream: ReadableStream<Uint8Array>): Promise<T> {
  const text = await new Response(stream).text();
  return JSON.parse(text) as T;
}

/**
 * Read CMS JSON by pathname.
 * Uses get() (no list) so we don't burn Vercel Blob Advanced Operations quota.
 */
export async function readContentJson<T>(pathname: string): Promise<T | null> {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return null;

    const result = await get(pathname, {
      access: "public",
      token,
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    return await streamToJson<T>(result.stream);
  } catch (error) {
    console.error(`Failed to read ${pathname}`, error);
    return null;
  }
}

export async function writeContentJson(pathname: string, data: unknown) {
  const blob = await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    token: blobToken(),
  });
  return blob.url;
}
