"use client";

import Link from "next/link";
import ScrollReveal from "@/components/template/ScrollReveal";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import type { HomeHeroContent } from "@/lib/content/homeTypes";
import { defaultHomeContent } from "@/lib/content/homeDefaults";

type Props = {
  content?: HomeHeroContent;
  edit?: {
    onChange: (updater: (prev: HomeHeroContent) => HomeHeroContent) => void;
  };
};

export default function HomeHero({
  content = defaultHomeContent.hero,
  edit,
}: Props) {
  const bgStyle = {
    backgroundImage: `url(${content.backgroundImage})`,
  } as React.CSSProperties;

  return (
    <section id="home" className="sucita-hero overflow-hidden">
      {edit ? (
        <div className="sucita-hero-media admin-hero-media-edit" style={bgStyle}>
          <EditableImage
            src={content.backgroundImage}
            alt="Hero background"
            className="admin-hero-editable-image"
            onChange={(src) => edit.onChange((prev) => ({ ...prev, backgroundImage: src }))}
          />
        </div>
      ) : (
        <div
          className="sucita-hero-media"
          style={
            content.backgroundImage !== "/assets/img/homepage_banner.png"
              ? bgStyle
              : undefined
          }
          aria-hidden="true"
        />
      )}
      <div className="sucita-hero-overlay" aria-hidden="true" />
      <div className="container position-relative">
        <div className="row align-items-center sucita-hero-row">
          <div className="col-lg-8 col-xl-7">
            <ScrollReveal className="sucita-reveal-left">
              <div className="hero-slider-content text-white">
                {edit ? (
                  <>
                    <EditableText
                      className="text-white h1-like"
                      value={content.title}
                      label="Hero title"
                      onChange={(title) =>
                        edit.onChange((prev) => ({ ...prev, title }))
                      }
                    />
                    <EditableText
                      className="lead"
                      multiline
                      value={content.text}
                      label="Hero text"
                      onChange={(text) =>
                        edit.onChange((prev) => ({ ...prev, text }))
                      }
                    />
                    <div className="action-btns mt-4 d-flex flex-wrap gap-2">
                      <EditableText
                        className="btn btn-tertiary btn-lg"
                        value={content.aboutLabel}
                        label="About button"
                        onChange={(aboutLabel) =>
                          edit.onChange((prev) => ({ ...prev, aboutLabel }))
                        }
                      />
                      <EditableText
                        className="btn btn-outline-light btn-lg"
                        value={content.servicesLabel}
                        label="Services button"
                        onChange={(servicesLabel) =>
                          edit.onChange((prev) => ({ ...prev, servicesLabel }))
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-white">{content.title}</h1>
                    <p className="lead">{content.text}</p>
                    <div className="action-btns mt-4">
                      <Link href="/#about" className="btn btn-tertiary btn-lg me-2">
                        {content.aboutLabel}
                      </Link>
                      <Link href="/#services" className="btn btn-outline-light btn-lg">
                        {content.servicesLabel}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
