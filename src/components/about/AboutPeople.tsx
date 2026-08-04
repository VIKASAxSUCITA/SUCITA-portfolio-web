"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/template/ScrollReveal";
import { people, type Person } from "@/data/about";

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function PersonPhoto({ person, priority = false }: { person: Person; priority?: boolean }) {
  const [failed, setFailed] = useState(!person.image);

  if (failed || !person.image) {
    return (
      <span className="sucita-people-avatar-fallback" aria-hidden="true">
        {initialsFromName(person.name)}
      </span>
    );
  }

  return (
    <Image
      src={person.image}
      alt={person.name}
      width={480}
      height={560}
      className="sucita-people-photo"
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

export default function AboutPeople() {
  if (!people.length) return null;

  const [director, ...others] = people;

  return (
    <section className="sucita-people ptb-100" aria-labelledby="director-message-heading">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-7 text-center">
            <ScrollReveal className="sucita-reveal-up">
              <p className="sucita-about-label mb-3">Our leadership</p>
              <h2 id="director-message-heading" className="mb-0">
              Managing Director’s Message
              </h2>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal className="sucita-reveal-up">
          <article className="sucita-people-director">
            <div className="sucita-people-director-media">
              <PersonPhoto person={director} priority />
            </div>
            <div className="sucita-people-director-copy">
              <h3 className="sucita-people-name">{director.name}</h3>
              <p className="sucita-people-role">{director.position}</p>
              <p className="sucita-people-message mb-0">{director.message}</p>
            </div>
          </article>
        </ScrollReveal>

        {others.length > 0 ? (
          <div className="sucita-people-grid">
            {others.map((person, index) => (
              <ScrollReveal
                key={person.name}
                className="sucita-reveal-up"
                delay={index * 70}
              >
                <article className="sucita-people-card">
                  <div className="sucita-people-card-media">
                    <PersonPhoto person={person} />
                  </div>
                  <h3 className="sucita-people-name">{person.name}</h3>
                  <p className="sucita-people-role">{person.position}</p>
                  <p className="sucita-people-message mb-0">{person.message}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
