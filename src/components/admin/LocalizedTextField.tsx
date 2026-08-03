"use client";

import { useState } from "react";
import {
  asLocalized,
  emptyLocalized,
  locales,
  localeLabels,
  type Locale,
  type LocalizedString,
} from "@/lib/i18n/config";
import { getFirebaseAuth } from "@/lib/firebase/client";

type Props = {
  label: string;
  value: string | LocalizedString;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
  rows?: number;
};

export default function LocalizedTextField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: Props) {
  const localized = asLocalized(value);
  const [lang, setLang] = useState<Locale>("en");
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");

  async function autoTranslate() {
    const source = localized[lang]?.trim();
    if (!source) {
      setError("Write text in the active language first.");
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
          text: source,
          from: lang,
          to: locales.filter((l) => l !== lang),
        }),
      });
      const data = (await res.json()) as {
        translations?: Partial<Record<Locale, string>>;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Translate failed");
      onChange({
        ...emptyLocalized(),
        ...localized,
        ...data.translations,
        [lang]: source,
      });
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
      {multiline ? (
        <textarea
          rows={rows}
          value={localized[lang]}
          onChange={(e) =>
            onChange({ ...localized, [lang]: e.target.value })
          }
        />
      ) : (
        <input
          value={localized[lang]}
          onChange={(e) =>
            onChange({ ...localized, [lang]: e.target.value })
          }
        />
      )}
      {error ? <p className="admin-login-error">{error}</p> : null}
    </div>
  );
}
