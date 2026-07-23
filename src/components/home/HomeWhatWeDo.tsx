import Image from "next/image";
import ScrollReveal from "@/components/template/ScrollReveal";

export default function HomeWhatWeDo() {
  return (
    <section className="sucita-layer sucita-layer-do ptb-100">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-md-6 col-lg-5">
            <ScrollReveal className="sucita-reveal-left">
              <div className="feature-contents">
                <h2>What we do</h2>
                <p>
                  Statutory audits, monthly bookkeeping, tax filing, VAT refund support,
                  internal audit, SOP development, start-up packages, and corporate
                  secretary services — delivered with integrity and independence.
                </p>
              </div>
            </ScrollReveal>
          </div>
          <div className="col-md-6 col-lg-6">
            <ScrollReveal className="sucita-reveal-right" delay={120}>
              <div className="sucita-photo-frame sucita-photo-frame--do">
                <span className="sucita-photo-accent" aria-hidden="true" />
                <span className="sucita-photo-ring" aria-hidden="true" />
                <span className="sucita-photo-dot sucita-photo-dot--1" aria-hidden="true" />
                <span className="sucita-photo-dot sucita-photo-dot--2" aria-hidden="true" />
                <div className="sucita-photo-clip">
                  <Image
                    src="/assets/img/whatwedo.png"
                    alt="Reviewing financial reports and charts"
                    width={800}
                    height={640}
                    className="sucita-photo-img"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
