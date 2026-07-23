import ScrollReveal from "@/components/template/ScrollReveal";
import { serviceCategories } from "@/data/services";

export default function HomeServices() {
  return (
    <section className="sucita-services ptb-100">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-7 text-center">
            <ScrollReveal className="sucita-reveal-up">
              <p className="sucita-about-label mb-3">What we offer</p>
              <h2 className="sucita-services-title mb-3">Services</h2>
              <p className="sucita-about-body mb-0">
                Audit, accounting, tax, and strategy — organized into three clear
                practice areas.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="sucita-services-grid">
          {serviceCategories.map((category, index) => (
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
                      {category.letter}
                    </span>
                    <div>
                      <p className="sucita-service-practice mb-1">Practice area</p>
                      <h3 className="sucita-service-col-title">{category.title}</h3>
                    </div>
                  </div>
                  <p className="sucita-service-card-desc mb-0">
                    {category.description}
                  </p>
                </header>
                <ul className="sucita-service-list list-unstyled mb-0">
                  {category.items.map((item) => (
                    <li key={item}>
                      <span className="sucita-service-check" aria-hidden="true">
                        <i className="fas fa-check" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <footer className="sucita-service-card-footer">
                  {category.items.length} services
                </footer>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
