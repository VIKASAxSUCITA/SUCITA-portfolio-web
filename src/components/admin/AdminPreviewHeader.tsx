"use client";

import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/data/site";

/** Public-looking header for admin live preview (nav is visual only). */
export default function AdminPreviewHeader() {
  return (
    <header className="admin-preview-header">
      <div className="main-header-menu-wrap sucita-header">
        <div className="container">
          <nav className="navbar navbar-expand-md header-nav">
            <span className="navbar-brand">
              <Image
                src="/images/sucitalogo_use.png"
                alt="Sucita & Partners"
                width={200}
                height={55}
                className="img-fluid"
              />
            </span>
            <div className="collapse navbar-collapse show d-none d-md-block">
              <ul className="navbar-nav ms-auto main-navbar-nav">
                {navLinks.map((link) => (
                  <li key={link.href} className="nav-item custom-nav-item">
                    <span className="nav-link custom-nav-link">{link.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <p className="admin-preview-hint mb-0">
        Live preview — click text or images to edit, then press <strong>Save</strong>.{" "}
        <Link href="/" target="_blank" rel="noreferrer">
          View public site
        </Link>
      </p>
    </header>
  );
}
