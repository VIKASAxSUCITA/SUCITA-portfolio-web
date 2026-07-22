import Link from "next/link";
import Image from "next/image";
import KohostCTA from "@/components/template/KohostCTA";
import { serviceCategories, whoWeServe } from "@/data/services";

export default function HomePage() {
  return (
    <>
      {/* hero section */}
      <section className="ptb-100 overflow-hidden primary-bg">
        <div className="container">
          <div className="row align-items-center justify-content-lg-between">
            <div className="col-md-12 col-lg-5">
              <div className="hero-slider-content text-white py-5">
                <h1 className="text-white">
                  We simplify complexity and protect what your business is building
                </h1>
                <p className="lead">
                  Sucita & Partners delivers audit, accounting, tax, and transformative
                  strategy services for organizations that need clarity when compliance,
                  reporting, and growth decisions matter.
                </p>
                <div className="action-btns mt-4">
                  <Link href="/contact?intent=strategy-call" className="btn btn-tertiary btn-lg me-2">
                    Book Strategy Call
                  </Link>
                  <Link href="/services" className="btn btn-outline-light btn-lg">
                    Explore Services
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-6">
              <div className="img-wrap">
                <Image
                  src="/assets/img/hero-home.svg"
                  alt="Sucita & Partners"
                  width={600}
                  height={500}
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* value proposition card */}
      <section className="position-relative zindex-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-10">
              <div className="domain-search-wrap border gray-light-bg p-4 p-md-5">
                <div className="row">
                  <div className="col-lg-6">
                    <h4>What we do</h4>
                    <p className="mb-0">
                      Statutory audits, monthly bookkeeping, tax filing, VAT refund support,
                      internal audit, SOP development, start-up packages, and corporate
                      secretary services — delivered with integrity and independence.
                    </p>
                  </div>
                  <div className="col-lg-6 mt-4 mt-lg-0">
                    <h4>Who we serve</h4>
                    <ul className="list-unstyled content-feature-list mb-0">
                      {whoWeServe.map((item) => (
                        <li key={item}>
                          <i className="fas fa-check-circle text-success pe-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* promo section */}
      <section className="promo-section ptb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-6">
              <div className="section-heading text-center">
                <h2>Three Practice Areas. One Trusted Partner.</h2>
                <p>
                  From audit and tax compliance to strategic setup and financial control —
                  we cover the full scope of professional services your organization needs.
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-md-center">
            {serviceCategories.map((cat) => (
              <div key={cat.id} className="col-md-6 col-lg-4">
                <div className="card single-promo-card single-promo-hover text-center p-2 mt-4">
                  <div className="card-body">
                    <div className="pb-2">
                      <span className="fas fa-briefcase icon-size-lg color-primary" />
                    </div>
                    <div className="pt-2 pb-3">
                      <h5>{cat.title}</h5>
                      <p className="mb-0">{cat.description}</p>
                    </div>
                    <Link href={`/services#${cat.id}`} className="read-more-link">
                      View services <span className="fas fa-arrow-right ms-1 small" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* call to action */}
      <section className="ptb-60 primary-bg">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-7 col-lg-6">
              <div className="cta-content-wrap text-white">
                <h2 className="text-white">
                  Ready to simplify your compliance and financial operations?
                </h2>
                <p>
                  Book a strategy call or request a tailored proposal — our team will
                  respond with clear next steps for your situation.
                </p>
              </div>
              <div className="action-btns mt-4">
                <Link href="/contact?intent=strategy-call" className="btn btn-tertiary me-2">
                  Book Strategy Call
                </Link>
                <Link href="/contact?intent=proposal" className="btn btn-outline-light">
                  Request Proposal
                </Link>
              </div>
            </div>
            <div className="col-md-5 col-lg-4">
              <div className="cta-img-wrap text-center">
                <Image
                  src="/assets/img/cta-new.svg"
                  alt="Professional services"
                  width={400}
                  height={350}
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <KohostCTA />
    </>
  );
}
