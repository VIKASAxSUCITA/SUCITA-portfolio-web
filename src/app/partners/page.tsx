import type { Metadata } from "next";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import BrandMarquee from "@/components/home/BrandMarquee";
import { partners, clients } from "@/data/partners";

export const metadata: Metadata = {
  title: "Partners & Clients",
};

export default function PartnersPage() {
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
