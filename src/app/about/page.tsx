import type { Metadata } from "next";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import HomeAbout from "@/components/home/HomeAbout";
import { getHomeContent } from "@/lib/content/homeStore";

export const metadata: Metadata = {
  title: "About Us",
};

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const home = getHomeContent();

  return (
    <>
      <KohostPageHeader
        title="About Us"
        subtitle="Built on integrity, independence, and a commitment to client success."
      />
      <HomeAbout content={home.about} />
    </>
  );
}
