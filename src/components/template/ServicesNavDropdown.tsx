"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { serviceCategories as defaultCategories, type ServiceCategory } from "@/data/services";
import { getServiceCategories } from "@/lib/content/servicesStore";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Props = {
  active?: boolean;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export default function ServicesNavDropdown({
  active = false,
  variant = "desktop",
  onNavigate,
}: Props) {
  const { t, L } = useLocale();
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>(defaultCategories);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let activeFetch = true;
    void getServiceCategories()
      .then((next) => {
        if (activeFetch && next.length) setCategories(next);
      })
      .catch(() => undefined);
    return () => {
      activeFetch = false;
    };
  }, []);

  useEffect(() => {
    if (variant !== "desktop") return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setExpandedId(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setExpandedId(null);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [variant]);

  function handleNavigate() {
    setOpen(false);
    setExpandedId(null);
    onNavigate?.();
  }

  if (variant === "mobile") {
    return (
      <li className="nav-item sucita-services-mobile">
        <button
          type="button"
          className={`nav-link sucita-offcanvas-link sucita-services-mobile-trigger${
            open ? " is-open" : ""
          }${active ? " active" : ""}`}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{t("nav.services")}</span>
          <i className="fas fa-chevron-down" aria-hidden="true" />
        </button>
        {open ? (
          <ul className="sucita-services-mobile-menu list-unstyled">
            <li>
              <Link
                href="/services"
                className="sucita-services-mobile-link is-overview"
                onClick={handleNavigate}
              >
                {t("nav.services")}
              </Link>
            </li>
            {categories.map((category) => {
              const isExpanded = expandedId === category.id;
              return (
                <li key={category.id} className="sucita-services-mobile-group">
                  <div className="sucita-services-mobile-row">
                    <Link
                      href={`/services/${category.id}`}
                      className="sucita-services-mobile-link is-category"
                      onClick={handleNavigate}
                    >
                      <span className="sucita-services-letter">{category.letter}</span>
                      {L(category.title)}
                    </Link>
                    {category.items.length ? (
                      <button
                        type="button"
                        className={`sucita-services-mobile-expand${isExpanded ? " is-open" : ""}`}
                        aria-expanded={isExpanded}
                        aria-label={L(category.title)}
                        onClick={() =>
                          setExpandedId((prev) => (prev === category.id ? null : category.id))
                        }
                      >
                        <i className="fas fa-chevron-down" aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>
                  {isExpanded ? (
                    <ul className="sucita-services-mobile-items list-unstyled">
                      {category.items.map((item, index) => (
                        <li key={`${category.id}-${index}`}>
                          <Link
                            href={`/services/${category.id}`}
                            className="sucita-services-mobile-link is-item"
                            onClick={handleNavigate}
                          >
                            {L(item.label)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`sucita-services-dropdown${open ? " is-open" : ""}${
        active ? " is-active" : ""
      }`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        setExpandedId(null);
      }}
    >
      <button
        type="button"
        className={`nav-link custom-nav-link sucita-services-trigger${
          active ? " active" : ""
        }`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{t("nav.services")}</span>
        <i className="fas fa-chevron-down sucita-services-caret" aria-hidden="true" />
      </button>

      {open ? (
        <div className="sucita-services-menu" role="menu">
          <div className="sucita-services-menu-panel">
            <Link href="/services" className="sucita-services-overview" onClick={handleNavigate}>
              {t("nav.services")}
            </Link>
            <ul className="sucita-services-menu-titles list-unstyled">
              {categories.map((category) => {
                const isExpanded = expandedId === category.id;
                return (
                  <li
                    key={category.id}
                    className={`sucita-services-menu-row${isExpanded ? " is-open" : ""}`}
                    onMouseEnter={() => setExpandedId(category.id)}
                  >
                    <Link
                      href={`/services/${category.id}`}
                      className="sucita-services-menu-category"
                      role="menuitem"
                      onClick={handleNavigate}
                    >
                      <span className="sucita-services-letter">{category.letter}</span>
                      <span className="sucita-services-menu-category-label">
                        {L(category.title)}
                      </span>
                      {category.items.length ? (
                        <i
                          className="fas fa-chevron-right sucita-services-submenu-caret"
                          aria-hidden="true"
                        />
                      ) : null}
                    </Link>

                    {isExpanded && category.items.length ? (
                      <ul className="sucita-services-submenu list-unstyled" role="menu">
                        {category.items.map((item, index) => (
                          <li key={`${category.id}-${index}`}>
                            <Link
                              href={`/services/${category.id}`}
                              className="sucita-services-submenu-item"
                              role="menuitem"
                              onClick={handleNavigate}
                            >
                              {L(item.label)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
