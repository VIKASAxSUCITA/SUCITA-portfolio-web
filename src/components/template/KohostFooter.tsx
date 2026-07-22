import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site";

export default function KohostFooter() {
  return (
    <>
      <footer className="footer-1 ptb-60 sucita-footer gray-light-bg">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-4 mb-4 mb-lg-0">
              <Link href="/" className="d-block">
                <Image
                  src="/images/sucita_logo.png"
                  alt="Sucita & Partners"
                  width={200}
                  height={55}
                  className="img-fluid"
                />
              </Link>
              <br />
              <p>
                We simplify financial complexity and protect client interests through
                accountable accounting, tax, audit, and compliance services.
              </p>
              <p className="small mb-0">{siteConfig.tagline}</p>
            </div>
            <div className="col-md-12 col-lg-8">
              <div className="row mt-0">
                <div className="col-sm-6 col-md-3 mb-4 mb-md-0">
                  <h6 className="font-weight-normal">Services</h6>
                  <ul>
                    <li><Link href="/services#audit-assurance">Audit & Assurance</Link></li>
                    <li><Link href="/services#accounting-tax">Accounting & Tax</Link></li>
                    <li><Link href="/services#transformative-strategy">Transformative Strategy</Link></li>
                  </ul>
                </div>
                <div className="col-sm-6 col-md-3 mb-4 mb-md-0">
                  <h6 className="font-weight-normal">Company</h6>
                  <ul>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/insights">Insights</Link></li>
                    <li><Link href="/events">Events</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                  </ul>
                </div>
                <div className="col-sm-6 col-md-3 mb-4 mb-md-0">
                  <h6 className="font-weight-normal">Resources</h6>
                  <ul>
                    <li><Link href="/insights?type=article">Articles</Link></li>
                    <li><Link href="/insights?type=project">Projects</Link></li>
                    <li><Link href="/events">Announcements</Link></li>
                  </ul>
                </div>
                <div className="col-sm-6 col-md-3">
                  <h6 className="font-weight-normal">Legal</h6>
                  <ul>
                    <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                    <li><Link href="/terms">Terms & Conditions</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="footer-bottom py-3 gray-light-bg">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-7">
              <div className="copyright-wrap small-text">
                <p className="mb-0">
                  &copy; {new Date().getFullYear()} Sucita. All rights reserved.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-5">
              <div className="terms-policy-wrap text-lg-end text-md-end text-start">
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <Link className="small-text" href="/terms">Terms & Condition</Link>
                  </li>
                  <li className="list-inline-item">
                    <Link className="small-text" href="/privacy-policy">Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
