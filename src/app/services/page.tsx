import type { Metadata } from "next";
import Link from "next/link";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import { countServiceItems } from "@/data/services";
import { getServiceCategories } from "@/lib/content/servicesStore";
import { getRequestLocale } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Services",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const locale = await getRequestLocale();
  const serviceCategories = await getServiceCategories();

  return (
    <>
      <KohostPageHeader
        title="Our Services"
        subtitle="Audit & Assurance | Accounting & Tax | Transformative Strategy"
      />

      <section className="service-section-wrap ptb-100">
        <div className="container">
          {serviceCategories.map((service, index) => {
            const title = pickLocalized(service.title, locale);
            const description = pickLocalized(service.description, locale);
            return (
              <div
                key={service.id}
                id={service.id}
                className={`row align-items-center mb-5 pb-5 ${
                  index < serviceCategories.length - 1 ? "border-bottom" : ""
                }`}
              >
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <span className="badge bg-primary mb-3">{service.letter}</span>
                  <h2>{title}</h2>
                  <p className="lead">{description}</p>
                  <ul className="list-unstyled content-feature-list">
                    {service.items.map((item) => {
                      const itemLabel = pickLocalized(item.label, locale);
                      return (
                        <li key={itemLabel}>
                          <i className="fas fa-check-circle text-success pe-2" />
                          {itemLabel}
                          {item.children?.length ? (
                            <ul className="list-unstyled mt-2 mb-0 sucita-service-page-sublist">
                              {item.children.map((child) => {
                                const childLabel = pickLocalized(child, locale);
                                return (
                                  <li key={childLabel} className="mb-1">
                                    <span className="text-muted me-2">–</span>
                                    {childLabel}
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="col-lg-6">
                  <div className="single-service p-5 rounded border gray-light-bg">
                    <h4>
                      <span className="h5 text-uppercase d-block color-primary">
                        Practice Area
                      </span>
                      {title}
                    </h4>
                    <p className="mb-0 mt-3">{description}</p>
                    <p className="mt-3 mb-0 small text-muted">
                      {countServiceItems(service)} services available
                    </p>
                    <Link
                      href={`/services/${service.id}`}
                      className="btn btn-tertiary mt-4"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
