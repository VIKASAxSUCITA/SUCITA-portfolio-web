"use client";

import { useState } from "react";
import {
  asLocalized,
  emptyLocalized,
  locales,
  type Locale,
  type LocalizedString,
} from "@/lib/i18n/config";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { htmlToParagraphs } from "@/lib/content/richText";

type Source = {
  value: string | LocalizedString;
  /** When true, treat as HTML and wrap translations in <p> */
  html?: boolean;
};

type Props = {
  from: Locale;
  sources: Source[];
  disabled?: boolean;
  onTranslated: (next: LocalizedString[]) => void;
};

function TranslateIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5h7M7.5 5v2a7 7 0 0 0 7 7h1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 19h8M16 15l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19h4l6-14h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AutoTranslateButton({
  from,
  sources,
  disabled,
  onTranslated,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setBusy(true);
    try {
      const user = getFirebaseAuth().currentUser;
      if (!user) throw new Error("Please sign in again.");
      const idToken = await user.getIdToken();
      const targets = locales.filter((l) => l !== from);
      const results: LocalizedString[] = [];

      for (const source of sources) {
        const localized = asLocalized(source.value, source.html ? "<p></p>" : "");
        const raw = localized[from] || "";
        const plain = source.html
          ? htmlToParagraphs(raw).join("\n\n").trim()
          : raw.trim();
        if (!plain) {
          results.push(localized);
          continue;
        }
        const res = await fetch("/api/admin/translate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: plain.slice(0, 450),
            from,
            to: targets,
          }),
        });
        const data = (await res.json()) as {
          translations?: Partial<Record<Locale, string>>;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || "Translate failed");

        const next = { ...emptyLocalized(source.html ? "<p></p>" : ""), ...localized };
        for (const [code, text] of Object.entries(data.translations ?? {})) {
          if (code === from) continue;
          next[code as Locale] = source.html ? `<p>${text}</p>` : text;
        }
        next[from] = raw;
        results.push(next);
      }

      onTranslated(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translate failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auto-translate--icon">
      <button
        type="button"
        className="auto-translate-icon-btn"
        onClick={() => void run()}
        disabled={disabled || busy}
        title={busy ? "Translating…" : "Auto-translate other languages"}
        aria-label="Auto-translate"
      >
        <TranslateIcon />
      </button>
      {error ? <span className="auto-translate-msg is-inline">{error}</span> : null}
    </div>
  );
}
