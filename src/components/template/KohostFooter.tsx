import Link from "next/link";
import Image from "next/image";
import {
  siteConfig,
  navLinks,
  footerServiceLinks,
} from "@/data/site";

export default function KohostFooter() {
  return (
    <>
      <footer className="footer-1 ptb-60 sucita-footer">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4">
              <Link href="/" className="d-inline-block mb-3">
                <Image
                  src="/images/sucita_logo.png"
                  alt="Sucita & Partners"
                  width={200}
                  height={55}
                  className="img-fluid"
                />
              </Link>
              <p className="sucita-footer-copy mb-2">
                We simplify financial complexity and protect client interests through
                accountable accounting, tax, audit, and compliance services.
              </p>
              <p className="small mb-0">{siteConfig.tagline}</p>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <h6 className="sucita-footer-heading">Quick Link</h6>
              <ul className="sucita-footer-list list-unstyled mb-0">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-6 col-md-4 col-lg-3">
              <h6 className="sucita-footer-heading">Services</h6>
              <ul className="sucita-footer-list list-unstyled mb-0">
                {footerServiceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-md-4 col-lg-3">
              <h6 className="sucita-footer-heading">Contact Info</h6>
              <ul className="sucita-footer-contact list-unstyled mb-0">
                <li>
                  <i className="fas fa-map-marker-alt" aria-hidden="true" />
                  <span>{siteConfig.address}</span>
                </li>
                <li>
                  <i className="fas fa-envelope" aria-hidden="true" />
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </li>
                <li>
                  <i className="fas fa-phone" aria-hidden="true" />
                  <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                    {siteConfig.phone}
                  </a>
                </li>
                <li>
                  <i className="fas fa-clock" aria-hidden="true" />
                  <span>{siteConfig.officeHours}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <div className="footer-bottom py-3 sucita-footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <p className="mb-0 small">
                &copy; {new Date().getFullYear()} Sucita. All rights reserved.
              </p>
            </div>
            <div className="col-md-5 text-md-end mt-2 mt-md-0">
              <Link className="small me-3" href="/terms">
                Terms & Conditions
              </Link>
              <Link className="small" href="/privacy-policy">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
