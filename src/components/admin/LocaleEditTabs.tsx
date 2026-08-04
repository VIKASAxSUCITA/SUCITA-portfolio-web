"use client";

import { locales, type Locale } from "@/lib/i18n/config";

const TAB_LABELS: Record<Locale, string> = {
  en: "EN",
  km: "ខ្មែរ",
  zh: "中文",
};

type Props = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  label?: string;
};

export default function LocaleEditTabs({
  locale,
  onChange,
  label = "Edit language",
}: Props) {
  return (
    <div className="locale-edit-tabs" role="tablist" aria-label={label}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          role="tab"
          aria-selected={locale === code}
          className={`locale-edit-tab${locale === code ? " is-active" : ""}`}
          onClick={() => onChange(code)}
        >
          {TAB_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
