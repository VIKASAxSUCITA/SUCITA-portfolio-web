export type EventType = "event" | "announcement";

export type EventItem = {
  slug: string;
  type: EventType;
  title: string;
  excerpt: string;
  description: string[];
  date: string;
  time?: string;
  location?: string;
  isUpcoming: boolean;
  coverImage: string;
};

export const events: EventItem[] = [
  {
    slug: "tax-compliance-workshop-2026",
    type: "event",
    title: "Tax Compliance Workshop for SMEs",
    excerpt:
      "Join our team for a practical session on monthly tax filing, annual income tax, and common compliance mistakes to avoid.",
    description: [
      "This workshop is designed for business owners, finance managers, and accountants responsible for tax compliance in Cambodia.",
      "Topics include monthly tax obligations, annual income tax preparation, documentation best practices, and how to prepare for a tax audit.",
      "Registration is free for existing clients. Limited seats available.",
    ],
    date: "2026-08-15",
    time: "2:00 PM – 5:00 PM",
    location: "Sucita & Partners Office, Phnom Penh",
    isUpcoming: true,
    coverImage: "/assets/img/events/tax-workshop.png",
  },
  {
    slug: "new-vat-advisory-service",
    type: "announcement",
    title: "Expanded VAT Advisory & Refund Support",
    excerpt:
      "We have expanded our VAT advisory team to support export clients with refund applications and VAT 0% certificate processing.",
    description: [
      "Sucita & Partners is pleased to announce expanded capacity in VAT advisory services, including dedicated support for VAT refund assistance and VAT 0% certificate applications.",
      "Export-oriented businesses and traders facing complex VAT matters can now access specialized review and submission support through our Accounting & Tax practice.",
      "Contact us to discuss your VAT requirements or request a proposal.",
    ],
    date: "2026-07-01",
    isUpcoming: true,
    coverImage: "/assets/img/events/vat-advisory.png",
  },
  {
    slug: "audit-season-reminder-2026",
    type: "announcement",
    title: "Annual Audit Season — Schedule Your Engagement Early",
    excerpt:
      "Plan ahead for statutory audit deadlines. Early scheduling ensures adequate fieldwork time and smoother year-end reporting.",
    description: [
      "As audit season approaches, we encourage clients with statutory audit requirements to confirm engagement timelines in advance.",
      "Early planning allows proper document preparation, inventory counts, and management representation letter completion without last-minute pressure.",
      "Reach out to your account manager or contact us to book your audit schedule.",
    ],
    date: "2026-06-20",
    isUpcoming: true,
    coverImage: "/assets/img/events/audit-season.png",
  },
  {
    slug: "startup-package-launch",
    type: "event",
    title: "Start-up Package Information Session",
    excerpt:
      "Learn how our Start-up Package covers licensing, corporate secretary services, bookkeeping setup, and first-year compliance.",
    description: [
      "Starting a business? This session walks through everything included in our Start-up Package — from entity setup and licensing to accounting system support.",
      "Ideal for founders, co-founders, and advisors supporting new business registrations in Cambodia.",
    ],
    date: "2026-05-10",
    time: "10:00 AM – 12:00 PM",
    location: "Online (Zoom)",
    isUpcoming: false,
    coverImage: "/assets/img/events/startup-session.png",
  },
];

export function getEventBySlug(slug: string) {
  return events.find((item) => item.slug === slug);
}

export function getUpcomingEvents() {
  return events.filter((item) => item.isUpcoming);
}

export function getPastEvents() {
  return events.filter((item) => !item.isUpcoming);
}
