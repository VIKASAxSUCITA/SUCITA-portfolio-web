"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AdminImageField from "@/components/admin/AdminImageField";
import LocalizedTextField from "@/components/admin/LocalizedTextField";
import LocalizedRichTextField from "@/components/admin/LocalizedRichTextField";
import {
  deleteInsight,
  saveInsight,
} from "@/lib/content/insightsStore";
import { slugify } from "@/lib/content/slug";
import { asLocalized, pickLocalized } from "@/lib/i18n/config";
import {
  insightCategories,
  type InsightCategory,
  type InsightType,
} from "@/data/insights";
import type { CmsInsight } from "@/lib/content/types";

export type InsightFormState = Omit<CmsInsight, "id"> & { id?: string };

type Props = {
  initial: InsightFormState;
  mode: "create" | "edit";
};

export default function AdminInsightEditor({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<InsightFormState>({
    ...initial,
    title: asLocalized(initial.title),
    excerpt: asLocalized(initial.excerpt),
    bodyHtml: asLocalized(initial.bodyHtml, "<p></p>"),
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const titleEn = pickLocalized(form.title, "en");
      const id = await saveInsight({
        ...form,
        slug: form.slug || slugify(titleEn),
        title: asLocalized(form.title),
        excerpt: asLocalized(form.excerpt),
        bodyHtml: asLocalized(form.bodyHtml, "<p></p>"),
      });
      setMessage("Saved.");
      if (mode === "create") {
        router.replace(`/admin/insights/${id}/edit`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!window.confirm("Delete this insight?")) return;
    setSaving(true);
    try {
      await deleteInsight(form.id);
      router.push("/admin/insights");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <AdminShell title={mode === "create" ? "New insight" : "Edit insight"}>
        <p className="admin-lead">
          <Link href="/admin/insights">← Back to insights</Link>
        </p>
        {message ? <p className="admin-toast">{message}</p> : null}

        <form className="admin-form admin-editor-form" onSubmit={handleSubmit}>
          <LocalizedTextField
            label="Title"
            value={asLocalized(form.title)}
            onChange={(title) =>
              setForm((prev) => ({
                ...prev,
                title,
                slug: prev.id ? prev.slug : slugify(pickLocalized(title, "en")),
              }))
            }
          />

          <div className="admin-form-row">
            <label className="admin-field">
              <span>Type</span>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    type: e.target.value as InsightType,
                  }))
                }
              >
                <option value="article">Article</option>
                <option value="project">Project</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Category</span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value as InsightCategory,
                  }))
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
                value={form.publishedAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
                }
              />
            </label>
          </div>

          <LocalizedTextField
            label="Excerpt"
            multiline
            rows={3}
            value={asLocalized(form.excerpt)}
            onChange={(excerpt) => setForm((prev) => ({ ...prev, excerpt }))}
          />

          {form.type === "project" ? (
            <div className="admin-form-row">
              <label className="admin-field">
                <span>Client</span>
                <input
                  value={form.client ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, client: e.target.value }))
                  }
                />
              </label>
              <label className="admin-field">
                <span>Service</span>
                <input
                  value={form.service ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, service: e.target.value }))
                  }
                />
              </label>
            </div>
          ) : null}

          <AdminImageField
            label="Cover image"
            value={form.coverImage}
            onChange={(coverImage) => setForm((prev) => ({ ...prev, coverImage }))}
          />

          <LocalizedRichTextField
            label="Body"
            value={asLocalized(form.bodyHtml, "<p></p>")}
            onChange={(bodyHtml) => setForm((prev) => ({ ...prev, bodyHtml }))}
            placeholder="Write the insight article…"
          />

          <div className="admin-modal-actions">
            {mode === "edit" && form.id ? (
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => void handleDelete()}
                disabled={saving}
              >
                Delete
              </button>
            ) : null}
            <Link href="/admin/insights" className="admin-btn admin-btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save insight"}
            </button>
          </div>
        </form>
      </AdminShell>
    </AdminGuard>
  );
}
