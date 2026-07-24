"use client";

import Image from "next/image";
import type { ComponentType } from "react";
import ScrollReveal from "@/components/template/ScrollReveal";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import {
  IntegrityIcon,
  IndependenceIcon,
  ClientSuccessIcon,
  AccountabilityIcon,
  ExcellenceIcon,
} from "@/components/icons/CoreValueIcons";
import type { HomeAboutContent } from "@/lib/content/homeTypes";
import { defaultHomeContent } from "@/lib/content/homeDefaults";

const valueIcons: Record<string, ComponentType<{ className?: string }>> = {
  Integrity: IntegrityIcon,
  Independence: IndependenceIcon,
  "Client Success": ClientSuccessIcon,
  Accountability: AccountabilityIcon,
  Excellence: ExcellenceIcon,
};

type Props = {
  content?: HomeAboutContent;
  edit?: {
    onChange: (updater: (prev: HomeAboutContent) => HomeAboutContent) => void;
  };
};

export default function HomeAbout({
  content = defaultHomeContent.about,
  edit,
}: Props) {
  return (
    <>
      <section id="about" className="sucita-about-intro ptb-100">
        <div className="container">
          <div className="row align-items-center justify-content-between mb-5 mb-lg-6">
            <div className="col-lg-5 mb-5 mb-lg-0">
              <ScrollReveal className="sucita-reveal-left">
                {edit ? (
                  <>
                    <EditableText
                      className="sucita-about-label mb-3"
                      value={content.label}
                      label="About label"
                      onChange={(label) =>
                        edit.onChange((prev) => ({ ...prev, label }))
                      }
                    />
                    <EditableText
                      className="sucita-about-title mb-4"
                      value={content.title}
                      label="About title"
                      onChange={(title) =>
                        edit.onChange((prev) => ({ ...prev, title }))
                      }
                    />
                    {content.paragraphs.map((paragraph, index) => (
                      <EditableText
                        key={index}
                        className="sucita-about-body mb-3"
                        multiline
                        value={paragraph}
                        label={`About paragraph ${index + 1}`}
                        onChange={(value) =>
                          edit.onChange((prev) => {
                            const paragraphs = [...prev.paragraphs];
                            paragraphs[index] = value;
                            return { ...prev, paragraphs };
                          })
                        }
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <p className="sucita-about-label mb-3">{content.label}</p>
                    <h2 className="sucita-about-title mb-4">{content.title}</h2>
                    {content.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className={`sucita-about-body ${
                          index === content.paragraphs.length - 1 ? "mb-0" : "mb-3"
                        }`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </>
                )}
              </ScrollReveal>
            </div>

            <div className="col-lg-6">
              <ScrollReveal className="sucita-reveal-right" delay={120}>
                <div className="sucita-about-visual">
                  <div className="sucita-about-visual-frame">
                    {edit ? (
                      <EditableImage
                        src={content.image}
                        alt="About image"
                        className="sucita-about-visual-img"
                        onChange={(image) =>
                          edit.onChange((prev) => ({ ...prev, image }))
                        }
                      />
                    ) : (
                      <Image
                        src={content.image}
                        alt="Sucita & Partners team at work"
                        width={800}
                        height={640}
                        className="sucita-about-visual-img"
                      />
                    )}
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
                  {edit ? (
                    <EditableText
                      className="sucita-vm-heading mb-0"
                      value={content.visionTitle}
                      label="Vision title"
                      onChange={(visionTitle) =>
                        edit.onChange((prev) => ({ ...prev, visionTitle }))
                      }
                    />
                  ) : (
                    <h3 className="sucita-vm-heading mb-0">{content.visionTitle}</h3>
                  )}
                </div>
                {edit ? (
                  <EditableText
                    className="sucita-vm-text"
                    multiline
                    value={content.visionText}
                    label="Vision text"
                    onChange={(visionText) =>
                      edit.onChange((prev) => ({ ...prev, visionText }))
                    }
                  />
                ) : (
                  <p className="sucita-vm-text mb-0">{content.visionText}</p>
                )}
              </article>
            </ScrollReveal>

            <ScrollReveal className="sucita-reveal-up" delay={100}>
              <article className="sucita-vm-card">
                <div className="sucita-vm-card-top">
                  <span className="sucita-vm-mark" aria-hidden="true">
                    M
                  </span>
                  {edit ? (
                    <EditableText
                      className="sucita-vm-heading mb-0"
                      value={content.missionTitle}
                      label="Mission title"
                      onChange={(missionTitle) =>
                        edit.onChange((prev) => ({ ...prev, missionTitle }))
                      }
                    />
                  ) : (
                    <h3 className="sucita-vm-heading mb-0">{content.missionTitle}</h3>
                  )}
                </div>
                {edit ? (
                  <EditableText
                    className="sucita-vm-text"
                    multiline
                    value={content.missionText}
                    label="Mission text"
                    onChange={(missionText) =>
                      edit.onChange((prev) => ({ ...prev, missionText }))
                    }
                  />
                ) : (
                  <p className="sucita-vm-text mb-0">{content.missionText}</p>
                )}
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="sucita-about-values ptb-100">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-7 text-center">
              <ScrollReveal className="sucita-reveal-up">
                {edit ? (
                  <>
                    <EditableText
                      className="sucita-about-label mb-3"
                      value={content.valuesLabel}
                      label="Values label"
                      onChange={(valuesLabel) =>
                        edit.onChange((prev) => ({ ...prev, valuesLabel }))
                      }
                    />
                    <EditableText
                      className="mb-3"
                      value={content.valuesTitle}
                      label="Values title"
                      onChange={(valuesTitle) =>
                        edit.onChange((prev) => ({ ...prev, valuesTitle }))
                      }
                    />
                    <EditableText
                      className="sucita-about-body"
                      multiline
                      value={content.valuesIntro}
                      label="Values intro"
                      onChange={(valuesIntro) =>
                        edit.onChange((prev) => ({ ...prev, valuesIntro }))
                      }
                    />
                  </>
                ) : (
                  <>
                    <p className="sucita-about-label mb-3">{content.valuesLabel}</p>
                    <h2 className="mb-3">{content.valuesTitle}</h2>
                    <p className="sucita-about-body mb-0">{content.valuesIntro}</p>
                  </>
                )}
              </ScrollReveal>
            </div>
          </div>

          <div className="sucita-values-row">
            {content.values.map((value, index) => {
              const Icon = valueIcons[value.title];
              return (
                <ScrollReveal
                  key={`${value.title}-${index}`}
                  className="sucita-reveal-up"
                  delay={index * 70}
                >
                  <article className="sucita-value-item">
                    <span className="sucita-value-icon" aria-hidden="true">
                      {Icon ? <Icon /> : null}
                    </span>
                    {edit ? (
                      <>
                        <EditableText
                          className="sucita-value-title"
                          value={value.title}
                          label={`Value ${index + 1} title`}
                          onChange={(title) =>
                            edit.onChange((prev) => {
                              const values = prev.values.map((item, i) =>
                                i === index ? { ...item, title } : item
                              );
                              return { ...prev, values };
                            })
                          }
                        />
                        <EditableText
                          className="sucita-value-desc"
                          multiline
                          value={value.description}
                          label={`Value ${index + 1} description`}
                          onChange={(description) =>
                            edit.onChange((prev) => {
                              const values = prev.values.map((item, i) =>
                                i === index ? { ...item, description } : item
                              );
                              return { ...prev, values };
                            })
                          }
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="sucita-value-title">{value.title}</h3>
                        <p className="sucita-value-desc mb-0">{value.description}</p>
                      </>
                    )}
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
