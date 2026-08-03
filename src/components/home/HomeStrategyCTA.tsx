"use client";

import Link from "next/link";
import ScrollReveal from "@/components/template/ScrollReveal";
import MoveRightIcon from "@/components/icons/MoveRightIcon";
import EditableText from "@/components/admin/EditableText";
import type { HomeStrategyContent } from "@/lib/content/homeTypes";
import { defaultHomeContent } from "@/lib/content/homeDefaults";
import { useLocalizedCopy } from "@/lib/i18n/useLocalizedCopy";
import type { MessageKey } from "@/lib/i18n/messages";

const pointKeys: MessageKey[] = [
  "home.strategy.point1",
  "home.strategy.point2",
  "home.strategy.point3",
];

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
  const copy = useLocalizedCopy();
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
                  <p className="sucita-strategy-cta-label mb-3">
                    {copy(content.label, "home.strategy.label")}
                  </p>
                  <h2 className="text-white mb-3">
                    {copy(content.title, "home.strategy.title")}
                  </h2>
                  <p className="sucita-strategy-cta-copy mb-0">
                    {copy(content.text, "home.strategy.text")}
                  </p>
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
                        <span>
                          {pointKeys[index]
                            ? copy(point, pointKeys[index])
                            : point}
                        </span>
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
                    {copy(content.buttonLabel, "home.strategy.button")}
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
