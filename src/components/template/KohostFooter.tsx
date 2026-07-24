"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  siteConfig as defaultSite,
  navLinks,
  footerServiceLinks,
} from "@/data/site";
import { scrollToSection } from "@/lib/scrollToSection";
import { getSiteContent } from "@/lib/content/siteStore";
import type { SiteContent } from "@/lib/content/types";
import EditableText from "@/components/admin/EditableText";

type Props = {
  site?: SiteContent;
  edit?: {
    onChange: (updater: (prev: SiteContent) => SiteContent) => void;
  };
};

export default function KohostFooter({ site: siteProp, edit }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [fetchedSite, setFetchedSite] = useState<SiteContent>(defaultSite);
  const site = siteProp ?? fetchedSite;

  useEffect(() => {
    if (siteProp) return;
    void getSiteContent().then(setFetchedSite).catch(() => undefined);
  }, [siteProp]);

  const handleHashClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (edit || !href.startsWith("/#")) return;

    const hash = href.slice(1);

    if (pathname === "/") {
      event.preventDefault();
      scrollToSection(hash);
      return;
    }

    event.preventDefault();
    router.push(href);
  };

  return (
    <>
      <footer id="footer" className="footer-1 ptb-60 sucita-footer">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4">
              {edit ? (
                <span className="d-inline-block mb-3">
                  <Image
                    src="/images/sucita_logo.png"
                    alt="Sucita & Partners"
                    width={200}
                    height={55}
                    className="img-fluid"
                  />
                </span>
              ) : (
                <Link
                  href="/#home"
                  className="d-inline-block mb-3"
                  onClick={(e) => handleHashClick(e, "/#home")}
                >
                  <Image
                    src="/images/sucita_logo.png"
                    alt="Sucita & Partners"
                    width={200}
                    height={55}
                    className="img-fluid"
                  />
                </Link>
              )}
              {edit ? (
                <>
                  <EditableText
                    className="sucita-footer-copy mb-2"
                    multiline
                    value={site.footerCopy}
                    label="Footer copy"
                    onChange={(footerCopy) =>
                      edit.onChange((prev) => ({ ...prev, footerCopy }))
                    }
                  />
                  <EditableText
                    className="small mb-0"
                    value={site.tagline}
                    label="Tagline"
                    onChange={(tagline) =>
                      edit.onChange((prev) => ({ ...prev, tagline }))
                    }
                  />
                </>
              ) : (
                <>
                  <p className="sucita-footer-copy mb-2">{site.footerCopy}</p>
                  <p className="small mb-0">{site.tagline}</p>
                </>
              )}
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <h6 className="sucita-footer-heading">Quick Link</h6>
              <ul className="sucita-footer-list list-unstyled mb-0">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    {edit ? (
                      <span>{link.label}</span>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={(e) => handleHashClick(e, link.href)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-6 col-md-4 col-lg-3">
              <h6 className="sucita-footer-heading">Services</h6>
              <ul className="sucita-footer-list list-unstyled mb-0">
                {footerServiceLinks.map((link) => (
                  <li key={link.href}>
                    {edit ? (
                      <span>{link.label}</span>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={(e) => handleHashClick(e, link.href)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-md-4 col-lg-3">
              <h6 className="sucita-footer-heading">Contact Info</h6>
              <ul className="sucita-footer-contact list-unstyled mb-0">
                <li>
                  <i className="fas fa-map-marker-alt" aria-hidden="true" />
                  {edit ? (
                    <EditableText
                      value={site.address}
                      label="Address"
                      onChange={(address) =>
                        edit.onChange((prev) => ({ ...prev, address }))
                      }
                    />
                  ) : (
                    <span>{site.address}</span>
                  )}
                </li>
                <li>
                  <i className="fas fa-envelope" aria-hidden="true" />
                  {edit ? (
                    <EditableText
                      value={site.email}
                      label="Email"
                      onChange={(email) =>
                        edit.onChange((prev) => ({ ...prev, email }))
                      }
                    />
                  ) : (
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  )}
                </li>
                <li>
                  <i className="fas fa-phone" aria-hidden="true" />
                  {edit ? (
                    <EditableText
                      value={site.phone}
                      label="Phone"
                      onChange={(phone) =>
                        edit.onChange((prev) => ({ ...prev, phone }))
                      }
                    />
                  ) : (
                    <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
                  )}
                </li>
                <li>
                  <i className="fas fa-clock" aria-hidden="true" />
                  {edit ? (
                    <EditableText
                      value={site.officeHours}
                      label="Office hours"
                      onChange={(officeHours) =>
                        edit.onChange((prev) => ({ ...prev, officeHours }))
                      }
                    />
                  ) : (
                    <span>{site.officeHours}</span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <div className="footer-bottom py-3 sucita-footer-bottom">
        <div className="container">
          <p className="mb-0 small text-center text-md-start">
            &copy; {new Date().getFullYear()} Sucita. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
