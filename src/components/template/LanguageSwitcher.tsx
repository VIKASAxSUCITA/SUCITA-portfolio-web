"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { locales, localeLabels, localeCodes, type Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function select(code: Locale) {
    setLocale(code);
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={`sucita-lang-dropdown ${open ? "is-open" : ""} ${className}`.trim()}
    >
      <button
        type="button"
        className="sucita-lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${localeLabels[locale]}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <i className="fas fa-globe" aria-hidden="true" />
        <span className="sucita-lang-trigger-code">{localeCodes[locale]}</span>
        <i className="fas fa-chevron-down sucita-lang-caret" aria-hidden="true" />
      </button>

      {open ? (
        <ul className="sucita-lang-menu" role="listbox" aria-label="Select language">
          {locales.map((code) => (
            <li key={code} role="option" aria-selected={locale === code}>
              <button
                type="button"
                className={`sucita-lang-option${locale === code ? " is-active" : ""}`}
                onClick={() => select(code as Locale)}
              >
                <span className="sucita-lang-option-code">{localeCodes[code]}</span>
                <span>{localeLabels[code]}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
