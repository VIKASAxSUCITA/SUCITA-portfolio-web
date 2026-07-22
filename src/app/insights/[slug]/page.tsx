import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import KohostCTA from "@/components/template/KohostCTA";
import { insights, getInsightBySlug } from "@/data/insights";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getInsightBySlug(slug);
  return { title: item?.title ?? "Not Found" };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getInsightBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <section className="page-header-section ptb-100 gradient-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-white text-center">
              <Link href="/insights" className="text-white-50 small">← Back to Insights</Link>
              <span className={`badge ms-2 ${item.type === "article" ? "bg-primary" : "bg-success"}`}>
                {item.type === "article" ? "Article" : "Project"}
              </span>
              <h1 className="text-white mt-3">{item.title}</h1>
              <p className="lead mb-0">{item.excerpt}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ptb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {item.content.map((p) => (
                <p key={p.slice(0, 40)} className="lead">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <KohostCTA />
    </>
  );
}
