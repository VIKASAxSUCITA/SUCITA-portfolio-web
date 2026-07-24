"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import {
  getServiceCategories,
  saveServiceCategories,
} from "@/lib/content/servicesStore";
import type { ServiceCategory } from "@/data/services";

function itemsToText(category: ServiceCategory) {
  return category.items
    .map((item) =>
      item.children?.length
        ? `${item.label}\n${item.children.map((c) => `  - ${c}`).join("\n")}`
        : item.label
    )
    .join("\n");
}

function textToItems(text: string) {
  const lines = text.split("\n");
  const items: ServiceCategory["items"] = [];
  let current: ServiceCategory["items"][number] | null = null;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    const childMatch = line.match(/^\s*-\s+(.+)$/);
    if (childMatch && current) {
      current.children = [...(current.children ?? []), childMatch[1].trim()];
      continue;
    }
    if (current) items.push(current);
    current = { label: line.trim() };
  }
  if (current) items.push(current);
  return items;
}

export default function AdminServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [texts, setTexts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      const data = await getServiceCategories();
      setCategories(data);
      setTexts(data.map(itemsToText));
      setLoading(false);
    })();
  }, []);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const next = categories.map((cat, index) => ({
        ...cat,
        items: textToItems(texts[index] ?? ""),
      }));
      await saveServiceCategories(next);
      setCategories(next);
      setMessage("Services saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <AdminShell title="Services">
        <p className="admin-lead">
          Edit each practice area. Put one service per line. For items under Assurance,
          indent with <code>- </code> like this:
          <br />
          <code>Assurance</code>
          <br />
          <code>&nbsp;&nbsp;- Agreed-Upon Procedure</code>
        </p>
        {message ? <p className="admin-toast">{message}</p> : null}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <form className="admin-form" onSubmit={handleSave}>
            {categories.map((cat, index) => (
              <div key={cat.id} className="admin-panel">
                <h2>
                  {cat.letter}. {cat.title}
                </h2>
                <label className="admin-field">
                  <span>Title</span>
                  <input
                    value={cat.title}
                    onChange={(e) => {
                      const next = [...categories];
                      next[index] = { ...cat, title: e.target.value };
                      setCategories(next);
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Description</span>
                  <textarea
                    rows={3}
                    value={cat.description}
                    onChange={(e) => {
                      const next = [...categories];
                      next[index] = { ...cat, description: e.target.value };
                      setCategories(next);
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Services list</span>
                  <textarea
                    rows={10}
                    value={texts[index] ?? ""}
                    onChange={(e) => {
                      const next = [...texts];
                      next[index] = e.target.value;
                      setTexts(next);
                    }}
                  />
                </label>
              </div>
            ))}
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save services"}
            </button>
          </form>
        )}
      </AdminShell>
    </AdminGuard>
  );
}
