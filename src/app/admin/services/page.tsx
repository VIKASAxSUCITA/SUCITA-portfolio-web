"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import LocalizedTextField from "@/components/admin/LocalizedTextField";
import {
  getServiceCategories,
  saveServiceCategories,
} from "@/lib/content/servicesStore";
import type { ServiceCategory } from "@/data/services";
import { asLocalized, pickLocalized, type LocalizedString } from "@/lib/i18n/config";

function labelText(value: string | LocalizedString) {
  return pickLocalized(value, "en");
}

function itemsToText(category: ServiceCategory) {
  return category.items
    .map((item) =>
      item.children?.length
        ? `${labelText(item.label)}\n${item.children
            .map((c) => `  - ${labelText(c)}`)
            .join("\n")}`
        : labelText(item.label)
    )
    .join("\n");
}

function textToItems(text: string, previous: ServiceCategory["items"]) {
  const lines = text.split("\n");
  const items: ServiceCategory["items"] = [];
  let current: ServiceCategory["items"][number] | null = null;
  let prevIndex = -1;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    const childMatch = line.match(/^\s*-\s+(.+)$/);
    if (childMatch && current) {
      const childLabel = childMatch[1].trim();
      const prevChildren = previous[prevIndex]?.children ?? [];
      const matchedChild = prevChildren.find(
        (c) => labelText(c) === childLabel
      );
      current.children = [
        ...(current.children ?? []),
        matchedChild ? asLocalized(matchedChild, childLabel) : childLabel,
      ];
      continue;
    }
    if (current) items.push(current);
    prevIndex += 1;
    const matched = previous[prevIndex];
    const label = line.trim();
    current = {
      label:
        matched && labelText(matched.label) === label
          ? asLocalized(matched.label, label)
          : label,
    };
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
        items: textToItems(texts[index] ?? "", cat.items),
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
          Update each practice area in English, Khmer, and Chinese. Use Auto-translate,
          then edit any language. Service list items stay English structure for now
          (one per line; nest with <code>- </code>).
        </p>
        {message ? <p className="admin-toast">{message}</p> : null}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <form className="admin-form" onSubmit={handleSave}>
            {categories.map((cat, index) => (
              <div key={cat.id} className="admin-panel">
                <h2>
                  {cat.letter}. {labelText(cat.title)}
                </h2>
                <LocalizedTextField
                  label="Title"
                  value={asLocalized(cat.title)}
                  onChange={(title) => {
                    const next = [...categories];
                    next[index] = { ...cat, title };
                    setCategories(next);
                  }}
                />
                <LocalizedTextField
                  label="Description"
                  multiline
                  rows={4}
                  value={asLocalized(cat.description)}
                  onChange={(description) => {
                    const next = [...categories];
                    next[index] = { ...cat, description };
                    setCategories(next);
                  }}
                />
                <label className="admin-field">
                  <span>Service items (structure)</span>
                  <textarea
                    rows={8}
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
