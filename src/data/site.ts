export const siteConfig = {
  name: "Sucita & Partners",
  tagline: "Accounting | Tax | Audit",
  email: "sucitacontact@gmail.com",
  phone: "096 645 4828",
  whatsapp: "https://wa.me/855966454828",
  telegram: "https://t.me/sucitacontact",
  officeHours: "Mon – Fri: 8:00 AM – 5:00 PM",
  address: "Phnom Penh, Cambodia",
  footerCopy:
    "We simplify financial complexity and protect client interests through accountable accounting, tax, audit, and compliance services.",
};

/** Own pages for every main nav item */
export const navLinks = [
  { href: "/", labelKey: "nav.home" as const, label: "Home" },
  { href: "/about", labelKey: "nav.about" as const, label: "About Us" },
  { href: "/services", labelKey: "nav.services" as const, label: "Services" },
  { href: "/insights", labelKey: "nav.insights" as const, label: "Insights" },
  { href: "/events", labelKey: "nav.events" as const, label: "Events" },
  { href: "/contact", labelKey: "nav.contact" as const, label: "Contact" },
];

export const footerServiceLinks = [
  { href: "/services/audit-assurance", label: "Audit & Assurance" },
  { href: "/services/accounting-tax", label: "Accounting & Tax" },
  { href: "/services/transformative-strategy", label: "Transformative Strategy" },
];
