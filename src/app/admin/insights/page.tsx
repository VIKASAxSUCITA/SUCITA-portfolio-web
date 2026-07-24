"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AdminImageField from "@/components/admin/AdminImageField";
import {
  deleteInsight,
  listInsights,
  saveInsight,
  seedInsightsIfEmpty,
} from "@/lib/content/insightsStore";
import { slugify } from "@/lib/content/slug";
import { insightCategories, type InsightCategory, type InsightType } from "@/data/insights";
import type { CmsInsight } from "@/lib/content/types";

const emptyForm = (): Omit<CmsInsight, "id"> & { id?: string } => ({
  slug: "",
  type: "article",
  title: "",
  excerpt: "",
  content: [],
  category: "Accounting & Tax",
  publishedAt: new Date().toISOString().slice(0, 10),
  coverImage: "",
  galleryImages: [],
  client: "",
  service: "",
});

export default function AdminInsightsPage() {
  const [items, setItems] = useState<CmsInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<(Omit<CmsInsight, "id"> & { id?: string }) | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [contentText, setContentText] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      const data = await listInsights();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
    [items]
  );

  function openCreate() {
    const form = emptyForm();
    setEditing(form);
    setContentText("");
    setMessage("");
  }

  function openEdit(item: CmsInsight) {
    setEditing({ ...item });
    setContentText(item.content.join("\n\n"));
    setMessage("");
  }

  async function handleSeed() {
    setMessage("Importing defaults…");
    const seeded = await seedInsightsIfEmpty();
    setMessage(seeded ? "Default insights imported." : "Insights already exist.");
    await refresh();
  }

  async function handleDelete(item: CmsInsight) {
    if (!confirm(`Delete “${item.title}”?`)) return;
    await deleteInsight(item.id);
    if (item.coverImage.includes("blob.vercel-storage.com")) {
      await fetch("/api/admin/blob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [item.coverImage] }),
      });
    }
    setMessage("Deleted.");
    await refresh();
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage("");
    try {
      const paragraphs = contentText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      await saveInsight({
        ...editing,
        slug: editing.slug || slugify(editing.title),
        content: paragraphs,
      });
      setMessage("Saved.");
      setEditing(null);
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <AdminShell
        title="Insights"
        actions={
          <>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={handleSeed}>
              Import defaults
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
              + Add insight
            </button>
          </>
        }
      >
        {message ? <p className="admin-toast">{message}</p> : null}

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sorted.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title}</strong>
                      <div className="admin-muted">{item.type}</div>
                    </td>
                    <td>{item.category}</td>
                    <td>{item.publishedAt}</td>
                    <td className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => void handleDelete(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editing ? (
          <div className="admin-modal-backdrop" role="presentation">
            <div className="admin-modal" role="dialog" aria-modal="true">
              <div className="admin-modal-head">
                <h2>{editing.id ? "Edit insight" : "Add insight"}</h2>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={() => setEditing(null)}
                >
                  Close
                </button>
              </div>
              <form className="admin-form" onSubmit={handleSave}>
                <label className="admin-field">
                  <span>Title</span>
                  <input
                    required
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        title: e.target.value,
                        slug: editing.id ? editing.slug : slugify(e.target.value),
                      })
                    }
                  />
                </label>
                <div className="admin-form-row">
                  <label className="admin-field">
                    <span>Type</span>
                    <select
                      value={editing.type}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          type: e.target.value as InsightType,
                        })
                      }
                    >
                      <option value="article">Article</option>
                      <option value="project">Project</option>
                    </select>
                  </label>
                  <label className="admin-field">
                    <span>Category</span>
                    <select
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          category: e.target.value as InsightCategory,
                        })
                      }
                    >
                      {insightCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="admin-field">
                    <span>Published date</span>
                    <input
                      type="date"
                      required
                      value={editing.publishedAt}
                      onChange={(e) =>
                        setEditing({ ...editing, publishedAt: e.target.value })
                      }
                    />
                  </label>
                </div>
                <label className="admin-field">
                  <span>Short excerpt</span>
                  <textarea
                    rows={3}
                    required
                    value={editing.excerpt}
                    onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  <span>Full content (separate paragraphs with a blank line)</span>
                  <textarea
                    rows={8}
                    required
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                  />
                </label>
                {editing.type === "project" ? (
                  <div className="admin-form-row">
                    <label className="admin-field">
                      <span>Client</span>
                      <input
                        value={editing.client ?? ""}
                        onChange={(e) =>
                          setEditing({ ...editing, client: e.target.value })
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span>Service</span>
                      <input
                        value={editing.service ?? ""}
                        onChange={(e) =>
                          setEditing({ ...editing, service: e.target.value })
                        }
                      />
                    </label>
                  </div>
                ) : null}
                <AdminImageField
                  label="Cover image"
                  value={editing.coverImage}
                  onChange={(url) => setEditing({ ...editing, coverImage: url })}
                />
                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save insight"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </AdminShell>
    </AdminGuard>
  );
}
