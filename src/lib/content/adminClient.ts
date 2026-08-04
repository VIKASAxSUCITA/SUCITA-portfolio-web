export async function adminPutContent<T>(collection: string, data: T) {
  const { getFirebaseAuth } = await import("@/lib/firebase/client");
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("Please sign in again before saving.");
  }

  const idToken = await user.getIdToken();
  const res = await fetch("/api/admin/content", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ collection, data }),
  });

  const payload = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(payload.error || "Save failed.");
  }
}

export async function fetchContentJson<T>(collection: string): Promise<T | null> {
  const res = await fetch(`/api/content?collection=${collection}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export type UploadFolder = "partner" | "client" | "insight" | "event";

export async function adminUploadFile(
  file: File,
  options?: { folder?: UploadFolder }
): Promise<string> {
  const { getFirebaseAuth } = await import("@/lib/firebase/client");
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("Please sign in again before uploading.");
  }

  const idToken = await user.getIdToken();
  const form = new FormData();
  form.append("file", file);
  if (options?.folder) {
    form.append("folder", options.folder);
  }

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    body: form,
  });

  const payload = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };
  if (!res.ok || !payload.url) {
    throw new Error(payload.error || "Upload failed.");
  }
  return payload.url;
}

export async function adminDeleteBlobUrls(urls: string[]): Promise<void> {
  const unique = [...new Set(urls.map((url) => url.trim()).filter(Boolean))];
  if (unique.length === 0) return;

  const { getFirebaseAuth } = await import("@/lib/firebase/client");
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("Please sign in again before deleting.");
  }

  const idToken = await user.getIdToken();
  const res = await fetch("/api/admin/blob", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ urls: unique }),
  });

  const payload = (await res.json().catch(() => ({}))) as {
    error?: string;
    deleted?: number;
    missing?: boolean;
  };
  if (!res.ok) {
    throw new Error(payload.error || "Could not delete blob file(s).");
  }
}


