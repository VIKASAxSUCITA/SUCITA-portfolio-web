"use client";

import { useRef, useState } from "react";
import type { UploadFolder } from "@/lib/content/adminClient";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: UploadFolder;
};

export default function ComposerGalleryImages({
  images,
  onChange,
  folder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  /** Index being replaced, or null to append a new image. */
  const targetIndex = useRef<number | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const { adminUploadFile } = await import("@/lib/content/adminClient");
      const url = await adminUploadFile(file, { folder });
      const index = targetIndex.current;
      onChange(
        index === null
          ? [...images, url]
          : images.map((img, i) => (i === index ? url : img))
      );
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      targetIndex.current = null;
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function pick(index: number | null) {
    if (uploading) return;
    targetIndex.current = index;
    inputRef.current?.click();
  }

  return (
    <div className="admin-gallery">
      <div className="admin-gallery-grid">
        {images.map((src, index) => (
          <div key={`${src}-${index}`} className="admin-gallery-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" />
            <div className="admin-article-image-actions">
              <button
                type="button"
                className="admin-article-image-btn"
                disabled={uploading}
                onClick={() => pick(index)}
              >
                {uploading ? "Uploading…" : "Change"}
              </button>
              <button
                type="button"
                className="admin-article-image-btn is-danger"
                disabled={uploading}
                onClick={() => onChange(images.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="admin-gallery-add"
          disabled={uploading}
          onClick={() => pick(null)}
        >
          {uploading ? "Uploading…" : "+ Add image"}
        </button>
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
