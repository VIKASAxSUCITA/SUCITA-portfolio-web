"use client";

import { useRef, useState } from "react";
import type { UploadFolder } from "@/lib/content/adminClient";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
};

export default function AdminImageField({
  label = "Image",
  value,
  onChange,
  folder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const { adminUploadFile } = await import("@/lib/content/adminClient");
      onChange(await adminUploadFile(file, { folder }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-image-field">
      <div className="admin-field">
        <span>{label}</span>
        <div className="admin-image-row">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="admin-image-preview" />
          ) : (
            <div className="admin-image-placeholder">No image</div>
          )}
          <div className="admin-image-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            {value ? (
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => onChange("")}
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
        {error ? <p className="admin-login-error">{error}</p> : null}
      </div>
    </div>
  );
}
