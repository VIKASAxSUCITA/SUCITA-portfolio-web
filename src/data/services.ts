export type ServiceItem = {
  label: string;
  children?: string[];
};

export type ServiceCategory = {
  id: string;
  letter: string;
  title: string;
  description: string;
  items: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "audit-assurance",
    letter: "A",
    title: "Audit & Assurance",
    description:
      "Independent audit and assurance services that strengthen stakeholder confidence and meet regulatory requirements.",
    items: [
      { label: "Audit" },
      {
        label: "Assurance",
        children: [
          "Agreed-Upon Procedure",
          "Financial Statement Review",
          "Internal Audit",
        ],
      },
    ],
  },
  {
    id: "accounting-tax",
    letter: "B",
    title: "Accounting & Tax",
    description:
      "End-to-end accounting and tax support — from monthly bookkeeping to complex VAT and tax compliance matters.",
    items: [
      { label: "Monthly Bookkeeping" },
      { label: "Monthly/Annual Tax Filling" },
      { label: "Tax Audit Assistance" },
      { label: "VAT Refund Assistance" },
      { label: "VAT 0% Certificate" },
      { label: "Tax Compliance Certificate" },
      { label: "Annual Income Tax" },
      { label: "Other Tax Advisory Services" },
    ],
  },
  {
    id: "transformative-strategy",
    letter: "C",
    title: "Transformative Strategy",
    description:
      "Strategic advisory and operational support to help your business scale with strong systems, compliance, and structure.",
    items: [
      { label: "Financial Controlling & Outsourcing Service" },
      { label: "SOP Development" },
      { label: "Start-up Package" },
      { label: "Corporate Secretary Service" },
      { label: "System Support (Accounting & HR System)" },
      { label: "Legal Compliance & Licensing" },
    ],
  },
];

/** Flat list of selectable service labels (parents + children). */
export function getServiceLabels(category: ServiceCategory): string[] {
  return category.items.flatMap((item) =>
    item.children?.length ? [item.label, ...item.children] : [item.label]
  );
}

export function countServiceItems(category: ServiceCategory): number {
  return category.items.reduce(
    (total, item) => total + 1 + (item.children?.length ?? 0),
    0
  );
}

export const whoWeServe = [
  "SMEs and growing businesses needing reliable accounting and tax compliance",
  "Startups requiring setup, licensing, and structured financial systems",
  "Companies facing tax audits, VAT matters, or statutory audit requirements",
  "Organizations seeking outsourced financial control and corporate secretary support",
];
