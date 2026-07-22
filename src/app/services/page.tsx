import type { Metadata } from "next";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import KohostCTA from "@/components/template/KohostCTA";
import { serviceCategories } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <>
      <KohostPageHeader
        title="Our Services"
        subtitle="Audit & Assurance | Accounting & Tax | Transformative Strategy"
      />

      <section className="service-section-wrap ptb-100">
        <div className="container">
          {serviceCategories.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`row align-items-center mb-5 pb-5 ${index < serviceCategories.length - 1 ? "border-bottom" : ""}`}
            >
              <div className="col-lg-6 mb-4 mb-lg-0">
                <span className="badge bg-primary mb-3">{service.letter}</span>
                <h2>{service.title}</h2>
                <p className="lead">{service.description}</p>
                <ul className="list-unstyled content-feature-list">
                  {service.items.map((item) => (
                    <li key={item}>
                      <i className="fas fa-check-circle text-success pe-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-6">
                <div className="single-service p-5 rounded border gray-light-bg">
                  <h4>
                    <span className="h5 text-uppercase d-block color-primary">Practice Area</span>
                    {service.title}
                  </h4>
                  <p className="mb-0 mt-3">{service.description}</p>
                  <p className="mt-3 mb-0 small text-muted">
                    {service.items.length} services available
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <KohostCTA />
    </>
  );
}
