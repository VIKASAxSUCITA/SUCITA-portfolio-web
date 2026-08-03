"use client";

import { useState } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  asLocalized,
  emptyLocalized,
  locales,
  localeLabels,
  type Locale,
  type LocalizedString,
} from "@/lib/i18n/config";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { htmlToParagraphs } from "@/lib/content/richText";

type Props = {
  label: string;
  value: string | LocalizedString | undefined;
  onChange: (value: LocalizedString) => void;
  placeholder?: string;
};

export default function LocalizedRichTextField({
  label,
  value,
  onChange,
  placeholder,
}: Props) {
  const localized = asLocalized(value, "<p></p>");
  const [lang, setLang] = useState<Locale>("en");
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");

  async function autoTranslate() {
    const sourceHtml = localized[lang] || "";
    const plain = htmlToParagraphs(sourceHtml).join("\n\n").trim();
    if (!plain) {
      setError("Write content in the active language first.");
      return;
    }
    setTranslating(true);
    setError("");
    try {
      const user = getFirebaseAuth().currentUser;
      if (!user) throw new Error("Please sign in again.");
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: plain.slice(0, 450),
          from: lang,
          to: locales.filter((l) => l !== lang),
        }),
      });
      const data = (await res.json()) as {
        translations?: Partial<Record<Locale, string>>;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Translate failed");

      const next = { ...emptyLocalized("<p></p>"), ...localized };
      for (const [code, text] of Object.entries(data.translations ?? {})) {
        if (code === lang) continue;
        next[code as Locale] = `<p>${text}</p>`;
      }
      next[lang] = sourceHtml;
      onChange(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translate failed");
    } finally {
      setTranslating(false);
    }
  }

  return (
    <div className="admin-field admin-localized-field">
      <div className="admin-localized-head">
        <span>{label}</span>
        <div className="admin-localized-tabs">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              className={`admin-localized-tab${lang === code ? " is-active" : ""}`}
              onClick={() => setLang(code)}
            >
              {localeLabels[code]}
            </button>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => void autoTranslate()}
            disabled={translating}
          >
            {translating ? "Translating…" : `Auto-translate from ${localeLabels[lang]}`}
          </button>
        </div>
      </div>
      <RichTextEditor
        key={lang}
        content={localized[lang] || "<p></p>"}
        onChange={(html) => onChange({ ...localized, [lang]: html })}
        placeholder={placeholder}
      />
      {error ? <p className="admin-login-error">{error}</p> : null}
      <p className="admin-muted">
        Auto-translate fills other languages from plain text (best for short
        sections). You can refine each language afterward.
      </p>
    </div>
  );
}
