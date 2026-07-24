import { firmStory, vision, mission, coreValues } from "@/data/about";
import { serviceCategories } from "@/data/services";
import { siteConfig } from "@/data/site";
import type { HomePageContent } from "./homeTypes";

export const defaultHomeContent: HomePageContent = {
  hero: {
    title: "Clarity when compliance and growth decisions matter",
    text: "Audit, accounting, tax, and strategy — delivered with integrity.",
    aboutLabel: "About Us",
    servicesLabel: "Explore Services",
    backgroundImage: "/assets/img/homepage_banner.png",
  },
  whatWeDo: {
    title: "What We Do",
    text: "Statutory audits, monthly bookkeeping, tax filing, VAT refund support, internal audit, SOP development, start-up packages, and corporate secretary services — delivered with integrity and independence.",
    image: "/assets/img/whatwedo.png",
    imageAlt: "Reviewing financial reports and charts",
  },
  whoWeServe: {
    title: "Who We Serve",
    text: "SMEs and growing businesses that need reliable accounting and tax compliance. Startups requiring setup, licensing, and structured financial systems. Companies facing tax audits, VAT matters, or statutory audit requirements — and organizations seeking outsourced financial control and corporate secretary support.",
    image: "/assets/img/whatweserve.png",
    imageAlt: "Collaborating on financial analysis",
  },
  strategy: {
    label: "Next step",
    title: "Book a Strategy Call",
    text: "Tell us where compliance, reporting, or growth decisions are stuck. We’ll respond with clear next steps — no generic pitch.",
    buttonLabel: "Book Strategy Call",
    points: [
      "Clarify your audit, tax, or compliance priorities",
      "Get practical next steps for your situation",
      "Speak with a team that works with growing businesses",
    ],
  },
  about: {
    label: "About Us",
    title: firmStory.title,
    paragraphs: [...firmStory.paragraphs],
    image: "/assets/img/whatweserve.png",
    visionTitle: vision.title,
    visionText: vision.text,
    missionTitle: mission.title,
    missionText: mission.text,
    valuesLabel: "What guides us",
    valuesTitle: "Core Values",
    valuesIntro:
      "Five principles that shape every engagement and every client relationship.",
    values: coreValues.map((v) => ({ ...v })),
  },
  services: {
    label: "What we offer",
    title: "Services",
    intro:
      "Audit, accounting, tax, and strategy — organized into three clear practice areas.",
    categories: serviceCategories.map((c) => ({
      ...c,
      items: c.items.map((item) =>
        item.children ? { ...item, children: [...item.children] } : { ...item }
      ),
    })),
  },
  contact: {
    label: "Get in touch",
    title: "Contact",
    infoTitle: "Contact info",
    infoCopy: "Reach Sucita & Partners directly, or send a message using the form.",
  },
  site: { ...siteConfig },
};

export function mergeHomeContent(
  saved: Partial<HomePageContent> | null | undefined
): HomePageContent {
  const d = defaultHomeContent;
  if (!saved) return structuredClone(d);
  return {
    hero: { ...d.hero, ...saved.hero },
    whatWeDo: { ...d.whatWeDo, ...saved.whatWeDo },
    whoWeServe: { ...d.whoWeServe, ...saved.whoWeServe },
    strategy: {
      ...d.strategy,
      ...saved.strategy,
      points: saved.strategy?.points?.length
        ? saved.strategy.points
        : [...d.strategy.points],
    },
    about: {
      ...d.about,
      ...saved.about,
      paragraphs: saved.about?.paragraphs?.length
        ? saved.about.paragraphs
        : [...d.about.paragraphs],
      values: saved.about?.values?.length
        ? saved.about.values
        : d.about.values.map((v) => ({ ...v })),
    },
    services: {
      ...d.services,
      ...saved.services,
      categories: saved.services?.categories?.length
        ? saved.services.categories
        : structuredClone(d.services.categories),
    },
    contact: { ...d.contact, ...saved.contact },
    site: { ...d.site, ...saved.site },
  };
}
