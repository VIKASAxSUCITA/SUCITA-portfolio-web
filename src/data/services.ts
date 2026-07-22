export type ServiceCategory = {
  id: string;
  letter: string;
  title: string;
  description: string;
  items: string[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "audit-assurance",
    letter: "A",
    title: "Audit & Assurance",
    description:
      "Independent audit and assurance services that strengthen stakeholder confidence and meet regulatory requirements.",
    items: [
      "Audit",
      "Assurance",
      "Agreed-Upon Procedure",
      "Financial Statement Review",
      "Internal Audit",
    ],
  },
  {
    id: "accounting-tax",
    letter: "B",
    title: "Accounting & Tax",
    description:
      "End-to-end accounting and tax support — from monthly bookkeeping to complex VAT and tax compliance matters.",
    items: [
      "Monthly Bookkeeping",
      "Monthly/Annual Tax Filling",
      "Tax Audit Assistance",
      "VAT Refund Assistance",
      "VAT 0% Certificate",
      "Tax Compliance Certificate",
      "Annual Income Tax",
      "Other Tax Advisory Services",
    ],
  },
  {
    id: "transformative-strategy",
    letter: "C",
    title: "Transformative Strategy",
    description:
      "Strategic advisory and operational support to help your business scale with strong systems, compliance, and structure.",
    items: [
      "Financial Controlling & Outsourcing Service",
      "SOP Development",
      "Start-up Package",
      "Corporate Secretary Service",
      "System Support (Accounting & HR System)",
      "Legal Compliance & Licensing",
    ],
  },
];

export const whoWeServe = [
  "SMEs and growing businesses needing reliable accounting and tax compliance",
  "Startups requiring setup, licensing, and structured financial systems",
  "Companies facing tax audits, VAT matters, or statutory audit requirements",
  "Organizations seeking outsourced financial control and corporate secretary support",
];
