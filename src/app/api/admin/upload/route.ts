import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/verifyFirebaseIdToken";

export const runtime = "nodejs";

const UPLOAD_FOLDERS = {
  partner: "sucita/partner",
  client: "sucita/client",
  insight: "sucita/insight",
  event: "sucita/event",
} as const;

type UploadFolder = keyof typeof UPLOAD_FOLDERS;

function isUploadFolder(value: unknown): value is UploadFolder {
  return typeof value === "string" && value in UPLOAD_FOLDERS;
}

function safeFileName(name: string) {
  const base = name.split(/[/\\]/).pop() || "upload";
  return base.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 120) || "upload";
}

export async function POST(request: Request) {
  const user = await requireAdminFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { error: "Please sign in again before uploading." },
      { status: 401 }
    );
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN is not set. Add it in .env.local to upload images.",
      },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const folderRaw = form.get("folder");
  const prefix = isUploadFolder(folderRaw)
    ? UPLOAD_FOLDERS[folderRaw]
    : "sucita";

  const pathname = `${prefix}/${Date.now()}-${safeFileName(file.name)}`;
  const blob = await put(pathname, file, {
    access: "public",
    token,
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
