import type { Locale, LocalizedString } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/config";

/** Convert legacy paragraph arrays into TipTap-friendly HTML. */
export function paragraphsToHtml(paragraphs: string[] | undefined): string {
  if (!paragraphs?.length) return "<p></p>";
  return paragraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
}

export function htmlToParagraphs(html: string): string[] {
  if (typeof window === "undefined") {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .split(/\n+/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }

  const doc = new DOMParser().parseFromString(html || "", "text/html");
  const blocks = Array.from(doc.body.querySelectorAll("p, li, h2, h3"));
  if (blocks.length) {
    return blocks
      .map((el) => el.textContent?.replace(/\s+/g, " ").trim() || "")
      .filter(Boolean);
  }
  const text = doc.body.textContent?.trim();
  return text ? [text] : [];
}

export function resolveBodyHtml(
  bodyHtml: string | LocalizedString | undefined,
  paragraphs: string[] | undefined,
  locale: Locale = "en"
): string {
  if (bodyHtml) {
    const html =
      typeof bodyHtml === "string"
        ? bodyHtml
        : pickLocalized(bodyHtml, locale, "");
    if (html.replace(/<[^>]+>/g, "").trim()) return html;
  }
  return paragraphsToHtml(paragraphs);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
