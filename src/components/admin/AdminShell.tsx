"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type AdminShellProps = {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
  dirty?: boolean;
  message?: string;
};

const NAV_PAGES = [
  { href: "/admin", label: "Home" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/site", label: "Contact info" },
] as const;

export default function AdminShell({
  children,
  title,
  actions,
  onSave,
  saving = false,
  dirty = false,
  message = "",
}: AdminShellProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname() ?? "/admin";

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="admin-shell">
      <header className="admin-wp-bar" role="banner">
        <div className="admin-wp-bar-left">
          <Link href="/admin" className="admin-wp-bar-item admin-wp-bar-brand">
            Sucita
          </Link>
          <nav className="admin-wp-bar-nav" aria-label="Admin pages">
            {NAV_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={`admin-wp-bar-item${isActive(page.href) ? " is-active" : ""}`}
                aria-current={isActive(page.href) ? "page" : undefined}
              >
                {page.label}
              </Link>
            ))}
            {pathname === "/admin" ? (
              <a
                href="#footer"
                className="admin-wp-bar-item"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("footer")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                Footer
              </a>
            ) : null}
          </nav>
          <Link href="/" className="admin-wp-bar-item" target="_blank" rel="noreferrer">
            View site
          </Link>
        </div>
        <div className="admin-wp-bar-right">
          {message ? <span className="admin-wp-bar-msg">{message}</span> : null}
          {onSave ? (
            <button
              type="button"
              className={`admin-wp-bar-save${dirty ? " is-dirty" : ""}`}
              onClick={onSave}
              disabled={saving || !dirty}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          ) : null}
          {actions}
          <span className="admin-wp-bar-item">{user?.email ?? "admin"}</span>
          <button
            type="button"
            className="admin-wp-bar-item admin-wp-bar-btn"
            onClick={() => logout()}
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="admin-wp-content">
        {title ? (
          <div className="admin-main">
            <div className="admin-page-head">
              <h1 className="admin-page-title">{title}</h1>
            </div>
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
