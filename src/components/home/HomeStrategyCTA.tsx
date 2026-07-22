import Link from "next/link";
import ScrollReveal from "@/components/template/ScrollReveal";

export default function HomeStrategyCTA() {
  return (
    <section className="sucita-layer sucita-layer-cta primary-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <ScrollReveal className="sucita-reveal-up">
              <h2 className="text-white mb-3">Book a Strategy Call</h2>
              <p className="lead text-white mb-4 opacity-90">
                Tell us where your compliance, reporting, or growth decisions are stuck.
                We’ll respond with clear next steps for your situation.
              </p>
              <Link
                href="/contact?intent=strategy-call"
                className="btn btn-tertiary btn-lg"
              >
                Book Strategy Call
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
