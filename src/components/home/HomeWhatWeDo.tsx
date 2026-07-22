import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/template/ScrollReveal";
import MoveRightIcon from "@/components/icons/MoveRightIcon";

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
                <Link href="/services" className="read-more-link mt-3 d-inline-flex align-items-center gap-2">
                  Know more about us
                  <MoveRightIcon className="sucita-link-arrow" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
          <div className="col-md-6 col-lg-6">
            <ScrollReveal className="sucita-reveal-right" delay={120}>
              <div className="img-wrap">
                <Image
                  src="/assets/img/hero-home.svg"
                  alt="What Sucita & Partners does"
                  width={600}
                  height={480}
                  className="img-fluid"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
