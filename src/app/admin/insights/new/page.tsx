"use client";

import AdminInsightEditor from "@/components/admin/AdminInsightEditor";

export default function AdminNewInsightPage() {
  return (
    <AdminInsightEditor
      mode="create"
      initial={{
        slug: "",
        type: "article",
        title: "",
        excerpt: "",
        content: [],
        bodyHtml: "<p></p>",
        category: "Accounting & Tax",
        publishedAt: new Date().toISOString().slice(0, 10),
        coverImage: "/assets/img/insights/vat-refund-cover.png",
        galleryImages: [],
        client: "",
        service: "",
      }}
    />
  );
}
