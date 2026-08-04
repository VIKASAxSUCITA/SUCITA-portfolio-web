"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/site";
import LanguageSwitcher from "@/components/template/LanguageSwitcher";
import ServicesNavDropdown from "@/components/template/ServicesNavDropdown";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function closeOffcanvas() {
  const el = document.getElementById("offcanvasLeft");
  if (!el) return;
  const instance = (
    window as Window & {
      bootstrap?: {
        Offcanvas: { getInstance: (el: Element) => { hide: () => void } | null };
      };
    }
  ).bootstrap?.Offcanvas.getInstance(el);
  instance?.hide();
}

export default function KohostHeader() {
  const pathname = usePathname();
  const { t } = useLocale();
  const servicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

  return (
    <header id="header" className="header-main">
      <div id="logoAndNav" className="main-header-menu-wrap sucita-header fixed-top">
        <div className="container">
          <nav className="navbar navbar-expand-md header-nav">
            <Link className="navbar-brand" href="/">
              <Image
                src="/images/sucitalogo_use.png"
                alt="Sucita & Partners"
                width={250}
                height={72}
                className="img-fluid sucita-brand-logo"
                priority
              />
            </Link>

            <button
              type="button"
              className="navbar-toggler btn"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasLeft"
            >
              <span id="hamburgerTrigger">
                <span className="fas fa-bars" />
              </span>
            </button>

            <div id="navBar" className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto main-navbar-nav align-items-md-center">
                {navLinks.map((link) => {
                  if (link.href === "/services") {
                    return (
                      <li key={link.href} className="nav-item custom-nav-item">
                        <ServicesNavDropdown active={servicesActive} />
                      </li>
                    );
                  }

                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href ||
                        pathname.startsWith(`${link.href}/`);
                  return (
                    <li key={link.href} className="nav-item custom-nav-item">
                      <Link
                        className={`nav-link custom-nav-link${active ? " active" : ""}`}
                        href={link.href}
                      >
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  );
                })}
                <li className="nav-item custom-nav-item ms-md-2">
                  <LanguageSwitcher />
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-start sucita-offcanvas"
        tabIndex={-1}
        id="offcanvasLeft"
        aria-labelledby="offcanvasLeftLabel"
      >
        <div className="offcanvas-header sucita-offcanvas-header">
          <Link href="/" className="navbar-brand" onClick={closeOffcanvas}>
            <Image
              src="/images/sucitalogo_use.png"
              alt="Sucita & Partners"
              width={200}
              height={56}
              className="img-fluid sucita-offcanvas-logo sucita-brand-logo"
            />
          </Link>
          <button
            type="button"
            className="btn-close sucita-offcanvas-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body sucita-offcanvas-body">
          <ul className="navbar-nav sucita-offcanvas-nav">
            {navLinks.map((link) => {
              if (link.href === "/services") {
                return (
                  <ServicesNavDropdown
                    key={link.href}
                    variant="mobile"
                    active={servicesActive}
                    onNavigate={closeOffcanvas}
                  />
                );
              }
              return (
                <li key={link.href} className="nav-item">
                  <Link
                    className="nav-link sucita-offcanvas-link"
                    href={link.href}
                    onClick={closeOffcanvas}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
