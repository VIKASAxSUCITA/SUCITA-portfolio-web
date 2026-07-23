import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/template/ScrollReveal";
import MoveRightIcon from "@/components/icons/MoveRightIcon";
import { events } from "@/data/events";

function formatEventDate(value: string) {
  const date = new Date(value);
  return {
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    month: date.toLocaleDateString("en-US", { month: "short" }),
    year: date.toLocaleDateString("en-US", { year: "numeric" }),
  };
}

const latestEvents = [...events]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

export default function HomeEvents() {
  return (
    <section id="events" className="sucita-events ptb-100">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-7 text-center">
            <ScrollReveal className="sucita-reveal-up">
              <h2 className="sucita-events-title mb-3">Events</h2>
              <p className="sucita-about-body mb-0">
                Workshops, sessions, and announcements from Sucita & Partners.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="sucita-events-list">
          {latestEvents.map((event, index) => {
            const date = formatEventDate(event.date);
            return (
              <ScrollReveal
                key={event.slug}
                className="sucita-reveal-up"
                delay={index * 80}
              >
                <article className="sucita-event-row">
                  <div className="sucita-event-media">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      width={360}
                      height={200}
                      className="sucita-event-img"
                    />
                  </div>

                  <div className="sucita-event-content">
                    <div className="sucita-event-meta">
                      <span className="sucita-event-type">
                        {event.type === "announcement" ? "Announcement" : "Event"}
                      </span>
                      {event.isUpcoming ? (
                        <span className="sucita-event-status is-upcoming">Upcoming</span>
                      ) : (
                        <span className="sucita-event-status">Past</span>
                      )}
                      <span className="sucita-event-date-inline">
                        {date.day} {date.month} {date.year}
                      </span>
                    </div>
                    <h3 className="sucita-event-title">{event.title}</h3>
                    <p className="sucita-event-excerpt mb-0">{event.excerpt}</p>
                    {(event.time || event.location) && (
                      <p className="sucita-event-info mb-0">
                        {event.time ? <span>{event.time}</span> : null}
                        {event.time && event.location ? <span> · </span> : null}
                        {event.location ? <span>{event.location}</span> : null}
                      </p>
                    )}
                  </div>

                  <div className="sucita-event-action">
                    <Link
                      href={`/events/${event.slug}`}
                      className="btn btn-tertiary sucita-event-btn d-inline-flex align-items-center gap-2"
                    >
                      View details
                      <MoveRightIcon className="sucita-link-arrow" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center mt-4 mt-lg-5">
          <Link href="/events" className="btn btn-outline-primary sucita-insights-all">
            View all events
          </Link>
        </div>
      </div>
    </section>
  );
}
