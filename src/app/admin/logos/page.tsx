"use client";

import { useEffect, useRef, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import {
  getLogosContent,
  saveLogosContent,
  type LogosContent,
} from "@/lib/content/logosStore";
import { adminUploadFile } from "@/lib/content/adminClient";
import type { BrandLogo } from "@/data/partners";

type LogoGroup = "partners" | "clients";

function LogoGrid({
  title,
  hint,
  items,
  onAdd,
  onDelete,
  uploading,
  disabled,
}: {
  title: string;
  hint: string;
  items: BrandLogo[];
  onAdd: (file: File) => Promise<void>;
  onDelete: (id: string) => void;
  uploading?: boolean;
  disabled?: boolean;
}) {
  const locked = Boolean(disabled || uploading);
  return (
    <section className="admin-cms-panel admin-logos-section">
      <div className="admin-logos-head">
        <div>
          <h2 className="admin-logos-title">{title}</h2>
          <p className="admin-logos-hint">{hint}</p>
        </div>
        <label className="admin-btn admin-btn-secondary admin-logos-add">
          {uploading ? "Uploading…" : "+ Add image"}
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={locked}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void onAdd(file);
            }}
          />
        </label>
      </div>

      {items.length === 0 ? (
        <p className="admin-cms-empty">No logos yet.</p>
      ) : (
        <ul className="admin-logos-grid list-unstyled">
          {items.map((item) => (
            <li key={item.id} className="admin-logos-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.logo} alt="" loading="lazy" />
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-logos-delete"
                onClick={() => onDelete(item.id)}
                disabled={locked}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function AdminLogosPage() {
  const [content, setContent] = useState<LogosContent>({
    partners: [],
    clients: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingGroup, setUploadingGroup] = useState<LogoGroup | null>(null);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const ready = useRef(false);

  useEffect(() => {
    void (async () => {
      try {
        setContent(await getLogosContent());
      } finally {
        setLoading(false);
        ready.current = true;
      }
    })();
  }, []);

  function update(updater: (prev: LogosContent) => LogosContent) {
    setContent(updater);
    if (ready.current) {
      setDirty(true);
      setMessage("");
    }
  }

  async function handleAdd(group: LogoGroup, file: File) {
    setUploadingGroup(group);
    setMessage("");
    try {
      const logo = await adminUploadFile(file);
      const id = `${group.slice(0, 1)}_${Date.now().toString(36)}`;
      update((prev) => ({
        ...prev,
        [group]: [{ id, name: "Logo", logo }, ...prev[group]],
      }));
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Could not add that image."
      );
    } finally {
      setUploadingGroup(null);
    }
  }

  function handleDelete(group: LogoGroup, id: string) {
    const confirmed = window.confirm(
      "Remove this logo? Click Save to publish."
    );
    if (!confirmed) return;
    update((prev) => ({
      ...prev,
      [group]: prev[group].filter((item) => item.id !== id),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await saveLogosContent(content);
      setDirty(false);
      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <AdminShell
        pageTitle="Partners & Clients"
        onSave={() => void handleSave()}
        saving={saving}
        dirty={dirty}
        message={message}
      >
        <div className="admin-cms admin-logos-page">
          {loading ? (
            <p className="admin-cms-empty">Loading logos…</p>
          ) : (
            <>
              <p className="admin-logos-intro">
                Upload or remove partner and client logos (images only), then
                Save.
              </p>
              <LogoGrid
                title="Partners"
                hint="Shown in the Partners marquee on Home and Partners pages."
                items={content.partners}
                uploading={uploadingGroup === "partners"}
                disabled={saving || uploadingGroup === "clients"}
                onAdd={(file) => handleAdd("partners", file)}
                onDelete={(id) => handleDelete("partners", id)}
              />
              <LogoGrid
                title="Clients"
                hint="Shown in the Clients marquee on Home and Partners pages."
                items={content.clients}
                uploading={uploadingGroup === "clients"}
                disabled={saving || uploadingGroup === "partners"}
                onAdd={(file) => handleAdd("clients", file)}
                onDelete={(id) => handleDelete("clients", id)}
              />
            </>
          )}
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
