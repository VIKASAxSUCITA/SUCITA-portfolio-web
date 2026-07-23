import Link from "next/link";
import ScrollReveal from "@/components/template/ScrollReveal";
import MoveRightIcon from "@/components/icons/MoveRightIcon";

const callPoints = [
  "Clarify your audit, tax, or compliance priorities",
  "Get practical next steps for your situation",
  "Speak with a team that works with growing businesses",
];

export default function HomeStrategyCTA() {
  return (
    <section className="sucita-layer sucita-strategy-cta">
      <div className="sucita-strategy-cta-media" aria-hidden="true" />
      <div className="sucita-strategy-cta-overlay" aria-hidden="true" />

      <div className="container position-relative">
        <div className="row align-items-center justify-content-between sucita-strategy-cta-row">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <ScrollReveal className="sucita-reveal-left">
              <p className="sucita-strategy-cta-label mb-3">Next step</p>
              <h2 className="text-white mb-3">Book a Strategy Call</h2>
              <p className="sucita-strategy-cta-copy mb-0">
                Tell us where compliance, reporting, or growth decisions are stuck.
                We’ll respond with clear next steps — no generic pitch.
              </p>
            </ScrollReveal>
          </div>

          <div className="col-lg-5">
            <ScrollReveal className="sucita-reveal-right" delay={120}>
              <div className="sucita-strategy-cta-panel">
                <ul className="sucita-strategy-cta-list list-unstyled mb-4">
                  {callPoints.map((point) => (
                    <li key={point}>
                      <span className="sucita-strategy-cta-check" aria-hidden="true">
                        <i className="fas fa-check" />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact?intent=strategy-call"
                  className="btn btn-tertiary btn-lg sucita-strategy-cta-btn d-inline-flex align-items-center gap-2"
                >
                  Book Strategy Call
                  <MoveRightIcon className="sucita-link-arrow" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
