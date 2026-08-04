"use client";

import { useEffect, useRef, useState } from "react";
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
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const ready = useRef(false);

  useEffect(() => {
    void (async () => {
      const data = await getServiceCategories();
      setCategories(data);
      setTexts(data.map(itemsToText));
      setLoading(false);
      ready.current = true;
    })();
  }, []);

  function markDirty() {
    if (ready.current) setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const next = categories.map((cat, index) => ({
        ...cat,
        items: textToItems(texts[index] ?? "", cat.items),
      }));
      await saveServiceCategories(next);
      setCategories(next);
      setTexts(next.map(itemsToText));
      setDirty(false);
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <AdminShell
        pageTitle="Services"
        onSave={() => void handleSave()}
        saving={saving}
        dirty={dirty}
        message={message}
      >
        <div className="admin-cms">
          <p className="admin-lead">
            Update only — edit titles and descriptions in EN / KM / CH. Service
            items: one per line; nest with <code>- </code>.
          </p>
          {loading ? (
            <p className="admin-cms-empty">Loading…</p>
          ) : (
            <div className="admin-form">
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
                      markDirty();
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
                      markDirty();
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
                        markDirty();
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
