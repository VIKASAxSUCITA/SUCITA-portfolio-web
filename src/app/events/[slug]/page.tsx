import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import KohostCTA from "@/components/template/KohostCTA";
import { events, getEventBySlug } from "@/data/events";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  return { title: event?.title ?? "Not Found" };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  return (
    <>
      <section className="page-header-section ptb-100 gradient-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-white text-center">
              <Link href="/events" className="text-white-50 small">
                ← Back to Events
              </Link>
              <h1 className="text-white mt-3">{event.title}</h1>
              <p className="lead mb-0">{event.excerpt}</p>
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
                  alt={event.title}
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

              {event.description.map((p) => (
                <p key={p.slice(0, 40)} className="lead">
                  {p}
                </p>
              ))}

              {event.isUpcoming ? (
                <Link href="/contact?intent=strategy-call" className="btn btn-primary mt-3">
                  Register / Contact Us
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <KohostCTA />
    </>
  );
}
