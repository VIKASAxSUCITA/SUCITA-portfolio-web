import { list, put } from "@vercel/blob";

function blobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add it in .env.local to save content."
    );
  }
  return token;
}

export async function readContentJson<T>(pathname: string): Promise<T | null> {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return null;

    const { blobs } = await list({ prefix: pathname, token, limit: 20 });
    const match =
      blobs.find((item) => item.pathname === pathname) ??
      blobs.find((item) => item.pathname.startsWith(pathname));
    if (!match) return null;

    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
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
    token: blobToken(),
  });
  return blob.url;
}
