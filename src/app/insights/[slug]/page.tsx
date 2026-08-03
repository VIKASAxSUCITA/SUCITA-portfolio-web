import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getPublicInsightBySlug,
  getPublicInsights,
} from "@/lib/content/insightsStore";
import RichHtml from "@/components/template/RichHtml";
import { resolveBodyHtml } from "@/lib/content/richText";
import { getRequestLocale } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const insights = await getPublicInsights();
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicInsightBySlug(slug);
  return { title: pickLocalized(item?.title, "en") || "Not Found" };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const item = await getPublicInsightBySlug(slug);
  if (!item) notFound();

  const gallery = item.galleryImages ?? [];
  const title = pickLocalized(item.title, locale);
  const excerpt = pickLocalized(item.excerpt, locale);

  return (
    <>
      <section className="page-header-section ptb-100 gradient-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-white text-center">
              <Link href="/insights" className="text-white-50 small">
                ← Back to Insights
              </Link>
              <span className="sucita-insight-type ms-2 is-article-light">
                {item.category}
              </span>
              <h1 className="text-white mt-3">{title}</h1>
              <p className="lead mb-2">{excerpt}</p>
              <p className="mb-0 small text-white-50">{formatDate(item.publishedAt)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ptb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="sucita-insight-main-media mb-4 mb-lg-5">
                <Image
                  src={item.coverImage}
                  alt={title}
                  width={1200}
                  height={700}
                  className="sucita-insight-main-img"
                  priority
                />
              </div>

              {(item.client || item.service) && (
                <div className="sucita-insight-detail-meta mb-4">
                  {item.client ? (
                    <p className="mb-1">
                      <strong>Client:</strong> {item.client}
                    </p>
                  ) : null}
                  {item.service ? (
                    <p className="mb-0">
                      <strong>Service:</strong> {item.service}
                    </p>
                  ) : null}
                </div>
              )}

              <RichHtml
                className="sucita-article-body"
                html={resolveBodyHtml(item.bodyHtml, item.content, locale)}
              />

              {gallery.length > 0 ? (
                <div className="sucita-insight-gallery mt-5">
                  <h3 className="sucita-insight-gallery-title mb-3">
                    {item.type === "project" ? "Project evidence" : "Related visuals"}
                  </h3>
                  <p className="sucita-about-body mb-4">
                    Supporting images from this{" "}
                    {item.type === "project" ? "engagement" : "topic"}.
                  </p>
                  <div className="sucita-insight-gallery-grid">
                    {gallery.map((src, index) => (
                      <div key={src} className="sucita-insight-gallery-item">
                        <Image
                          src={src}
                          alt={`${item.title} evidence ${index + 1}`}
                          width={800}
                          height={560}
                          className="sucita-insight-gallery-img"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
