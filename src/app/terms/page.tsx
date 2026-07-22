import type { Metadata } from "next";
import KohostPageHeader from "@/components/template/KohostPageHeader";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <>
      <KohostPageHeader title="Terms & Conditions" />
      <section className="ptb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <p className="text-muted small">Last updated: July 2026</p>
              <h3>1. Acceptance of Terms</h3>
              <p>By using this website, you agree to these Terms and Conditions.</p>
              <h3>2. Use of Website</h3>
              <p>This website is provided for informational purposes about Sucita & Partners and our services.</p>
              <h3>3. Contact</h3>
              <p>Questions? Email <a href="mailto:info@sucita-partners.com">info@sucita-partners.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
