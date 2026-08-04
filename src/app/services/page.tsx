import type { Metadata } from "next";
import HomeServices from "@/components/home/HomeServices";
import { defaultHomeContent } from "@/lib/content/homeDefaults";
import { getServiceCategories } from "@/lib/content/servicesStore";

export const metadata: Metadata = {
  title: "Services",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const categories = await getServiceCategories();

  return (
    <HomeServices
      content={{
        ...defaultHomeContent.services,
        categories,
      }}
    />
  );
}
