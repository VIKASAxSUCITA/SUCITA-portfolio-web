import HashScroll from "@/components/template/HashScroll";
import HomeHero from "@/components/home/HomeHero";
import HomeWhatWeDo from "@/components/home/HomeWhatWeDo";
import HomeWhoWeServe from "@/components/home/HomeWhoWeServe";
import HomeAbout from "@/components/home/HomeAbout";
import HomeServices from "@/components/home/HomeServices";
import HomeInsights from "@/components/home/HomeInsights";
import HomeEvents from "@/components/home/HomeEvents";
import HomeContact from "@/components/home/HomeContact";
import HomeStrategyCTA from "@/components/home/HomeStrategyCTA";
import BrandMarquee from "@/components/home/BrandMarquee";
import { getPublicInsights } from "@/lib/content/insightsStore";
import { getPublicEvents } from "@/lib/content/eventsStore";
import { getHomeContent } from "@/lib/content/homeStore";
import { getServiceCategories } from "@/lib/content/servicesStore";
import { getSiteConfig } from "@/lib/content/siteStore";
import {
  getPublicClients,
  getPublicPartners,
} from "@/lib/content/logosStore";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const home = getHomeContent();
  const site = getSiteConfig();
  const [categories, insights, events, partners, clients] = await Promise.all([
    getServiceCategories(),
    getPublicInsights(),
    getPublicEvents(),
    getPublicPartners(),
    getPublicClients(),
  ]);

  return (
    <>
      <HashScroll />
      <HomeHero content={home.hero} />
      <HomeWhatWeDo content={home.whatWeDo} />
      <HomeWhoWeServe content={home.whoWeServe} />
      <HomeStrategyCTA content={home.strategy} />
      <HomeAbout content={home.about} />
      <HomeServices content={{ ...home.services, categories }} />
      <BrandMarquee
        id="partners"
        liveGroup="partners"
        items={partners}
        direction="left"
        titleKey="home.partnersTitle"
      />
      <BrandMarquee
        id="clients"
        liveGroup="clients"
        items={clients}
        direction="right"
        titleKey="home.clientsTitle"
      />
      <HomeInsights items={insights} />
      <HomeEvents items={events} />
      <HomeContact content={home.contact} site={site} />
    </>
  );
}
