"use client";

import Script from "next/script";

export default function TemplateScripts() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
      <Script src="/assets/js/sucita-app.js" strategy="afterInteractive" />
    </>
  );
}
