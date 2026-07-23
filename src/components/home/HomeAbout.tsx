import Image from "next/image";
import type { ComponentType } from "react";
import ScrollReveal from "@/components/template/ScrollReveal";
import {
  IntegrityIcon,
  IndependenceIcon,
  ClientSuccessIcon,
  AccountabilityIcon,
  ExcellenceIcon,
} from "@/components/icons/CoreValueIcons";
import { firmStory, vision, mission, coreValues } from "@/data/about";

const valueIcons: Record<string, ComponentType<{ className?: string }>> = {
  Integrity: IntegrityIcon,
  Independence: IndependenceIcon,
  "Client Success": ClientSuccessIcon,
  Accountability: AccountabilityIcon,
  Excellence: ExcellenceIcon,
};

export default function HomeAbout() {
  return (
    <>
      {/* About — Firm story + Vision / Mission */}
      <section className="sucita-about-intro ptb-100">
        <div className="container">
          <div className="row align-items-center justify-content-between mb-5 mb-lg-6">
            <div className="col-lg-5 mb-5 mb-lg-0">
              <ScrollReveal className="sucita-reveal-left">
                <p className="sucita-about-label mb-3">About Us</p>
                <h2 className="sucita-about-title mb-4">{firmStory.title}</h2>
                <p className="sucita-about-body mb-3">{firmStory.paragraphs[0]}</p>
                <p className="sucita-about-body mb-0">{firmStory.paragraphs[1]}</p>
              </ScrollReveal>
            </div>

            <div className="col-lg-6">
              <ScrollReveal className="sucita-reveal-right" delay={120}>
                <div className="sucita-about-visual">
                  <div className="sucita-about-visual-frame">
                    <Image
                      src="/assets/img/whatweserve.png"
                      alt="Sucita & Partners team at work"
                      width={800}
                      height={640}
                      className="sucita-about-visual-img"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="sucita-vm-grid">
            <ScrollReveal className="sucita-reveal-up">
              <article className="sucita-vm-card">
                <div className="sucita-vm-card-top">
                  <span className="sucita-vm-mark" aria-hidden="true">
                    V
                  </span>
                  <h3 className="sucita-vm-heading mb-0">{vision.title}</h3>
                </div>
                <p className="sucita-vm-text mb-0">{vision.text}</p>
              </article>
            </ScrollReveal>

            <ScrollReveal className="sucita-reveal-up" delay={100}>
              <article className="sucita-vm-card">
                <div className="sucita-vm-card-top">
                  <span className="sucita-vm-mark" aria-hidden="true">
                    M
                  </span>
                  <h3 className="sucita-vm-heading mb-0">{mission.title}</h3>
                </div>
                <p className="sucita-vm-text mb-0">{mission.text}</p>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About — Core Values (one clean row) */}
      <section className="sucita-about-values ptb-100">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-7 text-center">
              <ScrollReveal className="sucita-reveal-up">
                <p className="sucita-about-label mb-3">What guides us</p>
                <h2 className="mb-3">Core Values</h2>
                <p className="sucita-about-body mb-0">
                  Five principles that shape every engagement and every client relationship.
                </p>
              </ScrollReveal>
            </div>
          </div>

          <div className="sucita-values-row">
            {coreValues.map((value, index) => {
              const Icon = valueIcons[value.title];
              return (
                <ScrollReveal
                  key={value.title}
                  className="sucita-reveal-up"
                  delay={index * 70}
                >
                  <article className="sucita-value-item">
                    <span className="sucita-value-icon" aria-hidden="true">
                      {Icon ? <Icon /> : null}
                    </span>
                    <h3 className="sucita-value-title">{value.title}</h3>
                    <p className="sucita-value-desc mb-0">{value.description}</p>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
