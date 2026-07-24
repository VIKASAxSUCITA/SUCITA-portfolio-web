"use client";

import { useRef, useState } from "react";

type EditableImageProps = {
  src: string;
  onChange: (src: string) => void;
  alt?: string;
  className?: string;
};

export default function EditableImage({
  src,
  onChange,
  alt = "",
  className = "",
}: EditableImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const { adminUploadFile } = await import("@/lib/content/adminClient");
      onChange(await adminUploadFile(file));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <button
      type="button"
      className={`admin-editable-image ${className}`.trim()}
      onClick={() => inputRef.current?.click()}
      title="Click to change image"
      disabled={uploading}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      <span className="admin-editable-image-hint">
        {uploading ? "Uploading…" : "Change image"}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </button>
  );
}
