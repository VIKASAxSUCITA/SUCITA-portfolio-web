"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type AdminShellProps = {
  children: React.ReactNode;
  pageTitle?: string;
  onSave?: () => void;
  saving?: boolean;
  dirty?: boolean;
  message?: string;
  onBack?: () => void;
  topbarTools?: React.ReactNode;
};

const NAV_PAGES = [
  {
    href: "/admin/insights",
    label: "Insights",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19.5V6.5A2.5 2.5 0 0 1 6.5 4H18v15.5a2 2 0 0 0-2-2H6.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M8 8h6M8 12h6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/events",
    label: "Events",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3.5"
          y="5"
          width="17"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8 3.5V7M16 3.5V7M3.5 10h17"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M12 12v8M12 12 4 8.5M12 12l8-3.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/admin/logos",
    label: "Partners & Clients",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="16" cy="15" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M4 18.5c.8-2.2 2.6-3.5 5-3.5M14 11c2.1.3 3.7 1.6 4.5 3.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

function initialsFromEmail(email: string | null | undefined) {
  const local = (email || "admin").split("@")[0] || "AD";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

function BackArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6 9 12l6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminShell({
  children,
  pageTitle = "Admin",
  onSave,
  saving = false,
  dirty = false,
  message = "",
  onBack,
  topbarTools,
}: AdminShellProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname() ?? "/admin/insights";
  const email = user?.email ?? "admin";
  const initials = initialsFromEmail(email);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-top">
          <Link href="/admin/insights" className="admin-sidebar-brand">
            Sucita
          </Link>
          <nav className="admin-sidebar-nav">
            {NAV_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={`admin-sidebar-link${
                  isActive(page.href) ? " is-active" : ""
                }`}
                aria-current={isActive(page.href) ? "page" : undefined}
              >
                <span className="admin-sidebar-link-icon">{page.icon}</span>
                <span>{page.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <Link
            href="/"
            className="admin-sidebar-viewsite"
            target="_blank"
            rel="noreferrer"
          >
            View site ↗
          </Link>
          <div className="admin-sidebar-user">
            <span className="admin-sidebar-avatar" aria-hidden>
              {initials}
            </span>
            <div className="admin-sidebar-user-meta">
              <span className="admin-sidebar-user-name">Admin</span>
              <span className="admin-sidebar-user-email" title={email}>
                {email}
              </span>
            </div>
            <button
              type="button"
              className="admin-sidebar-signout"
              onClick={() => logout()}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-shell-main">
        <header className="admin-topbar" role="banner">
          <div className="admin-topbar-start">
            {onBack ? (
              <button
                type="button"
                className="admin-topbar-back"
                onClick={onBack}
                disabled={saving}
                aria-label="Back"
              >
                <BackArrowIcon />
              </button>
            ) : null}
            <h1 className="admin-topbar-title">{pageTitle}</h1>
          </div>
          <div className="admin-topbar-actions">
            {topbarTools ? (
              <div className="admin-topbar-tools">{topbarTools}</div>
            ) : null}
            {message ? <span className="admin-topbar-msg">{message}</span> : null}
            {onSave ? (
              <button
                type="button"
                className={`admin-topbar-save${dirty ? " is-dirty" : ""}`}
                onClick={onSave}
                disabled={saving || !dirty}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            ) : null}
          </div>
        </header>
        <div className="admin-shell-content">{children}</div>
      </div>
    </div>
  );
}
