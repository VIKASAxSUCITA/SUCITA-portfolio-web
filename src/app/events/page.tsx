import type { Metadata } from "next";
import Link from "next/link";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import KohostCTA from "@/components/template/KohostCTA";
import { events, getUpcomingEvents, getPastEvents } from "@/data/events";

export const metadata: Metadata = {
  title: "Events",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

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
              <h3 className="mb-4">Upcoming</h3>
              <div className="row">
                {upcoming.map((event) => (
                  <div key={event.slug} className="col-md-6 mb-4">
                    <Link href={`/events/${event.slug}`} className="text-decoration-none">
                      <div className="card single-promo-card p-4 h-100">
                        <span className={`badge mb-2 ${event.type === "event" ? "bg-primary" : "bg-secondary"}`}>
                          {event.type === "event" ? "Event" : "Announcement"}
                        </span>
                        <small className="text-muted d-block">{formatDate(event.date)}</small>
                        <h5 className="mt-2">{event.title}</h5>
                        <p className="mb-0 small">{event.excerpt}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="mb-4">Past</h3>
              <div className="row">
                {past.map((event) => (
                  <div key={event.slug} className="col-md-6 mb-4">
                    <Link href={`/events/${event.slug}`} className="text-decoration-none">
                      <div className="card single-promo-card p-4 h-100 opacity-75">
                        <span className="badge bg-secondary mb-2">{event.type}</span>
                        <small className="text-muted d-block">{formatDate(event.date)}</small>
                        <h5 className="mt-2">{event.title}</h5>
                        <p className="mb-0 small">{event.excerpt}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <KohostCTA />
    </>
  );
}
