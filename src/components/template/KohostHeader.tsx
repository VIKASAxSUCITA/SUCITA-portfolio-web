import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/data/site";

export default function KohostHeader() {
  return (
    <header id="header" className="header-main">
      <div id="logoAndNav" className="main-header-menu-wrap sucita-header fixed-top">
        <div className="container">
          <nav className="navbar navbar-expand-md header-nav">
            <Link className="navbar-brand pt-0" href="/">
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
                    <Link className="nav-link custom-nav-link" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="nav-item custom-nav-item ms-lg-3">
                  <Link
                    className="btn btn-primary btn-sm"
                    href="/contact?intent=strategy-call"
                  >
                    Book Strategy Call
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile offcanvas */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="offcanvasLeft"
        aria-labelledby="offcanvasLeftLabel"
      >
        <div className="offcanvas-header">
          <Link href="/" className="navbar-brand">
            <Image
              src="/images/sucita_logo.png"
              alt="Sucita & Partners"
              width={180}
              height={50}
              className="img-fluid"
            />
          </Link>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            {navLinks.map((link) => (
              <li key={link.href} className="nav-item">
                <Link className="nav-link" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item mt-3">
              <Link className="btn btn-primary w-100" href="/contact?intent=strategy-call">
                Book Strategy Call
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
