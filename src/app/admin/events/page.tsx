"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AdminImageField from "@/components/admin/AdminImageField";
import {
  deleteEvent,
  listEvents,
  saveEvent,
  seedEventsIfEmpty,
} from "@/lib/content/eventsStore";
import { slugify } from "@/lib/content/slug";
import type { EventType } from "@/data/events";
import type { CmsEvent } from "@/lib/content/types";

const emptyForm = (): Omit<CmsEvent, "id"> & { id?: string } => ({
  slug: "",
  type: "event",
  title: "",
  excerpt: "",
  description: [],
  date: new Date().toISOString().slice(0, 10),
  time: "",
  location: "",
  isUpcoming: true,
  coverImage: "",
});

export default function AdminEventsPage() {
  const [items, setItems] = useState<CmsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<(Omit<CmsEvent, "id"> & { id?: string }) | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [bodyText, setBodyText] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listEvents());
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
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [items]
  );

  function openCreate() {
    setEditing(emptyForm());
    setBodyText("");
    setMessage("");
  }

  function openEdit(item: CmsEvent) {
    setEditing({ ...item });
    setBodyText(item.description.join("\n\n"));
    setMessage("");
  }

  async function handleSeed() {
    setMessage("Importing defaults…");
    const seeded = await seedEventsIfEmpty();
    setMessage(seeded ? "Default events imported." : "Events already exist.");
    await refresh();
  }

  async function handleDelete(item: CmsEvent) {
    if (!confirm(`Delete “${item.title}”?`)) return;
    await deleteEvent(item.id);
    setMessage("Deleted.");
    await refresh();
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const description = bodyText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      await saveEvent({
        ...editing,
        slug: editing.slug || slugify(editing.title),
        description,
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
        title="Events"
        actions={
          <>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={handleSeed}>
              Import defaults
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
              + Add event
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
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sorted.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title}</strong>
                    </td>
                    <td>{item.type}</td>
                    <td>{item.date}</td>
                    <td>{item.isUpcoming ? "Upcoming" : "Past"}</td>
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
                <h2>{editing.id ? "Edit event" : "Add event"}</h2>
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
                          type: e.target.value as EventType,
                        })
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
                      value={editing.date}
                      onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Status</span>
                    <select
                      value={editing.isUpcoming ? "upcoming" : "past"}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          isUpcoming: e.target.value === "upcoming",
                        })
                      }
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </label>
                </div>
                <div className="admin-form-row">
                  <label className="admin-field">
                    <span>Time (optional)</span>
                    <input
                      value={editing.time ?? ""}
                      onChange={(e) => setEditing({ ...editing, time: e.target.value })}
                      placeholder="2:00 PM – 5:00 PM"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Location (optional)</span>
                    <input
                      value={editing.location ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, location: e.target.value })
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
                  <span>Full description (blank line between paragraphs)</span>
                  <textarea
                    rows={7}
                    required
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                  />
                </label>
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
                    {saving ? "Saving…" : "Save event"}
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
