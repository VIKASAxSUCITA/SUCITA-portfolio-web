export const locales = ["en", "km", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  km: "ខ្មែរ",
  zh: "中文",
};

/** Short codes shown in the language switcher UI */
export const localeCodes: Record<Locale, string> = {
  en: "EN",
  km: "KM",
  zh: "CH",
};

export type LocalizedString = {
  en: string;
  km: string;
  zh: string;
};

export function emptyLocalized(value = ""): LocalizedString {
  return { en: value, km: value, zh: value };
}

export function asLocalized(
  value: string | LocalizedString | Record<string, string> | undefined | null,
  fallback = ""
): LocalizedString {
  if (!value) return emptyLocalized(fallback);
  if (typeof value === "string") return emptyLocalized(value);
  return {
    en: String(value.en ?? fallback),
    km: String(value.km ?? value.en ?? fallback),
    zh: String(value.zh ?? value.en ?? fallback),
  };
}

export function pickLocalized(
  value: string | LocalizedString | undefined | null,
  locale: Locale,
  fallback = ""
): string {
  const localized = asLocalized(value, fallback);
  return localized[locale] || localized.en || fallback;
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}
