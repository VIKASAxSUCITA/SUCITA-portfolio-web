import type { Metadata } from "next";
import KohostPageHeader from "@/components/template/KohostPageHeader";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <KohostPageHeader title="Privacy Policy" />
      <section className="ptb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <p className="text-muted small">Last updated: July 2026</p>
              <h3>1. Information We Collect</h3>
              <p>We may collect personal information you voluntarily provide when contacting us.</p>
              <h3>2. How We Use Your Information</h3>
              <p>We use information to respond to inquiries and provide our services. We do not sell your data.</p>
              <h3>3. Contact</h3>
              <p>Questions? Email <a href="mailto:sucitacontact@gmail.com">sucitacontact@gmail.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
