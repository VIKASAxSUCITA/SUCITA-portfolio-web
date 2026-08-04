import type { Metadata } from "next";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import HomeContact from "@/components/home/HomeContact";
import { getHomeContent } from "@/lib/content/homeStore";
import { getSiteConfig } from "@/lib/content/siteStore";

export const metadata: Metadata = {
  title: "Contact",
};

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const home = getHomeContent();
  const site = getSiteConfig();

  return (
    <>
      <KohostPageHeader
        title="Contact"
        subtitle="Reach us directly, or send a message using the form."
      />
      <HomeContact content={home.contact} site={site} showFullLink={false} />
    </>
  );
}
