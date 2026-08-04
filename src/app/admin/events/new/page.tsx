"use client";

import AdminEventEditor from "@/components/admin/AdminEventEditor";

export default function AdminNewEventPage() {
  return (
    <AdminEventEditor
      mode="create"
      initial={{
        slug: "",
        type: "",
        title: "",
        excerpt: "",
        description: [],
        bodyHtml: "<p></p>",
        date: new Date().toISOString().slice(0, 10),
        time: "",
        location: "",
        isUpcoming: true,
        coverImage: "",
      }}
    />
  );
}
