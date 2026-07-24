import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import {
  insightCategories,
  type InsightCategory,
} from "@/data/insights";
import { getPublicInsights } from "@/lib/content/insightsStore";

export const metadata: Metadata = {
  title: "Insights",
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ category?: string }> };

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isInsightCategory(value?: string): value is InsightCategory {
  return !!value && insightCategories.includes(value as InsightCategory);
}

export default async function InsightsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = isInsightCategory(category) ? category : null;
  const insights = await getPublicInsights();

  const filtered = activeCategory
    ? insights.filter((item) => item.category === activeCategory)
    : insights;

  const sortedInsights = [...filtered].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <>
      <KohostPageHeader
        title="Insights"
        subtitle="Articles, project highlights, and practical guidance from our team."
      />

      <section className="ptb-100 sucita-insights-page">
        <div className="container">
          <div className="sucita-insights-filters mb-5">
            <Link
              href="/insights"
              className={`sucita-insights-filter ${!activeCategory ? "is-active" : ""}`}
            >
              All ({insights.length})
            </Link>
            {insightCategories.map((cat) => {
              const count = insights.filter((item) => item.category === cat).length;
              return (
                <Link
                  key={cat}
                  href={`/insights?category=${encodeURIComponent(cat)}`}
                  className={`sucita-insights-filter ${
                    activeCategory === cat ? "is-active" : ""
                  }`}
                >
                  {cat} ({count})
                </Link>
              );
            })}
          </div>

          {sortedInsights.length === 0 ? (
            <p className="sucita-about-body text-center mb-0">
              No insights in this category yet.
            </p>
          ) : (
            <div className="row">
              {sortedInsights.map((item) => (
                <div key={item.slug} className="col-md-6 col-lg-4 mb-4">
                  <Link href={`/insights/${item.slug}`} className="text-decoration-none">
                    <article className="sucita-insight-list-card h-100">
                      <div className="sucita-insight-list-media">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          width={640}
                          height={400}
                          className="sucita-insight-list-img"
                        />
                        <span className="sucita-insight-type sucita-insight-type--overlay is-article">
                          {item.category}
                        </span>
                      </div>
                      <div className="sucita-insight-list-body">
                        <small className="sucita-insight-date d-block mb-2">
                          {formatDate(item.publishedAt)}
                        </small>
                        <h5 className="sucita-insight-list-title">{item.title}</h5>
                        <p className="sucita-insight-list-excerpt mb-0">{item.excerpt}</p>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
