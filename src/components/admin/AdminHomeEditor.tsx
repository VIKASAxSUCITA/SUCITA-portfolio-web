"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AdminPreviewHeader from "@/components/admin/AdminPreviewHeader";
import { useHomeEditor } from "@/components/admin/useHomeEditor";
import HomeHero from "@/components/home/HomeHero";
import HomeWhatWeDo from "@/components/home/HomeWhatWeDo";
import HomeWhoWeServe from "@/components/home/HomeWhoWeServe";
import HomeStrategyCTA from "@/components/home/HomeStrategyCTA";
import HomeAbout from "@/components/home/HomeAbout";
import HomeServices from "@/components/home/HomeServices";
import HomeInsights from "@/components/home/HomeInsights";
import HomeEvents from "@/components/home/HomeEvents";
import HomeContact from "@/components/home/HomeContact";
import KohostFooter from "@/components/template/KohostFooter";
import { getPublicInsights } from "@/lib/content/insightsStore";
import { getPublicEvents } from "@/lib/content/eventsStore";
import type { Insight } from "@/data/insights";
import type { EventItem } from "@/data/events";
import type { HomePageContent } from "@/lib/content/homeTypes";

export default function AdminHomeEditor() {
  const { content, loading, saving, dirty, message, update, save } = useHomeEditor();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [listsLoading, setListsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [insightItems, eventItems] = await Promise.all([
          getPublicInsights(),
          getPublicEvents(),
        ]);
        if (!active) return;
        setInsights(insightItems);
        setEvents(eventItems);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setListsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const sectionEdit = <K extends keyof HomePageContent>(key: K) => ({
    onChange: (updater: (prev: HomePageContent[K]) => HomePageContent[K]) =>
      update((prev) => ({ ...prev, [key]: updater(prev[key]) })),
  });

  if (loading || listsLoading) {
    return (
      <AdminGuard>
        <AdminShell onSave={save} saving={saving} dirty={dirty} message={message}>
          <p className="admin-lead admin-main">Loading homepage…</p>
        </AdminShell>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminShell onSave={save} saving={saving} dirty={dirty} message={message}>
        <div className="admin-site">
          <AdminPreviewHeader />
          <main>
            <HomeHero content={content.hero} edit={sectionEdit("hero")} />
            <HomeWhatWeDo content={content.whatWeDo} edit={sectionEdit("whatWeDo")} />
            <HomeWhoWeServe
              content={content.whoWeServe}
              edit={sectionEdit("whoWeServe")}
            />
            <HomeStrategyCTA
              content={content.strategy}
              edit={sectionEdit("strategy")}
            />
            <HomeAbout content={content.about} edit={sectionEdit("about")} />
            <HomeServices
              content={content.services}
              edit={sectionEdit("services")}
            />
            <HomeInsights items={insights} viewAllHref="/admin/insights" />
            <p className="admin-section-note mb-0">
              Insights &amp; Events above/below open the admin library — create or
              edit with the rich text editor.
            </p>
            <HomeEvents items={events} viewAllHref="/admin/events" />
            <HomeContact
              content={content.contact}
              site={content.site}
              edit={{
                onChangeContent: (updater) =>
                  update((prev) => ({
                    ...prev,
                    contact: updater(prev.contact),
                  })),
                onChangeSite: (updater) =>
                  update((prev) => ({
                    ...prev,
                    site: updater(prev.site),
                  })),
              }}
            />
          </main>
          <KohostFooter
            site={content.site}
            edit={{
              onChange: (updater) =>
                update((prev) => ({
                  ...prev,
                  site: updater(prev.site),
                })),
            }}
          />
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
