"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AdminImageField from "@/components/admin/AdminImageField";
import LocalizedTextField from "@/components/admin/LocalizedTextField";
import LocalizedRichTextField from "@/components/admin/LocalizedRichTextField";
import { deleteEvent, saveEvent } from "@/lib/content/eventsStore";
import { slugify } from "@/lib/content/slug";
import { asLocalized, pickLocalized } from "@/lib/i18n/config";
import type { EventType } from "@/data/events";
import type { CmsEvent } from "@/lib/content/types";

export type EventFormState = Omit<CmsEvent, "id"> & { id?: string };

type Props = {
  initial: EventFormState;
  mode: "create" | "edit";
};

export default function AdminEventEditor({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<EventFormState>({
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
      const id = await saveEvent({
        ...form,
        slug: form.slug || slugify(titleEn),
        title: asLocalized(form.title),
        excerpt: asLocalized(form.excerpt),
        bodyHtml: asLocalized(form.bodyHtml, "<p></p>"),
      });
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
      <AdminShell title={mode === "create" ? "New event" : "Edit event"}>
        <p className="admin-lead">
          <Link href="/admin/events">← Back to events</Link>
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
                  setForm((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </label>
            <label className="admin-field">
              <span>Status</span>
              <select
                value={form.isUpcoming ? "upcoming" : "past"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isUpcoming: e.target.value === "upcoming",
                  }))
                }
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </label>
          </div>

          <div className="admin-form-row">
            <label className="admin-field">
              <span>Time</span>
              <input
                value={form.time ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, time: e.target.value }))
                }
                placeholder="2:00 PM – 5:00 PM"
              />
            </label>
            <label className="admin-field">
              <span>Location</span>
              <input
                value={form.location ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
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

          <AdminImageField
            label="Cover image"
            value={form.coverImage}
            onChange={(coverImage) => setForm((prev) => ({ ...prev, coverImage }))}
          />

          <LocalizedRichTextField
            label="Body"
            value={asLocalized(form.bodyHtml, "<p></p>")}
            onChange={(bodyHtml) => setForm((prev) => ({ ...prev, bodyHtml }))}
            placeholder="Write the event details…"
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
            <Link href="/admin/events" className="admin-btn admin-btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save event"}
            </button>
          </div>
        </form>
      </AdminShell>
    </AdminGuard>
  );
}
