"use client";

import Image from "next/image";
import ScrollReveal from "@/components/template/ScrollReveal";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import type { HomeSplitContent } from "@/lib/content/homeTypes";
import { defaultHomeContent } from "@/lib/content/homeDefaults";

type Props = {
  content?: HomeSplitContent;
  edit?: {
    onChange: (updater: (prev: HomeSplitContent) => HomeSplitContent) => void;
  };
};

export default function HomeWhatWeDo({
  content = defaultHomeContent.whatWeDo,
  edit,
}: Props) {
  return (
    <section className="sucita-layer sucita-layer-do ptb-100">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-md-6 col-lg-5">
            <ScrollReveal className="sucita-reveal-left">
              <div className="feature-contents">
                {edit ? (
                  <>
                    <EditableText
                      className="h2-like mb-3"
                      value={content.title}
                      label="What we do title"
                      onChange={(title) =>
                        edit.onChange((prev) => ({ ...prev, title }))
                      }
                    />
                    <EditableText
                      className="lead"
                      multiline
                      value={content.text}
                      label="What we do text"
                      onChange={(text) =>
                        edit.onChange((prev) => ({ ...prev, text }))
                      }
                    />
                  </>
                ) : (
                  <>
                    <h2>{content.title}</h2>
                    <p>{content.text}</p>
                  </>
                )}
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
                  {edit ? (
                    <EditableImage
                      src={content.image}
                      alt={content.imageAlt}
                      className="sucita-photo-img"
                      onChange={(image) =>
                        edit.onChange((prev) => ({ ...prev, image }))
                      }
                    />
                  ) : (
                    <Image
                      src={content.image}
                      alt={content.imageAlt}
                      width={800}
                      height={640}
                      className="sucita-photo-img"
                    />
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
