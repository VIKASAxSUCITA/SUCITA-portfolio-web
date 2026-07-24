"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { getSiteContent, saveSiteContent } from "@/lib/content/siteStore";
import type { SiteContent } from "@/lib/content/types";

export default function AdminSitePage() {
  const [form, setForm] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      setForm(await getSiteContent());
    })();
  }, []);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setMessage("");
    try {
      await saveSiteContent(form);
      setMessage("Contact info saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <AdminShell title="Contact info">
        <p className="admin-lead">
          These details show in the Contact section and footer.
        </p>
        {message ? <p className="admin-toast">{message}</p> : null}
        {!form ? (
          <p>Loading…</p>
        ) : (
          <form className="admin-form admin-form-narrow" onSubmit={handleSave}>
            <label className="admin-field">
              <span>Firm name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Tagline</span>
              <input
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Footer copy</span>
              <textarea
                rows={3}
                value={form.footerCopy}
                onChange={(e) => setForm({ ...form, footerCopy: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Address</span>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Phone</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Office hours</span>
              <input
                value={form.officeHours}
                onChange={(e) => setForm({ ...form, officeHours: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>WhatsApp link</span>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Telegram link</span>
              <input
                value={form.telegram}
                onChange={(e) => setForm({ ...form, telegram: e.target.value })}
              />
            </label>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save contact info"}
            </button>
          </form>
        )}
      </AdminShell>
    </AdminGuard>
  );
}
