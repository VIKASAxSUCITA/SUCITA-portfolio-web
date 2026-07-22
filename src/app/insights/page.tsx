import type { Metadata } from "next";
import Link from "next/link";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import { insights, getInsightsByType } from "@/data/insights";

export const metadata: Metadata = {
  title: "Insights",
};

type Props = { searchParams: Promise<{ type?: string }> };

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function InsightsPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const articles = getInsightsByType("article");
  const projects = getInsightsByType("project");
  const showArticles = !type || type === "article";
  const showProjects = !type || type === "project";

  return (
    <>
      <KohostPageHeader
        title="Insights"
        subtitle="Articles, project highlights, and practical guidance from our team."
      />

      <section className="ptb-100">
        <div className="container">
          <div className="mb-5">
            <Link href="/insights" className={`btn btn-sm me-2 ${!type ? "btn-primary" : "btn-outline-primary"}`}>
              All ({insights.length})
            </Link>
            <Link href="/insights?type=article" className={`btn btn-sm me-2 ${type === "article" ? "btn-primary" : "btn-outline-primary"}`}>
              Articles ({articles.length})
            </Link>
            <Link href="/insights?type=project" className={`btn btn-sm ${type === "project" ? "btn-primary" : "btn-outline-primary"}`}>
              Projects ({projects.length})
            </Link>
          </div>

          {showArticles && (
            <div className="mb-5">
              <h3 className="mb-4">Articles</h3>
              <div className="row">
                {articles.map((item) => (
                  <div key={item.slug} className="col-md-6 col-lg-4 mb-4">
                    <Link href={`/insights/${item.slug}`} className="text-decoration-none">
                      <div className="card single-promo-card h-100 p-3">
                        <span className="badge bg-primary mb-2">Article</span>
                        <small className="text-muted d-block mb-2">{formatDate(item.publishedAt)}</small>
                        <h5>{item.title}</h5>
                        <p className="mb-0 small">{item.excerpt}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showProjects && (
            <div>
              <h3 className="mb-4">Projects & Client Work</h3>
              <div className="row">
                {projects.map((item) => (
                  <div key={item.slug} className="col-md-6 col-lg-4 mb-4">
                    <Link href={`/insights/${item.slug}`} className="text-decoration-none">
                      <div className="card single-promo-card h-100 p-3">
                        <span className="badge bg-success mb-2">Project</span>
                        <small className="text-muted d-block mb-2">{formatDate(item.publishedAt)}</small>
                        <h5>{item.title}</h5>
                        <p className="mb-0 small">{item.excerpt}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
