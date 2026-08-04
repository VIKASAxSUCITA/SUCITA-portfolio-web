"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import ComposerCoverImage from "@/components/admin/ComposerCoverImage";
import ComposerGalleryImages from "@/components/admin/ComposerGalleryImages";
import LocaleEditTabs from "@/components/admin/LocaleEditTabs";
import AutoTranslateButton from "@/components/admin/AutoTranslateButton";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  deleteInsight,
  saveInsight,
} from "@/lib/content/insightsStore";
import { slugify } from "@/lib/content/slug";
import { adminDeleteBlobUrls } from "@/lib/content/adminClient";
import { extractImageUrls } from "@/lib/content/richText";
import {
  asLocalized,
  pickLocalized,
  type Locale,
  type LocalizedString,
} from "@/lib/i18n/config";
import {
  insightCategories,
  type InsightCategory,
} from "@/data/insights";
import type { CmsInsight } from "@/lib/content/types";

export type InsightFormState = Omit<CmsInsight, "id"> & { id?: string };

type Props = {
  initial: InsightFormState;
  mode: "create" | "edit";
};

const TITLE_MAX = 120;

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 7h14M10 11v6M14 11v6M8 7l1-2h6l1 2M7 7l1 12h8l1-12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function setLocaleValue(
  value: string | LocalizedString,
  locale: Locale,
  next: string,
  fallback = ""
): LocalizedString {
  return { ...asLocalized(value, fallback), [locale]: next };
}

export default function AdminInsightEditor({ initial, mode }: Props) {
  const router = useRouter();
  const [editLocale, setEditLocale] = useState<Locale>("en");
  const [form, setForm] = useState<InsightFormState>({
    ...initial,
    title: asLocalized(initial.title),
    excerpt: asLocalized(initial.excerpt),
    bodyHtml: asLocalized(initial.bodyHtml, "<p></p>"),
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  /** Blob files replaced/removed in this session — deleted after a save. */
  const removedUrls = useRef<string[]>([]);

  const title = pickLocalized(form.title, editLocale);
  const excerpt = pickLocalized(form.excerpt, editLocale);
  const bodyHtml = pickLocalized(form.bodyHtml, editLocale, "<p></p>");

  const translateSources = useMemo(
    () => [
      { value: asLocalized(form.title) },
      { value: asLocalized(form.excerpt) },
      { value: asLocalized(form.bodyHtml, "<p></p>"), html: true },
    ],
    [form.title, form.excerpt, form.bodyHtml]
  );

  function patch(updater: (prev: InsightFormState) => InsightFormState) {
    setForm(updater);
    setDirty(true);
    setMessage("");
  }

  function handleBack() {
    if (dirty) {
      const ok = window.confirm(
        "You have unsaved changes. Leave without saving?"
      );
      if (!ok) return;
    }
    router.push("/admin/insights");
  }

  async function handleSave() {
    if (!pickLocalized(form.title, "en").trim()) {
      setMessage("Add an English title before saving.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const titleEn = pickLocalized(form.title, "en");
      await saveInsight({
        ...form,
        type: "article",
        publishedAt:
          mode === "create"
            ? new Date().toISOString().slice(0, 10)
            : form.publishedAt || new Date().toISOString().slice(0, 10),
        slug: form.slug || slugify(titleEn),
        title: asLocalized(form.title),
        excerpt: asLocalized(form.excerpt),
        bodyHtml: asLocalized(form.bodyHtml, "<p></p>"),
      });
      setDirty(false);
      // Clean up Blob files that were replaced or removed in this session.
      await adminDeleteBlobUrls(removedUrls.current).catch(() => {});
      removedUrls.current = [];
      router.push("/admin/insights");
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
      // Remove every Blob file this insight owned.
      await adminDeleteBlobUrls([
        ...removedUrls.current,
        form.coverImage,
        ...(form.galleryImages ?? []),
        ...extractImageUrls(form.bodyHtml),
      ]).catch(() => {});
      router.push("/admin/insights");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <AdminShell
        pageTitle="Insights"
        onBack={handleBack}
        onSave={() => void handleSave()}
        saving={saving}
        dirty={dirty}
        message={message}
        topbarTools={
          <>
            <LocaleEditTabs locale={editLocale} onChange={setEditLocale} />
            <AutoTranslateButton
              from={editLocale}
              sources={translateSources}
              disabled={saving}
              onTranslated={([titleNext, excerptNext, bodyNext]) => {
                patch((prev) => ({
                  ...prev,
                  title: titleNext ?? asLocalized(prev.title),
                  excerpt: excerptNext ?? asLocalized(prev.excerpt),
                  bodyHtml: bodyNext ?? asLocalized(prev.bodyHtml, "<p></p>"),
                }));
              }}
            />
            {mode === "edit" && form.id ? (
              <button
                type="button"
                className="admin-topbar-icon-btn is-danger"
                onClick={() => void handleDelete()}
                disabled={saving}
                aria-label="Delete insight"
                title="Delete"
              >
                <TrashIcon />
              </button>
            ) : null}
          </>
        }
      >
        <div className="admin-composer admin-composer--embedded">
          <div className="admin-composer-body">
            <article className="admin-composer-paper admin-composer-paper--form">
              <div className="admin-composer-slugline">
                {mode === "create" ? (
                  "New insight"
                ) : (
                  <>
                    Slug: <span>/insights/{form.slug || form.id}</span>
                  </>
                )}
              </div>

              <div className="admin-form-row">
                <div className="admin-form-label">
                  <label htmlFor="insight-title">Title</label>
                  <span>
                    {title.length}/{TITLE_MAX}
                  </span>
                </div>
                <textarea
                  id="insight-title"
                  className="admin-composer-title"
                  rows={2}
                  maxLength={TITLE_MAX}
                  value={title}
                  placeholder="Add a title…"
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      title: setLocaleValue(
                        prev.title,
                        editLocale,
                        e.target.value
                      ),
                      slug: prev.id
                        ? prev.slug
                        : slugify(
                            editLocale === "en"
                              ? e.target.value
                              : pickLocalized(prev.title, "en")
                          ),
                    }))
                  }
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-label">
                  <span>Image</span>
                </div>
                <ComposerCoverImage
                  folder="insight"
                  src={form.coverImage}
                  onChange={(coverImage) => {
                    if (form.coverImage && form.coverImage !== coverImage) {
                      removedUrls.current.push(form.coverImage);
                    }
                    patch((prev) => ({ ...prev, coverImage }));
                  }}
                  onRemove={() => {
                    if (form.coverImage) {
                      removedUrls.current.push(form.coverImage);
                    }
                    patch((prev) => ({ ...prev, coverImage: "" }));
                  }}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-label">
                  <span>Details</span>
                </div>
                <div className="admin-form-meta-grid">
                  <label className="admin-form-meta-field">
                    <span>Category</span>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        patch((prev) => ({
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
                  <label className="admin-form-meta-field admin-form-meta-field--wide">
                    <span>Excerpt</span>
                    <textarea
                      rows={2}
                      value={excerpt}
                      placeholder="Short summary…"
                      onChange={(e) =>
                        patch((prev) => ({
                          ...prev,
                          excerpt: setLocaleValue(
                            prev.excerpt,
                            editLocale,
                            e.target.value
                          ),
                        }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-label">
                  <span>Content</span>
                </div>
                <div className="admin-composer-editor">
                  <RichTextEditor
                    key={editLocale}
                    content={bodyHtml || "<p></p>"}
                    onChange={(html) =>
                      patch((prev) => ({
                        ...prev,
                        bodyHtml: setLocaleValue(
                          asLocalized(prev.bodyHtml, "<p></p>"),
                          editLocale,
                          html,
                          "<p></p>"
                        ),
                      }))
                    }
                    placeholder="Write the insight article…"
                    uploadFolder="insight"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-label">
                  <span>Gallery</span>
                </div>
                <ComposerGalleryImages
                  folder="insight"
                  images={form.galleryImages ?? []}
                  onChange={(galleryImages) => {
                    const dropped = (form.galleryImages ?? []).filter(
                      (url) => !galleryImages.includes(url)
                    );
                    removedUrls.current.push(...dropped);
                    patch((prev) => ({ ...prev, galleryImages }));
                  }}
                />
              </div>
            </article>
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
