import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import { getPublicEvents } from "@/lib/content/eventsStore";

export const metadata: Metadata = {
  title: "Events",
};

export const dynamic = "force-dynamic";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function EventsPage() {
  const events = await getPublicEvents();
  const upcoming = events.filter((item) => item.isUpcoming);
  const past = events.filter((item) => !item.isUpcoming);

  return (
    <>
      <KohostPageHeader
        title="Events & Announcements"
        subtitle="Workshops, information sessions, and firm updates."
      />

      <section className="ptb-100">
        <div className="container">
          {upcoming.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-4" style={{ color: "#083d36" }}>
                Upcoming
              </h3>
              <div className="row">
                {upcoming.map((event) => (
                  <div key={event.slug} className="col-md-6 mb-4">
                    <Link href={`/events/${event.slug}`} className="text-decoration-none">
                      <article className="sucita-insight-list-card h-100">
                        <div className="sucita-insight-list-media">
                          <Image
                            src={event.coverImage}
                            alt={event.title}
                            width={640}
                            height={400}
                            className="sucita-insight-list-img"
                          />
                          <span className="sucita-insight-type sucita-insight-type--overlay is-project">
                            {event.type === "event" ? "Event" : "Announcement"}
                          </span>
                        </div>
                        <div className="sucita-insight-list-body">
                          <small className="sucita-insight-date d-block mb-2">
                            {formatDate(event.date)}
                          </small>
                          <h5 className="sucita-insight-list-title">{event.title}</h5>
                          <p className="sucita-insight-list-excerpt mb-0">{event.excerpt}</p>
                        </div>
                      </article>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="mb-4" style={{ color: "#083d36" }}>
                Past
              </h3>
              <div className="row">
                {past.map((event) => (
                  <div key={event.slug} className="col-md-6 mb-4">
                    <Link href={`/events/${event.slug}`} className="text-decoration-none">
                      <article className="sucita-insight-list-card h-100">
                        <div className="sucita-insight-list-media">
                          <Image
                            src={event.coverImage}
                            alt={event.title}
                            width={640}
                            height={400}
                            className="sucita-insight-list-img"
                          />
                          <span className="sucita-insight-type sucita-insight-type--overlay is-article">
                            {event.type === "event" ? "Event" : "Announcement"}
                          </span>
                        </div>
                        <div className="sucita-insight-list-body">
                          <small className="sucita-insight-date d-block mb-2">
                            {formatDate(event.date)}
                          </small>
                          <h5 className="sucita-insight-list-title">{event.title}</h5>
                          <p className="sucita-insight-list-excerpt mb-0">{event.excerpt}</p>
                        </div>
                      </article>
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
