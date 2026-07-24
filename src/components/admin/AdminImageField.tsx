"use client";

import { useRef, useState } from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
};

export default function AdminImageField({
  label = "Image",
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }
      onChange(data.url);
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
