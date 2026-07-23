import Image from "next/image";
import ScrollReveal from "@/components/template/ScrollReveal";

export default function HomeWhoWeServe() {
  return (
    <section className="sucita-layer sucita-layer-serve ptb-100">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-md-6 col-lg-6 order-2 order-md-1">
            <ScrollReveal className="sucita-reveal-left">
              <div className="sucita-photo-frame sucita-photo-frame--serve">
                <span className="sucita-photo-accent" aria-hidden="true" />
                <span className="sucita-photo-ring" aria-hidden="true" />
                <span className="sucita-photo-dot sucita-photo-dot--1" aria-hidden="true" />
                <span className="sucita-photo-dot sucita-photo-dot--2" aria-hidden="true" />
                <div className="sucita-photo-clip">
                  <Image
                    src="/assets/img/whatweserve.png"
                    alt="Collaborating on financial analysis"
                    width={800}
                    height={640}
                    className="sucita-photo-img"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="col-md-6 col-lg-5 order-1 order-md-2">
            <ScrollReveal className="sucita-reveal-right" delay={120}>
              <div className="feature-contents">
                <h2>Who we serve</h2>
                <p>
                  SMEs and growing businesses that need reliable accounting and tax
                  compliance. Startups requiring setup, licensing, and structured
                  financial systems. Companies facing tax audits, VAT matters, or
                  statutory audit requirements — and organizations seeking outsourced
                  financial control and corporate secretary support.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
