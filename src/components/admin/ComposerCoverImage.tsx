"use client";

import { useRef, useState } from "react";
import type { UploadFolder } from "@/lib/content/adminClient";

type Props = {
  src: string;
  onChange: (src: string) => void;
  onRemove?: () => void;
  folder?: UploadFolder;
};

export default function ComposerCoverImage({
  src,
  onChange,
  onRemove,
  folder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const { adminUploadFile } = await import("@/lib/content/adminClient");
      onChange(await adminUploadFile(file, { folder }));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`admin-article-image${src ? "" : " is-empty"}`}
      onClick={() => {
        if (!uploading) inputRef.current?.click();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      aria-label="Change cover image"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" />
      ) : (
        <div className="admin-article-image-placeholder">
          {uploading ? "Uploading…" : "Click to add cover image"}
        </div>
      )}
      <div
        className="admin-article-image-actions"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="admin-article-image-btn"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Change"}
        </button>
        {src && onRemove ? (
          <button
            type="button"
            className="admin-article-image-btn is-danger"
            disabled={uploading}
            onClick={onRemove}
          >
            Remove
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
