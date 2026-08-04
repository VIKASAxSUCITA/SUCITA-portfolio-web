"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AdminImageField from "@/components/admin/AdminImageField";
import LocaleEditTabs from "@/components/admin/LocaleEditTabs";
import AutoTranslateButton from "@/components/admin/AutoTranslateButton";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { deleteEvent, saveEvent } from "@/lib/content/eventsStore";
import { slugify } from "@/lib/content/slug";
import {
  asLocalized,
  pickLocalized,
  type Locale,
  type LocalizedString,
} from "@/lib/i18n/config";
import type { EventType } from "@/data/events";
import type { CmsEvent } from "@/lib/content/types";

export type EventFormState = Omit<CmsEvent, "id"> & { id?: string };

type Props = {
  initial: EventFormState;
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

export default function AdminEventEditor({ initial, mode }: Props) {
  const router = useRouter();
  const [editLocale, setEditLocale] = useState<Locale>("en");
  const [form, setForm] = useState<EventFormState>({
    ...initial,
    title: asLocalized(initial.title),
    excerpt: asLocalized(initial.excerpt),
    bodyHtml: asLocalized(initial.bodyHtml, "<p></p>"),
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  function patch(updater: (prev: EventFormState) => EventFormState) {
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
    router.push("/admin/events");
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
      const id = await saveEvent({
        ...form,
        slug: form.slug || slugify(titleEn),
        title: asLocalized(form.title),
        excerpt: asLocalized(form.excerpt),
        bodyHtml: asLocalized(form.bodyHtml, "<p></p>"),
      });
      setDirty(false);
      setMessage("Saved.");
      if (mode === "create") {
        router.replace(`/admin/events/${id}/edit`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!window.confirm("Delete this event?")) return;
    setSaving(true);
    try {
      await deleteEvent(form.id);
      router.push("/admin/events");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <AdminShell
        pageTitle="Events"
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
                aria-label="Delete event"
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
              <p className="admin-composer-slugline">
                {mode === "create" ? "New event" : "Edit event"}
              </p>

              <div className="admin-form-row admin-composer-row">
                <div className="admin-composer-label-col">
                  <span className="admin-composer-label">Title</span>
                  <span className="admin-composer-count">
                    {title.length}/{TITLE_MAX}
                  </span>
                </div>
                <textarea
                  className="admin-composer-title"
                  rows={2}
                  maxLength={TITLE_MAX}
                  value={title}
                  placeholder="Event title"
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      title: setLocaleValue(prev.title, editLocale, e.target.value),
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

              <div className="admin-form-row admin-composer-row">
                <div className="admin-composer-label-col">
                  <span className="admin-composer-label">Image</span>
                </div>
                <AdminImageField
                  label=""
                  folder="event"
                  value={form.coverImage}
                  onChange={(coverImage) =>
                    patch((prev) => ({ ...prev, coverImage }))
                  }
                />
              </div>

              <div className="admin-composer-meta-grid">
                <label className="admin-field">
                  <span>Type</span>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      patch((prev) => ({
                        ...prev,
                        type: e.target.value as EventType,
                      }))
                    }
                  >
                    <option value="event">Event</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Date</span>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      patch((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </label>
                <label className="admin-field">
                  <span>Time</span>
                  <input
                    value={form.time ?? ""}
                    onChange={(e) =>
                      patch((prev) => ({ ...prev, time: e.target.value }))
                    }
                    placeholder="2:00 PM – 5:00 PM"
                  />
                </label>
                <label className="admin-field">
                  <span>Location</span>
                  <input
                    value={form.location ?? ""}
                    onChange={(e) =>
                      patch((prev) => ({ ...prev, location: e.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="admin-form-row admin-composer-row">
                <div className="admin-composer-label-col">
                  <span className="admin-composer-label">Excerpt</span>
                </div>
                <textarea
                  className="admin-composer-excerpt"
                  rows={3}
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
              </div>

              <div className="admin-form-row admin-composer-row">
                <div className="admin-composer-label-col">
                  <span className="admin-composer-label">Content</span>
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
                    placeholder="Write the event details…"
                    uploadFolder="event"
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
