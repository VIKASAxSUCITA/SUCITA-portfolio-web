"use client";

import Link from "next/link";
import ScrollReveal from "@/components/template/ScrollReveal";
import MoveRightIcon from "@/components/icons/MoveRightIcon";
import EditableText from "@/components/admin/EditableText";
import type { HomeStrategyContent } from "@/lib/content/homeTypes";
import { defaultHomeContent } from "@/lib/content/homeDefaults";

type Props = {
  content?: HomeStrategyContent;
  edit?: {
    onChange: (updater: (prev: HomeStrategyContent) => HomeStrategyContent) => void;
  };
};

export default function HomeStrategyCTA({
  content = defaultHomeContent.strategy,
  edit,
}: Props) {
  return (
    <section className="sucita-layer sucita-strategy-cta">
      <div className="sucita-strategy-cta-media" aria-hidden="true" />
      <div className="sucita-strategy-cta-overlay" aria-hidden="true" />

      <div className="container position-relative">
        <div className="row align-items-center justify-content-between sucita-strategy-cta-row">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <ScrollReveal className="sucita-reveal-left">
              {edit ? (
                <>
                  <EditableText
                    className="sucita-strategy-cta-label mb-3"
                    value={content.label}
                    label="CTA label"
                    onChange={(label) =>
                      edit.onChange((prev) => ({ ...prev, label }))
                    }
                  />
                  <EditableText
                    className="text-white h2-like mb-3"
                    value={content.title}
                    label="CTA title"
                    onChange={(title) =>
                      edit.onChange((prev) => ({ ...prev, title }))
                    }
                  />
                  <EditableText
                    className="sucita-strategy-cta-copy"
                    multiline
                    value={content.text}
                    label="CTA text"
                    onChange={(text) =>
                      edit.onChange((prev) => ({ ...prev, text }))
                    }
                  />
                </>
              ) : (
                <>
                  <p className="sucita-strategy-cta-label mb-3">{content.label}</p>
                  <h2 className="text-white mb-3">{content.title}</h2>
                  <p className="sucita-strategy-cta-copy mb-0">{content.text}</p>
                </>
              )}
            </ScrollReveal>
          </div>

          <div className="col-lg-5">
            <ScrollReveal className="sucita-reveal-right" delay={120}>
              <div className="sucita-strategy-cta-panel">
                <ul className="sucita-strategy-cta-list list-unstyled mb-4">
                  {content.points.map((point, index) => (
                    <li key={`${point}-${index}`}>
                      <span className="sucita-strategy-cta-check" aria-hidden="true">
                        <i className="fas fa-check" />
                      </span>
                      {edit ? (
                        <EditableText
                          value={point}
                          label={`CTA point ${index + 1}`}
                          onChange={(value) =>
                            edit.onChange((prev) => {
                              const points = [...prev.points];
                              points[index] = value;
                              return { ...prev, points };
                            })
                          }
                        />
                      ) : (
                        <span>{point}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {edit ? (
                  <EditableText
                    className="btn btn-tertiary btn-lg"
                    value={content.buttonLabel}
                    label="CTA button"
                    onChange={(buttonLabel) =>
                      edit.onChange((prev) => ({ ...prev, buttonLabel }))
                    }
                  />
                ) : (
                  <Link
                    href="/#contact"
                    className="btn btn-tertiary btn-lg sucita-strategy-cta-btn d-inline-flex align-items-center gap-2"
                  >
                    {content.buttonLabel}
                    <MoveRightIcon className="sucita-link-arrow" />
                  </Link>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
