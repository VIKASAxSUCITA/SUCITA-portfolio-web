"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AdminEventEditor from "@/components/admin/AdminEventEditor";
import { getEventById } from "@/lib/content/eventsStore";
import type { CmsEvent } from "@/lib/content/types";

type Props = { params: Promise<{ id: string }> };

export default function AdminEditEventPage({ params }: Props) {
  const { id } = use(params);
  const [item, setItem] = useState<CmsEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const found = await getEventById(id);
        if (!active) return;
        if (!found) setMissing(true);
        else setItem(found);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <AdminGuard>
        <AdminShell title="Edit event">
          <p className="admin-lead">Loading…</p>
        </AdminShell>
      </AdminGuard>
    );
  }

  if (missing || !item) {
    return (
      <AdminGuard>
        <AdminShell title="Event not found">
          <p className="admin-lead">
            <Link href="/admin/events">← Back to events</Link>
          </p>
        </AdminShell>
      </AdminGuard>
    );
  }

  return <AdminEventEditor mode="edit" initial={item} />;
}
