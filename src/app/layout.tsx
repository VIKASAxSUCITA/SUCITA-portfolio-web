import type { Metadata } from "next";
import Preloader from "@/components/template/Preloader";
import KohostHeader from "@/components/template/KohostHeader";
import KohostFooter from "@/components/template/KohostFooter";
import ScrollTop from "@/components/template/ScrollTop";
import TemplateScripts from "@/components/template/TemplateScripts";

export const metadata: Metadata = {
  title: {
    default: "Sucita & Partners | Accounting, Tax & Audit",
    template: "%s | Sucita & Partners",
  },
  description:
    "Professional accounting, tax, and audit services. Trusted financial expertise for businesses and individuals.",
  icons: {
    icon: "/images/sucita_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/sucita-brand.css" />
      </head>
      <body>
        <Preloader />
        <div className="main">
          <KohostHeader />
          {children}
        </div>
        <KohostFooter />
        <ScrollTop />
        <TemplateScripts />
      </body>
    </html>
  );
}
