"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Insight } from "@/data/insights";
import MoveRightIcon from "@/components/icons/MoveRightIcon";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type Props = { items: Insight[] };

export default function HomeInsights({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const latestInsights = [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const scrollByCard = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".sucita-insight-card");
    const amount = card ? card.offsetWidth + 20 : 320;
    track.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="insights" className="sucita-insights ptb-100">
      <div className="container">
        <div className="sucita-insights-head">
          <div>
            <p className="sucita-about-label mb-3">Articles & work</p>
            <h2 className="sucita-insights-title mb-2">Insights</h2>
          </div>
          <div className="sucita-insights-controls">
            <button
              type="button"
              className="sucita-insights-nav"
              aria-label="Scroll insights left"
              onClick={() => scrollByCard("prev")}
            >
              <i className="fas fa-chevron-left" />
            </button>
            <button
              type="button"
              className="sucita-insights-nav"
              aria-label="Scroll insights right"
              onClick={() => scrollByCard("next")}
            >
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid sucita-insights-rail-wrap">
        <div className="container">
          <div className="sucita-insights-track" ref={trackRef}>
            {latestInsights.map((item) => (
              <article key={item.slug} className="sucita-insight-card">
                <div className="sucita-insight-card-media">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    width={640}
                    height={400}
                    className="sucita-insight-card-img"
                  />
                  <span className="sucita-insight-type sucita-insight-type--overlay is-article">
                    {item.category}
                  </span>
                </div>
                <div className="sucita-insight-card-body">
                  <div className="sucita-insight-card-meta">
                    <span className="sucita-insight-date">{formatDate(item.publishedAt)}</span>
                  </div>
                  <h3 className="sucita-insight-card-title">{item.title}</h3>
                  <p className="sucita-insight-excerpt">{item.excerpt}</p>
                  {item.type === "project" && item.client ? (
                    <p className="sucita-insight-client mb-3">{item.client}</p>
                  ) : null}
                  <Link
                    href={`/insights/${item.slug}`}
                    className="read-more-link d-inline-flex align-items-center gap-2"
                  >
                    Read more
                    <MoveRightIcon className="sucita-link-arrow" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="container mt-3 text-center">
        <Link href="/insights" className="btn btn-outline-primary sucita-insights-all">
          View all insights
        </Link>
      </div>
    </section>
  );
}
