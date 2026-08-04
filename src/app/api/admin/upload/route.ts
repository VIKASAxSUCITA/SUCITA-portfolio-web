import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/verifyFirebaseIdToken";

export const runtime = "nodejs";

const LOGO_FOLDERS = {
  partner: "sucita/partner",
  client: "sucita/client",
} as const;

type LogoFolder = keyof typeof LOGO_FOLDERS;

function isLogoFolder(value: unknown): value is LogoFolder {
  return value === "partner" || value === "client";
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
  const prefix = isLogoFolder(folderRaw)
    ? LOGO_FOLDERS[folderRaw]
    : "sucita";

  const pathname = `${prefix}/${Date.now()}-${safeFileName(file.name)}`;
  const blob = await put(pathname, file, {
    access: "public",
    token,
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
