"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/template/ScrollReveal";
import MoveRightIcon from "@/components/icons/MoveRightIcon";
import EditableText from "@/components/admin/EditableText";
import { siteConfig as defaultSite } from "@/data/site";
import type { SiteContent } from "@/lib/content/types";
import type { HomeContactBlock } from "@/lib/content/homeTypes";
import { defaultHomeContent } from "@/lib/content/homeDefaults";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedCopy } from "@/lib/i18n/useLocalizedCopy";

type Props = {
  content?: HomeContactBlock;
  site?: SiteContent;
  /** Hide the "open full contact page" link (e.g. on the contact page itself). */
  showFullLink?: boolean;
  edit?: {
    onChangeContent: (
      updater: (prev: HomeContactBlock) => HomeContactBlock
    ) => void;
    onChangeSite: (updater: (prev: SiteContent) => SiteContent) => void;
  };
};

export default function HomeContact({
  content = defaultHomeContent.contact,
  site = defaultSite,
  showFullLink = true,
  edit,
}: Props) {
  const { t } = useLocale();
  const copy = useLocalizedCopy();
  const [submitted, setSubmitted] = useState(false);
  const contactItems = useMemo(
    () => [
      {
        icon: "fas fa-map-marker-alt",
        labelKey: "home.contact.address" as const,
        label: "Address",
        field: "address" as const,
        value: site.address,
      },
      {
        icon: "fas fa-envelope",
        labelKey: "home.contact.email" as const,
        label: "Email",
        field: "email" as const,
        value: site.email,
        href: `mailto:${site.email}`,
      },
      {
        icon: "fas fa-phone",
        labelKey: "home.contact.phone" as const,
        label: "Phone",
        field: "phone" as const,
        value: site.phone,
        href: `tel:${site.phone.replace(/\s/g, "")}`,
      },
    ],
    [site]
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="sucita-contact ptb-100">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-7 text-center">
            <ScrollReveal className="sucita-reveal-up">
              {edit ? (
                <>
                  <EditableText
                    className="sucita-about-label mb-3"
                    value={content.label}
                    label="Contact label"
                    onChange={(label) =>
                      edit.onChangeContent((prev) => ({ ...prev, label }))
                    }
                  />
                  <EditableText
                    className="sucita-contact-title mb-3"
                    value={content.title}
                    label="Contact title"
                    onChange={(title) =>
                      edit.onChangeContent((prev) => ({ ...prev, title }))
                    }
                  />
                </>
              ) : (
                <>
                  <p className="sucita-about-label mb-3">
                    {copy(content.label, "home.contact.label")}
                  </p>
                  <h2 className="sucita-contact-title mb-3">
                    {copy(content.title, "home.contact.title")}
                  </h2>
                </>
              )}
            </ScrollReveal>
          </div>
        </div>

        <div className="row g-4 align-items-stretch sucita-contact-grid">
          <div className="col-lg-5 d-flex">
            <ScrollReveal className="sucita-reveal-left sucita-contact-reveal">
              <div className="sucita-contact-info">
                <div className="sucita-contact-info-main">
                  {edit ? (
                    <>
                      <EditableText
                        className="sucita-contact-info-title"
                        value={content.infoTitle}
                        label="Info title"
                        onChange={(infoTitle) =>
                          edit.onChangeContent((prev) => ({ ...prev, infoTitle }))
                        }
                      />
                      <EditableText
                        className="sucita-contact-info-copy"
                        multiline
                        value={content.infoCopy}
                        label="Info copy"
                        onChange={(infoCopy) =>
                          edit.onChangeContent((prev) => ({ ...prev, infoCopy }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="sucita-contact-info-title">
                        {copy(content.infoTitle, "home.contact.infoTitle")}
                      </h3>
                      <p className="sucita-contact-info-copy">
                        {copy(content.infoCopy, "home.contact.infoCopy")}
                      </p>
                    </>
                  )}

                  <ul className="sucita-contact-list list-unstyled mb-0">
                    {contactItems.map((item) => (
                      <li key={item.label} className="sucita-contact-item">
                        <span className="sucita-contact-icon" aria-hidden="true">
                          <i className={item.icon} />
                        </span>
                        <div>
                          <p className="sucita-contact-item-label mb-1">
                            {t(item.labelKey)}
                          </p>
                          {edit ? (
                            <EditableText
                              className="sucita-contact-item-value"
                              value={item.value}
                              label={item.label}
                              onChange={(value) =>
                                edit.onChangeSite((prev) => ({
                                  ...prev,
                                  [item.field]: value,
                                }))
                              }
                            />
                          ) : item.href ? (
                            <a href={item.href} className="sucita-contact-item-value">
                              {item.value}
                            </a>
                          ) : (
                            <p className="sucita-contact-item-value mb-0">{item.value}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sucita-contact-channels">
                  <a
                    href={site.whatsapp}
                    className="sucita-contact-channel"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-whatsapp" aria-hidden="true" />
                    WhatsApp
                  </a>
                  <a
                    href={site.telegram}
                    className="sucita-contact-channel"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-telegram-plane" aria-hidden="true" />
                    Telegram
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="col-lg-7 d-flex">
            <ScrollReveal className="sucita-reveal-right sucita-contact-reveal">
              <div className="sucita-contact-form-wrap">
                {submitted ? (
                  <div className="sucita-contact-success">
                    <h3>{t("home.contact.thankYou")}</h3>
                    <p className="mb-0">{t("home.contact.thankYouCopy")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="sucita-contact-form">
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label htmlFor="home-name" className="form-label">
                          {t("home.contact.fullName")}
                        </label>
                        <input
                          id="home-name"
                          type="text"
                          className="form-control sucita-contact-input"
                          required
                          disabled={!!edit}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="home-email" className="form-label">
                          {t("home.contact.email")}
                        </label>
                        <input
                          id="home-email"
                          type="email"
                          className="form-control sucita-contact-input"
                          required
                          disabled={!!edit}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="home-phone" className="form-label">
                          {t("home.contact.phoneField")}
                        </label>
                        <input
                          id="home-phone"
                          type="tel"
                          className="form-control sucita-contact-input"
                          disabled={!!edit}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="home-message" className="form-label">
                          {t("home.contact.message")}
                        </label>
                        <textarea
                          id="home-message"
                          className="form-control sucita-contact-input"
                          rows={5}
                          required
                          disabled={!!edit}
                        />
                      </div>
                    </div>

                    <div className="sucita-contact-form-actions">
                      <button
                        type="submit"
                        className="btn btn-tertiary btn-lg d-inline-flex align-items-center gap-2"
                        disabled={!!edit}
                      >
                        {t("contact.send")}
                        <MoveRightIcon className="sucita-link-arrow" />
                      </button>
                      {edit ? (
                        <span className="admin-muted">Form preview only</span>
                      ) : showFullLink ? (
                        <Link href="/contact" className="read-more-link">
                          {t("home.contact.openFull")}
                        </Link>
                      ) : null}
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
