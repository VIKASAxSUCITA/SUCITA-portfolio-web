import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  countServiceItems,
  getServiceLabels,
} from "@/data/services";
import { getServiceCategories } from "@/lib/content/servicesStore";
import { getRequestLocale } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const categories = await getServiceCategories();
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const categories = await getServiceCategories();
  const service = categories.find((item) => item.id === id);
  return { title: pickLocalized(service?.title, "en") || "Service" };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getRequestLocale();
  const categories = await getServiceCategories();
  const service = categories.find((item) => item.id === id);
  if (!service) notFound();

  const title = pickLocalized(service.title, locale);
  const description = pickLocalized(service.description, locale);
  const labels = getServiceLabels(service);

  return (
    <>
      <section className="page-header-section ptb-100 gradient-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-white text-center">
              <Link href="/services" className="text-white-50 small">
                ← Back to Services
              </Link>
              <span className="d-block mt-3 badge bg-light text-dark">
                {service.letter}
              </span>
              <h1 className="text-white mt-3">{title}</h1>
              <p className="lead mb-0">{description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ptb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <p className="sucita-about-body mb-4">
                {countServiceItems(service)} services in this practice area.
              </p>
              <ul className="list-unstyled content-feature-list sucita-service-detail-list">
                {service.items.map((item) => {
                  const itemLabel = pickLocalized(item.label, locale);
                  return (
                  <li key={itemLabel} className="mb-3">
                    <i className="fas fa-check-circle text-success pe-2" />
                    <strong>{itemLabel}</strong>
                    {item.children?.length ? (
                      <ul className="list-unstyled mt-2 mb-0 ms-4">
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

              <div className="mt-5 p-4 rounded border gray-light-bg">
                <h3 className="h5 mb-3">Included capabilities</h3>
                <div className="d-flex flex-wrap gap-2">
                  {labels.map((label) => (
                    <span key={label} className="badge bg-light text-dark border">
                      {label}
                    </span>
                  ))}
                </div>
                <Link href="/contact" className="btn btn-tertiary mt-4">
                  Contact us about this service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
