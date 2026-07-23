import Link from "next/link";
import ScrollReveal from "@/components/template/ScrollReveal";
import HomeWhatWeDo from "@/components/home/HomeWhatWeDo";
import HomeWhoWeServe from "@/components/home/HomeWhoWeServe";
import HomeStrategyCTA from "@/components/home/HomeStrategyCTA";

export default function HomePage() {
  return (
    <>
      {/* 1. Clear value proposition */}
      <section className="sucita-hero overflow-hidden">
        <div className="sucita-hero-media" aria-hidden="true" />
        <div className="sucita-hero-overlay" aria-hidden="true" />
        <div className="container position-relative">
          <div className="row align-items-center sucita-hero-row">
            <div className="col-lg-8 col-xl-7">
              <ScrollReveal className="sucita-reveal-left">
                <div className="hero-slider-content text-white">
                  <h1 className="text-white">
                    Clarity when compliance and growth decisions matter
                  </h1>
                  <p className="lead">
                    Audit, accounting, tax, and strategy — delivered with integrity.
                  </p>
                  <div className="action-btns mt-4">
                    <Link href="/about" className="btn btn-tertiary btn-lg me-2">
                      About Us
                    </Link>
                    <Link href="/services" className="btn btn-outline-light btn-lg">
                      Explore Services
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2a. What we do — own layer */}
      <HomeWhatWeDo />

      {/* 2b. Who we serve — own layer */}
      <HomeWhoWeServe />

      {/* 3. Call-to-action — Book Strategy Call → contact */}
      <HomeStrategyCTA />
    </>
  );
}
