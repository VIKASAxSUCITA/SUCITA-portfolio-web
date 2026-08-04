"use client";

import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/template/ScrollReveal";
import MoveRightIcon from "@/components/icons/MoveRightIcon";
import { eventTypeLabel, type EventItem } from "@/data/events";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { sortEventsByProximity } from "@/lib/content/eventSort";

function formatEventDate(value: string) {
  const date = new Date(value);
  return {
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: date.toLocaleDateString("en-US", { year: "numeric" }),
  };
}

type Props = {
  items: EventItem[];
  viewAllHref?: string;
};

export default function HomeEvents({
  items,
  viewAllHref = "/events",
}: Props) {
  const { t, L } = useLocale();
  const latestEvents = sortEventsByProximity(items).slice(0, 3);

  return (
    <section id="events" className="sucita-events ptb-100">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-7 text-center">
            <ScrollReveal className="sucita-reveal-up">
              <h2 className="sucita-events-title mb-3">{t("home.events.title")}</h2>
              <p className="sucita-about-body mb-0">{t("home.events.intro")}</p>
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
                      alt={L(event.title)}
                      width={360}
                      height={200}
                      className="sucita-event-img"
                    />
                    <div className="sucita-event-date-badge" aria-hidden="true">
                      <span className="sucita-event-date-month">{date.month}</span>
                      <span className="sucita-event-date-day">{date.day}</span>
                      <span className="sucita-event-date-year">{date.year}</span>
                    </div>
                  </div>

                  <div className="sucita-event-content">
                    <div className="sucita-event-meta">
                      <span className="sucita-event-type">
                        {eventTypeLabel(event.type)}
                      </span>
                      {event.isUpcoming ? (
                        <span className="sucita-event-status is-upcoming">Upcoming</span>
                      ) : (
                        <span className="sucita-event-status">Past</span>
                      )}
                    </div>
                    <h3 className="sucita-event-title">{L(event.title)}</h3>
                    <p className="sucita-event-excerpt mb-0">{L(event.excerpt)}</p>
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
                      {t("events.viewDetails")}
                      <MoveRightIcon className="sucita-link-arrow" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center mt-4 mt-lg-5">
          <Link href={viewAllHref} className="btn btn-outline-primary sucita-insights-all">
            {t("home.viewAllEvents")}
          </Link>
        </div>
      </div>
    </section>
  );
}
