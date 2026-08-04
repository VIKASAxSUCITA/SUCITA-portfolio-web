import type { Metadata } from "next";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import BrandMarquee from "@/components/home/BrandMarquee";
import {
  getPublicClients,
  getPublicPartners,
} from "@/lib/content/logosStore";

export const metadata: Metadata = {
  title: "Partners & Clients",
};

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const [partners, clients] = await Promise.all([
    getPublicPartners(),
    getPublicClients(),
  ]);

  return (
    <>
      <KohostPageHeader
        title="Partners & Clients"
        subtitle="Organizations we collaborate with and businesses we support."
      />
      <BrandMarquee
        id="partners"
        items={partners}
        direction="left"
        titleKey="home.partnersTitle"
      />
      <BrandMarquee
        id="clients"
        items={clients}
        direction="right"
        titleKey="home.clientsTitle"
      />
    </>
  );
}
