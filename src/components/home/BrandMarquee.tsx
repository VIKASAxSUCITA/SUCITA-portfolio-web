"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BrandLogo } from "@/data/partners";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import {
  subscribeLogoGroup,
  type LogoGroup,
} from "@/lib/content/logosStore";

type Props = {
  items: BrandLogo[];
  /** When set, marquee stays in sync with Firestore in real time. */
  liveGroup?: LogoGroup;
  /** left = partners (A→Z), right = clients (Z→A) */
  direction?: "left" | "right";
  titleKey?: "home.partnersTitle" | "home.clientsTitle";
  title?: string;
  id?: string;
};

const ITEM_WIDTH = 176;

export default function BrandMarquee({
  items: initialItems,
  liveGroup,
  direction = "left",
  titleKey = "home.partnersTitle",
  title,
  id,
}: Props) {
  const { t } = useLocale();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(6);
  const [liveItems, setLiveItems] = useState<BrandLogo[] | null>(null);

  useEffect(() => {
    if (!liveGroup) return;
    return subscribeLogoGroup(liveGroup, setLiveItems);
  }, [liveGroup]);

  const items = liveItems ?? initialItems;

  const ordered = useMemo(
    () => (direction === "right" ? [...items].reverse() : items),
    [direction, items]
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || ordered.length === 0) return;

    const update = () => {
      const width = el.clientWidth || window.innerWidth;
      const needed = Math.ceil(width / ITEM_WIDTH) + 2;
      const perGroup = Math.max(2, Math.ceil(needed / ordered.length));
      setCopies(perGroup);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ordered.length]);

  const group = useMemo(
    () => Array.from({ length: copies }, () => ordered).flat(),
    [copies, ordered]
  );

  if (ordered.length === 0) return null;

  return (
    <section id={id} className="sucita-brand-marquee">
      <div className="container">
        <div className="text-center sucita-brand-marquee-heading">
          <h2 className="sucita-brand-marquee-title mb-0">
            {title ?? t(titleKey)}
          </h2>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`sucita-marquee${direction === "right" ? " is-reverse" : ""}`}
        aria-label={title ?? t(titleKey)}
      >
        <div className="sucita-marquee-track">
          <div className="sucita-marquee-group">
            {group.map((item, index) => (
              <div
                key={`a-${item.id}-${index}-${item.logo}`}
                className="sucita-marquee-item is-logo-only"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logo}
                  alt=""
                  className="sucita-marquee-logo"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          <div className="sucita-marquee-group" aria-hidden="true">
            {group.map((item, index) => (
              <div
                key={`b-${item.id}-${index}-${item.logo}`}
                className="sucita-marquee-item is-logo-only"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logo}
                  alt=""
                  className="sucita-marquee-logo"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
