import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import RichHtml from "@/components/template/RichHtml";
import PlayIcon from "@/components/icons/PlayIcon";
import { countServiceItems } from "@/data/services";
import { resolveBodyHtml } from "@/lib/content/richText";
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

function getServiceIcon(id: string) {
  switch (id) {
    case "audit-assurance":
      return "fas fa-shield-alt";
    case "accounting-tax":
      return "fas fa-calculator";
    case "transformative-strategy":
      return "fas fa-chart-line";
    default:
      return "fas fa-briefcase";
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getRequestLocale();
  const categories = await getServiceCategories();
  const service = categories.find((item) => item.id === id);
  if (!service) notFound();

  const title = pickLocalized(service.title, locale);
  const description = pickLocalized(service.description, locale);
  const bodyHtml = resolveBodyHtml(service.bodyHtml, undefined, locale);
  const hasBody = bodyHtml.replace(/<[^>]+>/g, "").trim().length > 0;
  const coverImage = service.coverImage || "/images/service_details.png";
  const others = categories.filter((item) => item.id !== service.id);
  const itemCount = countServiceItems(service);

  return (
    <>
      <section className="sucita-service-banner overflow-hidden">
        <div
          className="sucita-service-banner-media"
          style={{ backgroundImage: `url(${coverImage})` }}
          aria-hidden="true"
        />
        <div className="sucita-service-banner-overlay" aria-hidden="true" />
        <div className="container position-relative">
          <div className="row align-items-center sucita-service-banner-row">
            <div className="col-lg-8 col-xl-7">
              <div className="sucita-service-banner-content text-white">
                <span className="sucita-service-banner-letter">
                  <i className={getServiceIcon(service.id)} aria-hidden="true" />
                </span>
                <h1 className="text-white">{title}</h1>
                <p className="lead">{description}</p>
                <div className="action-btns mt-4">
                  <Link href="/contact" className="btn btn-tertiary btn-lg me-2">
                    Contact us about this service
                  </Link>
                  <Link href="/services" className="btn btn-outline-light btn-lg">
                    Back to Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sucita-service-detail">
        <div className="container">
          <div className="sucita-service-detail-cover d-lg-none mb-4">
            <Image
              src={coverImage}
              alt={title}
              width={1200}
              height={700}
              className="sucita-insight-main-img"
              priority
            />
          </div>

          <div className="sucita-service-detail-head">
            <div>
              <p className="sucita-about-label mb-2">What we offer</p>
              <h2 className="sucita-service-detail-heading">
                {itemCount > 0
                  ? `${itemCount} services in this practice area`
                  : "What's included in this service"}
              </h2>
            </div>
            <p className="sucita-service-detail-head-copy mb-0">
              Explore the full scope of {title} — from core workstreams to
              specialized support for your team.
            </p>
          </div>

          {itemCount > 0 ? (
            <ul className="list-unstyled sucita-service-detail-grid">
              {service.items.map((item) => {
                const itemLabel = pickLocalized(item.label, locale);
                return (
                  <li key={itemLabel} className="sucita-service-detail-item">
                    <span className="sucita-service-check" aria-hidden="true">
                      <i className="fas fa-check" />
                    </span>
                    <div className="sucita-service-detail-item-body">
                      <h3 className="sucita-service-detail-item-title">
                        {itemLabel}
                      </h3>
                      {item.children?.length ? (
                        <ul className="list-unstyled sucita-service-detail-children">
                          {item.children.map((child) => {
                            const childLabel = pickLocalized(child, locale);
                            return (
                              <li key={childLabel}>
                                <span
                                  className="sucita-service-submark"
                                  aria-hidden="true"
                                >
                                  <PlayIcon className="sucita-service-play-icon" />
                                </span>
                                {childLabel}
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : hasBody ? (
            <RichHtml
              className="sucita-article-body sucita-service-detail-content mb-5"
              html={bodyHtml}
            />
          ) : null}

          {others.length > 0 ? (
            <div className="sucita-service-detail-others">
              <p className="sucita-about-label mb-3">Other practice areas</p>
              <div className="sucita-service-detail-others-grid">
                {others.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/services/${cat.id}`}
                    className="sucita-service-card sucita-service-detail-other-card text-decoration-none"
                  >
                    <span className="sucita-service-card-accent" aria-hidden="true" />
                    <header className="sucita-service-card-header">
                      <div className="sucita-service-card-top">
                        <span className="sucita-service-letter" aria-hidden="true">
                          <i className={getServiceIcon(cat.id)} />
                        </span>
                        <div>
                          <p className="sucita-service-practice mb-1">
                            Practice area
                          </p>
                          <h3 className="sucita-service-col-title">
                            {pickLocalized(cat.title, locale)}
                          </h3>
                        </div>
                      </div>
                      <p className="sucita-service-card-desc mb-0">
                        {pickLocalized(cat.description, locale)}
                      </p>
                    </header>
                    <footer className="sucita-service-card-footer d-flex align-items-center justify-content-between gap-3 flex-wrap">
                      <span>{countServiceItems(cat)} services</span>
                      <span className="sucita-service-detail-other-cta">
                        View details →
                      </span>
                    </footer>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
