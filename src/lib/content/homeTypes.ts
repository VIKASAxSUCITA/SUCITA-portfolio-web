import type { ServiceCategory } from "@/data/services";
import type { SiteContent } from "./types";

export type HomeHeroContent = {
  title: string;
  text: string;
  aboutLabel: string;
  servicesLabel: string;
  backgroundImage: string;
};

export type HomeSplitContent = {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
};

export type HomeStrategyContent = {
  label: string;
  title: string;
  text: string;
  buttonLabel: string;
  points: string[];
};

export type HomeAboutContent = {
  label: string;
  title: string;
  paragraphs: string[];
  image: string;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;
  valuesLabel: string;
  valuesTitle: string;
  valuesIntro: string;
  values: Array<{ title: string; description: string }>;
};

export type HomeServicesContent = {
  label: string;
  title: string;
  intro: string;
  categories: ServiceCategory[];
};

export type HomeContactBlock = {
  label: string;
  title: string;
  infoTitle: string;
  infoCopy: string;
};

export type HomePageContent = {
  hero: HomeHeroContent;
  whatWeDo: HomeSplitContent;
  whoWeServe: HomeSplitContent;
  strategy: HomeStrategyContent;
  about: HomeAboutContent;
  services: HomeServicesContent;
  contact: HomeContactBlock;
  site: SiteContent;
};
