import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getPublicEventBySlug,
  getPublicEvents,
} from "@/lib/content/eventsStore";
import RichHtml from "@/components/template/RichHtml";
import { resolveBodyHtml } from "@/lib/content/richText";
import { getRequestLocale } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const events = await getPublicEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  return { title: pickLocalized(event?.title, "en") || "Not Found" };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const event = await getPublicEventBySlug(slug);
  if (!event) notFound();
  const title = pickLocalized(event.title, locale);
  const excerpt = pickLocalized(event.excerpt, locale);

  return (
    <>
      <section className="page-header-section ptb-100 gradient-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-white text-center">
              <Link href="/events" className="text-white-50 small">
                ← Back to Events
              </Link>
              <h1 className="text-white mt-3">{title}</h1>
              <p className="lead mb-0">{excerpt}</p>
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
                  src={event.coverImage}
                  alt={title}
                  width={1200}
                  height={700}
                  className="sucita-insight-main-img"
                  priority
                />
              </div>

              <div className="sucita-insight-detail-meta mb-4">
                <p className="mb-1">
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {event.time ? (
                  <p className="mb-1">
                    <strong>Time:</strong> {event.time}
                  </p>
                ) : null}
                {event.location ? (
                  <p className="mb-0">
                    <strong>Location:</strong> {event.location}
                  </p>
                ) : null}
              </div>

              <RichHtml
                className="sucita-article-body"
                html={resolveBodyHtml(event.bodyHtml, event.description, locale)}
              />

              {event.isUpcoming ? (
                <Link href="/contact" className="btn btn-primary mt-3">
                  Register / Contact Us
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
