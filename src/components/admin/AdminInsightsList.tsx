"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { listInsights } from "@/lib/content/insightsStore";
import {
  insightCategories,
  type InsightCategory,
} from "@/data/insights";
import type { CmsInsight } from "@/lib/content/types";
import { pickLocalized } from "@/lib/i18n/config";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isInsightCategory(value?: string | null): value is InsightCategory {
  return !!value && insightCategories.includes(value as InsightCategory);
}

export default function AdminInsightsListPage() {
  const [items, setItems] = useState<CmsInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await listInsights();
        if (active) setItems(data);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const activeCategory = isInsightCategory(category) ? category : null;
  const filtered = useMemo(() => {
    const list = activeCategory
      ? items.filter((item) => item.category === activeCategory)
      : items;
    return [...list].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [items, activeCategory]);

  return (
    <AdminGuard>
      <AdminShell pageTitle="Insights">
        <div className="admin-site admin-collection-page">
          <header className="admin-collection-hero">
            <div className="container">
              <p className="admin-collection-kicker">Admin</p>
              <h1 className="admin-collection-title">Insights</h1>
              <p className="admin-collection-sub mb-0">
                Same layout as the public insights page — click a card to edit, or
                create a new one.
              </p>
            </div>
          </header>

          <section className="ptb-100 sucita-insights-page">
            <div className="container">
              {loading ? (
                <p className="admin-lead">Loading insights…</p>
              ) : (
                <>
                  <div className="sucita-insights-filters mb-5">
                    <button
                      type="button"
                      className={`sucita-insights-filter ${!activeCategory ? "is-active" : ""}`}
                      onClick={() => setCategory(null)}
                    >
                      All ({items.length})
                    </button>
                    {insightCategories.map((cat) => {
                      const count = items.filter((item) => item.category === cat).length;
                      return (
                        <button
                          key={cat}
                          type="button"
                          className={`sucita-insights-filter ${
                            activeCategory === cat ? "is-active" : ""
                          }`}
                          onClick={() => setCategory(cat)}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-lg-4 mb-4">
                      <Link
                        href="/admin/insights/new"
                        className="text-decoration-none"
                      >
                        <article className="sucita-insight-list-card admin-create-card h-100">
                          <div className="admin-create-card-inner">
                            <span className="admin-create-card-plus" aria-hidden="true">
                              +
                            </span>
                            <h5 className="sucita-insight-list-title mb-2">
                              Create insight
                            </h5>
                            <p className="sucita-insight-list-excerpt mb-0">
                              Open the editor to write a new article or project with
                              rich text.
                            </p>
                          </div>
                        </article>
                      </Link>
                    </div>

                    {filtered.map((item) => (
                      <div key={item.id} className="col-md-6 col-lg-4 mb-4">
                        <Link
                          href={`/admin/insights/${item.id}/edit`}
                          className="text-decoration-none"
                        >
                          <article className="sucita-insight-list-card h-100">
                            <div className="sucita-insight-list-media">
                              <Image
                                src={item.coverImage || "/assets/img/insights/vat-refund-cover.png"}
                                alt={pickLocalized(item.title, "en")}
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
                              <h5 className="sucita-insight-list-title">
                                {pickLocalized(item.title, "en")}
                              </h5>
                              <p className="sucita-insight-list-excerpt mb-0">
                                {pickLocalized(item.excerpt, "en")}
                              </p>
                              <span className="admin-card-edit-hint">Click to edit</span>
                            </div>
                          </article>
                        </Link>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
