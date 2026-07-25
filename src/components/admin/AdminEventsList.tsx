"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { listEvents } from "@/lib/content/eventsStore";
import type { CmsEvent } from "@/lib/content/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function EventCards({
  items,
  heading,
}: {
  items: CmsEvent[];
  heading: string;
}) {
  if (!items.length) return null;
  return (
    <div className="mb-5">
      <h3 className="mb-4" style={{ color: "#083d36" }}>
        {heading}
      </h3>
      <div className="row">
        {items.map((event) => (
          <div key={event.id} className="col-md-6 mb-4">
            <Link
              href={`/admin/events/${event.id}/edit`}
              className="text-decoration-none"
            >
              <article className="sucita-insight-list-card h-100">
                <div className="sucita-insight-list-media">
                  <Image
                    src={event.coverImage || "/assets/img/events/tax-workshop.png"}
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
                  <span className="admin-card-edit-hint">Click to edit</span>
                </div>
              </article>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminEventsListPage() {
  const [items, setItems] = useState<CmsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await listEvents();
        if (active) setItems(data);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const upcoming = items.filter((item) => item.isUpcoming);
  const past = items.filter((item) => !item.isUpcoming);

  return (
    <AdminGuard>
      <AdminShell>
        <div className="admin-site admin-collection-page">
          <header className="admin-collection-hero">
            <div className="container">
              <p className="admin-collection-kicker">Admin</p>
              <h1 className="admin-collection-title">Events &amp; Announcements</h1>
              <p className="admin-collection-sub mb-0">
                Same layout as the public events page — click a card to edit, or
                create a new one.
              </p>
            </div>
          </header>

          <section className="ptb-100">
            <div className="container">
              {loading ? (
                <p className="admin-lead">Loading events…</p>
              ) : (
                <>
                  <div className="row mb-5">
                    <div className="col-md-6 mb-4">
                      <Link
                        href="/admin/events/new"
                        className="text-decoration-none"
                      >
                        <article className="sucita-insight-list-card admin-create-card h-100">
                          <div className="admin-create-card-inner">
                            <span className="admin-create-card-plus" aria-hidden="true">
                              +
                            </span>
                            <h5 className="sucita-insight-list-title mb-2">
                              Create event
                            </h5>
                            <p className="sucita-insight-list-excerpt mb-0">
                              Open the editor to add a workshop, session, or
                              announcement with rich text.
                            </p>
                          </div>
                        </article>
                      </Link>
                    </div>
                  </div>

                  <EventCards items={upcoming} heading="Upcoming" />
                  <EventCards items={past} heading="Past" />

                  {!upcoming.length && !past.length ? (
                    <p className="sucita-about-body text-center mb-0">
                      No events yet. Use Create event to add the first one.
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
