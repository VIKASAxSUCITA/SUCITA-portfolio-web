export const firmStory = {
  title: "Why Sucita Exists",
  paragraphs: [
    "Sucita & Partners was founded on a simple observation: too many organizations struggle not because they lack ambition, but because financial complexity, regulatory pressure, and compliance gaps hold them back.",
    "We exist to be the firm business owners and leaders turn to when they need clarity — not jargon. When tax deadlines, audit requirements, and licensing obligations pile up, our team steps in to simplify the path forward and protect what you've built.",
    "From startups setting up their first books to established companies navigating VAT refunds, tax audits, or statutory audits, we serve organizations that value integrity, independence, and a partner who treats their success as our own.",
  ],
};

export const vision = {
  title: "Vision",
  text: "To set the benchmark in professional services through unwavering integrity, empowering organizations with trusted accounting, tax, audit, and compliance solutions that drive lasting impact.",
};

export const mission = {
  title: "Mission",
  text: "At Sucita & Partners, we are dedicated to simplify complexity and protect client interests through accountable and high-quality professional services, always guided by integrity, independence, and client success.",
};

export const coreValues = [
  {
    title: "Integrity",
    description:
      "We act with unwavering honesty, professional ethics, and transparency in every decision—building long-term trust with clients, partners, regulators and stakeholders.",
  },
  {
    title: "Insightful Commitment",
    description:
      "We prioritize our clients’ interests, delivering accurate, timely, and tailored solutions that safeguard their business, reputation, and future.",
  },
  {
    title: "Impact Through Excellence",
    description:
      "We uphold the highest professional standards and deliver work with precision and accountability, ensuring every outcome adds value and builds lasting confidence.",
  },
  {
    title: "Inclusive Partnership",
    description:
      "We grow alongside our clients and partners, fostering mutual success through collaboration, trust, and shared purpose.",
  },
  {
    title: "Intentional Protection",
    description:
      "We serve as stewards of client trust by ensuring financial integrity and regulatory compliance, safeguarding client reputations and sustainable growth.",
  },
];

export type Person = {
  name: string;
  position: string;
  message: string;
  /** Public path under /public, e.g. /images/team/director.jpg */
  image?: string;
};

/** Leadership / team — Director first for the Director Message section */
export const people: Person[] = [
  {
    name: "TANG EKPHEARUM",
    position: "Managing Director",
    message:
      "At Sucita & Partners, we believe clarity builds confidence. Our role is to simplify financial complexity and protect what our clients have built — with integrity in every engagement.",
    // Add a photo at public/images/team/director.jpg then set: image: "/images/team/director.jpg"
  },
];
