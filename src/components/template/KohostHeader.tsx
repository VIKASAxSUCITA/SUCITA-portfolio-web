"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { navLinks } from "@/data/site";
import { scrollToSection } from "@/lib/scrollToSection";

function closeOffcanvas() {
  const el = document.getElementById("offcanvasLeft");
  if (!el) return;
  const instance = (
    window as Window & {
      bootstrap?: { Offcanvas: { getInstance: (el: Element) => { hide: () => void } | null } };
    }
  ).bootstrap?.Offcanvas.getInstance(el);
  instance?.hide();
}

export default function KohostHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("/#")) return;

    const hash = href.slice(1);

    if (pathname === "/") {
      event.preventDefault();
      scrollToSection(hash);
      closeOffcanvas();
      return;
    }

    // From other pages: go home, then scroll after navigation
    event.preventDefault();
    closeOffcanvas();
    router.push(href);
  };

  return (
    <header id="header" className="header-main">
      <div id="logoAndNav" className="main-header-menu-wrap sucita-header fixed-top">
        <div className="container">
          <nav className="navbar navbar-expand-md header-nav">
            <Link className="navbar-brand" href="/#home" onClick={(e) => handleNavClick(e, "/#home")}>
              <Image
                src="/images/sucita_logo.png"
                alt="Sucita & Partners"
                width={220}
                height={60}
                className="img-fluid"
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
              <ul className="navbar-nav ms-auto main-navbar-nav">
                {navLinks.map((link) => (
                  <li key={link.href} className="nav-item custom-nav-item">
                    <Link
                      className="nav-link custom-nav-link"
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
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
          <Link
            href="/#home"
            className="navbar-brand"
            onClick={(e) => handleNavClick(e, "/#home")}
          >
            <Image
              src="/images/sucita_logo.png"
              alt="Sucita & Partners"
              width={220}
              height={60}
              className="img-fluid sucita-offcanvas-logo"
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
            {navLinks.map((link) => (
              <li key={link.href} className="nav-item">
                <Link
                  className="nav-link sucita-offcanvas-link"
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
