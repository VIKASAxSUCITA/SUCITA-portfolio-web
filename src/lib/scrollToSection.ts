/** Smooth-scroll to a homepage section, tight under the fixed header. */
export function scrollToSection(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return false;

  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "/#home");
    return true;
  }

  const el = document.getElementById(id);
  if (!el) return false;

  const header = document.querySelector(".sucita-header") as HTMLElement | null;
  const headerH = header?.offsetHeight ?? 80;
  // Keep section title just under the nav (not hidden behind it)
  const top =
    el.getBoundingClientRect().top + window.scrollY - headerH - 12;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", `/#${id}`);
  return true;
}
