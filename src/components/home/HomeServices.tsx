"use client";

import Link from "next/link";
import ScrollReveal from "@/components/template/ScrollReveal";
import EditableText from "@/components/admin/EditableText";
import MoveRightIcon from "@/components/icons/MoveRightIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import {
  countServiceItems,
  type ServiceCategory,
} from "@/data/services";
import type { HomeServicesContent } from "@/lib/content/homeTypes";
import { defaultHomeContent } from "@/lib/content/homeDefaults";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedCopy } from "@/lib/i18n/useLocalizedCopy";

type Props = {
  content?: HomeServicesContent;
  categories?: ServiceCategory[];
  edit?: {
    onChange: (
      updater: (prev: HomeServicesContent) => HomeServicesContent
    ) => void;
  };
};

function getServiceIcon(id: string) {
  switch (id) {
    case "audit-assurance":
      return "fas fa-shield-alt";
    case "accounting-tax":
      return "fas fa-calculator";
    case "transformative-strategy":
      return "fas fa-chart-line";
    default:
      return "fas fa-briefcase";
  }
}

export default function HomeServices({
  content = defaultHomeContent.services,
  categories,
  edit,
}: Props) {
  const { t, L } = useLocale();
  const copy = useLocalizedCopy();
  const data: HomeServicesContent = {
    ...content,
    categories: categories ?? content.categories,
  };

  return (
    <section id="services" className="sucita-services ptb-100">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-7 text-center">
            <ScrollReveal className="sucita-reveal-up">
              {edit ? (
                <>
                  <EditableText
                    className="sucita-about-label mb-3"
                    value={data.label}
                    label="Services label"
                    onChange={(label) =>
                      edit.onChange((prev) => ({ ...prev, label }))
                    }
                  />
                  <EditableText
                    className="sucita-services-title mb-3"
                    value={data.title}
                    label="Services title"
                    onChange={(title) =>
                      edit.onChange((prev) => ({ ...prev, title }))
                    }
                  />
                  <EditableText
                    className="sucita-about-body"
                    multiline
                    value={data.intro}
                    label="Services intro"
                    onChange={(intro) =>
                      edit.onChange((prev) => ({ ...prev, intro }))
                    }
                  />
                </>
              ) : (
                <>
                  <p className="sucita-about-label mb-3">
                    {copy(data.label, "home.services.label")}
                  </p>
                  <h2 className="sucita-services-title mb-3">
                    {copy(data.title, "home.services.title")}
                  </h2>
                  <p className="sucita-about-body mb-0">
                    {copy(data.intro, "home.services.intro")}
                  </p>
                </>
              )}
            </ScrollReveal>
          </div>
        </div>

        <div className="sucita-services-grid">
          {data.categories.map((category, index) => (
            <ScrollReveal
              key={category.id}
              className="sucita-reveal-up"
              delay={index * 90}
            >
              <article className="sucita-service-card" id={`home-${category.id}`}>
                <span className="sucita-service-card-accent" aria-hidden="true" />
                <header className="sucita-service-card-header">
                  <div className="sucita-service-card-top">
                    <span className="sucita-service-letter" aria-hidden="true">
                      <i className={getServiceIcon(category.id)} />
                    </span>
                    <div>
                      <p className="sucita-service-practice mb-1">
                        {t("home.services.practiceArea")}
                      </p>
                      {edit ? (
                        <EditableText
                          className="sucita-service-col-title"
                          value={L(category.title)}
                          label={`${category.letter} title`}
                          onChange={(title) =>
                            edit.onChange((prev) => {
                              const next = prev.categories.map((item, i) =>
                                i === index ? { ...item, title } : item
                              );
                              return { ...prev, categories: next };
                            })
                          }
                        />
                      ) : (
                        <h3 className="sucita-service-col-title">{L(category.title)}</h3>
                      )}
                    </div>
                  </div>
                  {edit ? (
                    <EditableText
                      className="sucita-service-card-desc"
                      multiline
                      value={
                        typeof category.description === "string"
                          ? category.description
                          : category.description.en
                      }
                      label={`${category.letter} description`}
                      onChange={(description) =>
                        edit.onChange((prev) => {
                          const next = prev.categories.map((item, i) =>
                            i === index ? { ...item, description } : item
                          );
                          return { ...prev, categories: next };
                        })
                      }
                    />
                  ) : (
                    <p className="sucita-service-card-desc mb-0">
                      {L(category.description)}
                    </p>
                  )}
                </header>
                <ul className="sucita-service-list list-unstyled mb-0">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={`${typeof item.label === "string" ? item.label : item.label.en}-${itemIndex}`}
                      className={
                        item.children?.length
                          ? "sucita-service-item has-children"
                          : "sucita-service-item"
                      }
                    >
                      <div className="sucita-service-item-row">
                        <span className="sucita-service-check" aria-hidden="true">
                          <i className="fas fa-check" />
                        </span>
                        {edit ? (
                          <EditableText
                            className="sucita-service-item-label"
                            value={L(item.label)}
                            label={`Service item ${itemIndex + 1}`}
                            onChange={(label) =>
                              edit.onChange((prev) => {
                                const next = prev.categories.map((cat, i) => {
                                  if (i !== index) return cat;
                                  const items = cat.items.map((entry, j) =>
                                    j === itemIndex ? { ...entry, label } : entry
                                  );
                                  return { ...cat, items };
                                });
                                return { ...prev, categories: next };
                              })
                            }
                          />
                        ) : (
                          <span className="sucita-service-item-label">{L(item.label)}</span>
                        )}
                      </div>
                      {item.children?.length ? (
                        <ul className="sucita-service-sublist list-unstyled mb-0">
                          {item.children.map((child, childIndex) => (
                            <li key={`${child}-${childIndex}`}>
                              <span className="sucita-service-submark" aria-hidden="true">
                                <PlayIcon className="sucita-service-play-icon" />
                              </span>
                              {edit ? (
                                <EditableText
                                  value={L(child)}
                                  label={`Sub service ${childIndex + 1}`}
                                  onChange={(value) =>
                                    edit.onChange((prev) => {
                                      const next = prev.categories.map((cat, i) => {
                                        if (i !== index) return cat;
                                        const items = cat.items.map((entry, j) => {
                                          if (j !== itemIndex) return entry;
                                          const children = [...(entry.children ?? [])];
                                          children[childIndex] = value;
                                          return { ...entry, children };
                                        });
                                        return { ...cat, items };
                                      });
                                      return { ...prev, categories: next };
                                    })
                                  }
                                />
                              ) : (
                                <span>{L(child)}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <footer className="sucita-service-card-footer d-flex align-items-center justify-content-between gap-2 flex-wrap">
                  <span>
                    {countServiceItems(category)} {t("home.services.count")}
                  </span>
                  {!edit ? (
                    <Link
                      href={`/services/${category.id}`}
                      className="read-more-link d-inline-flex align-items-center gap-2"
                    >
                      {t("common.learnMore")}
                      <MoveRightIcon className="sucita-link-arrow" />
                    </Link>
                  ) : null}
                </footer>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
