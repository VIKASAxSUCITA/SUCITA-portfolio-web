"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AdminInsightEditor from "@/components/admin/AdminInsightEditor";
import { getInsightById } from "@/lib/content/insightsStore";
import type { CmsInsight } from "@/lib/content/types";

type Props = { params: Promise<{ id: string }> };

export default function AdminEditInsightPage({ params }: Props) {
  const { id } = use(params);
  const [item, setItem] = useState<CmsInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const found = await getInsightById(id);
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
        <AdminShell title="Edit insight">
          <p className="admin-lead">Loading…</p>
        </AdminShell>
      </AdminGuard>
    );
  }

  if (missing || !item) {
    return (
      <AdminGuard>
        <AdminShell title="Insight not found">
          <p className="admin-lead">
            <Link href="/admin/insights">← Back to insights</Link>
          </p>
        </AdminShell>
      </AdminGuard>
    );
  }

  return <AdminInsightEditor mode="edit" initial={item} />;
}
