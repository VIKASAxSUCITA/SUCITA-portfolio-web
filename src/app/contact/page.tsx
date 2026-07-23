"use client";

import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import { siteConfig } from "@/data/site";
import { getServiceLabels, serviceCategories } from "@/data/services";

function ContactContent() {
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");
  const defaultIntent = intent === "proposal" ? "proposal" : "strategy-call";
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <KohostPageHeader
        title="Contact / Get Proposal"
        subtitle="Request a proposal, book a consultation, or reach us directly."
      />

      <section className="contact-us-section ptb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mb-5 mb-lg-0">
              <div className="section-heading mb-4">
                <h2>{defaultIntent === "proposal" ? "Request Proposal" : "Book Consultation"}</h2>
                <p>Fill out the form and we&apos;ll respond within 1–2 business days.</p>
              </div>

              {submitted ? (
                <div className="alert alert-success">
                  Thank you! We&apos;ve received your message and will respond shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-us-form">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group mb-3">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" id="firstName" required />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group mb-3">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" className="form-control" id="lastName" required />
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="company">Company / Organization</label>
                    <input type="text" className="form-control" id="company" />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" required />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="phone">Phone / WhatsApp</label>
                    <input type="tel" className="form-control" id="phone" />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="service">Service of Interest</label>
                    <select className="form-control" id="service">
                      {serviceCategories.map((cat) => (
                        <optgroup key={cat.id} label={cat.title}>
                          {getServiceLabels(cat).map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="message">Message</label>
                    <textarea className="form-control" id="message" rows={5} required />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {defaultIntent === "proposal" ? "Request Proposal" : "Book Consultation"}
                  </button>
                </form>
              )}
            </div>

            <div className="col-lg-5">
              <div className="section-heading mb-4">
                <h2>Reach Us Directly</h2>
                <p>Email, WhatsApp, or Telegram — we&apos;re here to help.</p>
              </div>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="fas fa-envelope color-primary me-2" />
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </li>
                <li className="mb-3">
                  <i className="fab fa-whatsapp color-primary me-2" />
                  <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </li>
                <li className="mb-3">
                  <i className="fab fa-telegram color-primary me-2" />
                  <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer">
                    Message on Telegram
                  </a>
                </li>
                <li className="mb-3">
                  <i className="fas fa-phone color-primary me-2" />
                  {siteConfig.phone}
                </li>
                <li>
                  <i className="fas fa-clock color-primary me-2" />
                  {siteConfig.officeHours}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center">Loading...</div>}>
      <ContactContent />
    </Suspense>
  );
}
