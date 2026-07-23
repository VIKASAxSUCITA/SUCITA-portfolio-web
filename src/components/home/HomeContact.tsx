"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/template/ScrollReveal";
import MoveRightIcon from "@/components/icons/MoveRightIcon";
import { siteConfig } from "@/data/site";

const contactItems = [
  {
    icon: "fas fa-map-marker-alt",
    label: "Address",
    value: siteConfig.address,
  },
  {
    icon: "fas fa-envelope",
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: "fas fa-phone",
    label: "Phone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
  },
];

export default function HomeContact() {
  const [submitted, setSubmitted] = useState(false);

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
              <p className="sucita-about-label mb-3">Get in touch</p>
              <h2 className="sucita-contact-title mb-3">Contact</h2>
            </ScrollReveal>
          </div>
        </div>

        <div className="row g-4 align-items-stretch sucita-contact-grid">
          <div className="col-lg-5 d-flex">
            <ScrollReveal className="sucita-reveal-left sucita-contact-reveal">
              <div className="sucita-contact-info">
                <div className="sucita-contact-info-main">
                  <h3 className="sucita-contact-info-title">Contact info</h3>
                  <p className="sucita-contact-info-copy">
                    Reach Sucita & Partners directly, or send a message using the form.
                  </p>

                  <ul className="sucita-contact-list list-unstyled mb-0">
                    {contactItems.map((item) => (
                      <li key={item.label} className="sucita-contact-item">
                        <span className="sucita-contact-icon" aria-hidden="true">
                          <i className={item.icon} />
                        </span>
                        <div>
                          <p className="sucita-contact-item-label mb-1">{item.label}</p>
                          {item.href ? (
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
                    href={siteConfig.whatsapp}
                    className="sucita-contact-channel"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-whatsapp" aria-hidden="true" />
                    WhatsApp
                  </a>
                  <a
                    href={siteConfig.telegram}
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
                    <h3>Thank you</h3>
                    <p className="mb-0">
                      We&apos;ve received your message and will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="sucita-contact-form">
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label htmlFor="home-name" className="form-label">
                          Full name
                        </label>
                        <input
                          id="home-name"
                          type="text"
                          className="form-control sucita-contact-input"
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="home-email" className="form-label">
                          Email
                        </label>
                        <input
                          id="home-email"
                          type="email"
                          className="form-control sucita-contact-input"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="home-phone" className="form-label">
                          Phone / WhatsApp
                        </label>
                        <input
                          id="home-phone"
                          type="tel"
                          className="form-control sucita-contact-input"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="home-message" className="form-label">
                          Message
                        </label>
                        <textarea
                          id="home-message"
                          className="form-control sucita-contact-input"
                          rows={5}
                          required
                        />
                      </div>
                    </div>

                    <div className="sucita-contact-form-actions">
                      <button
                        type="submit"
                        className="btn btn-tertiary btn-lg d-inline-flex align-items-center gap-2"
                      >
                        Send message
                        <MoveRightIcon className="sucita-link-arrow" />
                      </button>
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
