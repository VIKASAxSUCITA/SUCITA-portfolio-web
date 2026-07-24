import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/verifyFirebaseIdToken";

export const runtime = "nodejs";

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

  const blob = await put(`sucita/${Date.now()}-${file.name}`, file, {
    access: "public",
    token,
  });

  return NextResponse.json({ url: blob.url });
}
