"use client";

import { useCallback } from "react";
import { useLocale } from "./LocaleProvider";
import type { MessageKey } from "./messages";

/**
 * English uses CMS/admin content; Khmer & Chinese use the built-in message catalog
 * until those locales are stored in CMS.
 */
export function useLocalizedCopy() {
  const { locale, t } = useLocale();

  return useCallback(
    (cmsValue: string, key: MessageKey) =>
      locale === "en" ? cmsValue : t(key),
    [locale, t]
  );
}
