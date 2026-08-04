"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
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

async function requestTranslations(
  idToken: string,
  text: string,
  from: Locale,
  targets: Locale[]
): Promise<Partial<Record<Locale, string>>> {
  const res = await fetch("/api/admin/translate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text.slice(0, 450), from, to: targets }),
  });
  const data = (await res.json()) as {
    translations?: Partial<Record<Locale, string>>;
    error?: string;
  };
  if (!res.ok) throw new Error(data.error || "Translate failed");
  return data.translations ?? {};
}

function collectTextNodes(doc: Document): Text[] {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    nodes.push(node as Text);
    node = walker.nextNode();
  }
  return nodes;
}

/** Translate HTML while preserving tags (lists, headings, bold, links…). */
async function translateHtml(
  idToken: string,
  raw: string,
  from: Locale,
  targets: Locale[]
): Promise<Partial<Record<Locale, string>>> {
  const parser = new DOMParser();
  const sourceNodes = collectTextNodes(
    parser.parseFromString(raw, "text/html")
  );
  const targetDocs = targets.map((locale) => ({
    locale,
    doc: parser.parseFromString(raw, "text/html"),
  }));
  const targetNodes = targetDocs.map(({ doc }) => collectTextNodes(doc));

  for (let i = 0; i < sourceNodes.length; i++) {
    const text = sourceNodes[i].textContent ?? "";
    if (!text.trim()) continue;
    const translations = await requestTranslations(idToken, text, from, targets);
    targetDocs.forEach(({ locale }, t) => {
      const node = targetNodes[t][i];
      if (node) node.textContent = translations[locale] ?? text;
    });
  }

  const out: Partial<Record<Locale, string>> = {};
  for (const { locale, doc } of targetDocs) {
    out[locale] = doc.body.innerHTML;
  }
  return out;
}

function SuccessCheckIcon() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden className="translate-success-svg">
      <circle className="translate-success-circle" cx="26" cy="26" r="24" />
      <path
        className="translate-success-tick"
        fill="none"
        d="M15 27l7.5 7.5L37.5 19"
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
  const [success, setSuccess] = useState(false);

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

        const next = { ...emptyLocalized(source.html ? "<p></p>" : ""), ...localized };
        const translations = source.html
          ? await translateHtml(idToken, raw, from, targets)
          : await requestTranslations(idToken, plain, from, targets);
        for (const [code, text] of Object.entries(translations)) {
          if (code === from || !text) continue;
          next[code as Locale] = text;
        }
        next[from] = raw;
        results.push(next);
      }

      onTranslated(results);
      setSuccess(true);
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

      {busy
        ? createPortal(
            <div
              className="translate-success-overlay"
              role="alertdialog"
              aria-modal="true"
              aria-label="Translating"
            >
              <div className="translate-success-card">
                <span className="translate-progress-spinner" aria-hidden="true" />
                <h3 className="translate-success-title">Translating…</h3>
                <p className="translate-success-copy mb-0">
                  Converting your content into the other languages. This can
                  take a moment.
                </p>
              </div>
            </div>,
            document.body
          )
        : null}

      {success
        ? createPortal(
            <div
              className="translate-success-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="translate-success-title"
            >
              <div className="translate-success-card">
                <SuccessCheckIcon />
                <h3
                  id="translate-success-title"
                  className="translate-success-title"
                >
                  Translation complete
                </h3>
                <p className="translate-success-copy">
                  All languages were translated successfully. Review each tab,
                  then save your changes.
                </p>
                <button
                  type="button"
                  className="translate-success-done"
                  onClick={() => setSuccess(false)}
                  autoFocus
                >
                  Done
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
