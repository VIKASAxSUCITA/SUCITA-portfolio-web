export type InsightType = "article" | "project";

export type InsightCategory =
  | "Audit & Assurance"
  | "Accounting & Tax"
  | "Transformative Strategy";

export const insightCategories: InsightCategory[] = [
  "Audit & Assurance",
  "Accounting & Tax",
  "Transformative Strategy",
];

export type Insight = {
  slug: string;
  type: InsightType;
  title: string;
  excerpt: string;
  content: string[];
  /** Rich text body from TipTap (preferred over content[] when present). */
  bodyHtml?: string;
  category: InsightCategory;
  publishedAt: string;
  /** Main / cover image shown on cards and detail hero */
  coverImage: string;
  /** Extra evidence images on the detail page (especially for projects) */
  galleryImages?: string[];
  client?: string;
  service?: string;
};

export const insights: Insight[] = [
  {
    slug: "understanding-vat-refund-in-cambodia",
    type: "article",
    title: "Understanding VAT Refund in Cambodia: What Businesses Need to Know",
    excerpt:
      "A practical guide to VAT refund eligibility, documentation requirements, and common pitfalls for export-oriented businesses.",
    category: "Accounting & Tax",
    publishedAt: "2026-06-15",
    coverImage: "/assets/img/insights/vat-refund-cover.png",
    galleryImages: [
      "/assets/img/insights/vat-refund-1.png",
      "/assets/img/insights/vat-refund-2.png",
    ],
    content: [
      "VAT refund processes can be complex for businesses engaged in export activities or zero-rated supplies. Understanding the documentation trail and timing of submissions is critical to avoiding delays.",
      "At Sucita & Partners, we help clients prepare compliant refund applications, reconcile input VAT against eligible output transactions, and respond to GDT inquiries during the review process.",
      "Key steps include maintaining proper tax invoices, ensuring export documentation is complete, and aligning bookkeeping records with declared refund claims.",
    ],
  },
  {
    slug: "startup-financial-setup-checklist",
    type: "article",
    title: "Startup Financial Setup Checklist: From Registration to First Filing",
    excerpt:
      "Essential steps new businesses should take to establish compliant accounting, tax registration, and reporting from day one.",
    category: "Transformative Strategy",
    publishedAt: "2026-05-28",
    coverImage: "/assets/img/insights/startup-cover.png",
    galleryImages: [
      "/assets/img/insights/startup-1.png",
      "/assets/img/insights/startup-2.png",
    ],
    content: [
      "Starting a business in Cambodia involves more than registration — it requires a clear financial foundation. From choosing the right entity structure to setting up bookkeeping and tax registration, early decisions affect compliance for years.",
      "Our Start-up Package covers corporate secretary services, licensing support, chart of accounts setup, and guidance on monthly and annual tax obligations.",
      "Getting systems right at the start reduces rework, penalties, and audit risk as the business grows.",
    ],
  },
  {
    slug: "manufacturing-company-statutory-audit",
    type: "project",
    title: "Statutory Audit for a Manufacturing Company",
    excerpt:
      "Delivered a full statutory audit with improved internal controls and streamlined financial reporting for a mid-size manufacturer.",
    category: "Audit & Assurance",
    publishedAt: "2026-04-10",
    client: "Manufacturing Sector Client",
    service: "Statutory Audit",
    coverImage: "/assets/img/insights/audit-cover.png",
    galleryImages: [
      "/assets/img/insights/audit-1.png",
      "/assets/img/insights/audit-2.png",
      "/assets/img/insights/audit-3.png",
    ],
    content: [
      "A mid-size manufacturing client approached Sucita & Partners ahead of their annual statutory audit deadline. Their internal records required reconciliation across inventory, cost of goods sold, and intercompany transactions.",
      "Our audit team performed a structured fieldwork plan, identified control gaps in inventory counting procedures, and worked with management to implement corrective actions before audit sign-off.",
      "The engagement concluded with a clean audit opinion and a set of recommendations that strengthened the client's monthly closing process and tax reporting accuracy.",
    ],
  },
  {
    slug: "vat-refund-export-client",
    type: "project",
    title: "VAT Refund Assistance for Export-Oriented Business",
    excerpt:
      "Supported an export client through VAT refund application, documentation review, and GDT follow-up — securing timely refund approval.",
    category: "Accounting & Tax",
    publishedAt: "2026-03-22",
    client: "Export & Trading Client",
    service: "VAT Refund Assistance",
    coverImage: "/assets/img/insights/export-cover.png",
    galleryImages: [
      "/assets/img/insights/export-1.png",
      "/assets/img/insights/export-2.png",
      "/assets/img/insights/export-3.png",
    ],
    content: [
      "An export-oriented client had accumulated significant input VAT but faced repeated refund rejections due to incomplete supporting documents and mismatched declarations.",
      "Sucita & Partners conducted a full reconciliation of eligible transactions, corrected prior-period filing discrepancies, and prepared a compliant refund submission package.",
      "The client received refund approval within the expected processing window and established ongoing monthly compliance procedures to prevent future delays.",
    ],
  },
  {
    slug: "sop-development-retail-chain",
    type: "project",
    title: "SOP Development & Financial Controls for Retail Expansion",
    excerpt:
      "Designed standard operating procedures and financial controlling framework for a retail business opening multiple new locations.",
    category: "Transformative Strategy",
    publishedAt: "2026-02-08",
    client: "Retail Sector Client",
    service: "SOP Development & Financial Controlling",
    coverImage: "/assets/img/insights/retail-cover.png",
    galleryImages: [
      "/assets/img/insights/retail-1.png",
      "/assets/img/insights/retail-2.png",
      "/assets/img/insights/retail-3.png",
    ],
    content: [
      "A growing retail client needed standardized procedures across new branches — covering cash handling, inventory, payroll, and monthly reporting.",
      "We developed branch-level SOPs, implemented a financial controlling checklist, and set up outsourced bookkeeping with centralized management reporting.",
      "The result was consistent operations across locations, faster monthly closes, and leadership visibility into performance by branch.",
    ],
  },
];

export function getInsightBySlug(slug: string) {
  return insights.find((item) => item.slug === slug);
}

export function getInsightsByType(type: InsightType) {
  return insights.filter((item) => item.type === type);
}

export function getInsightsByCategory(category: InsightCategory) {
  return insights.filter((item) => item.category === category);
}
