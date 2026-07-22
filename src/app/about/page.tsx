import type { Metadata } from "next";
import KohostPageHeader from "@/components/template/KohostPageHeader";
import KohostCTA from "@/components/template/KohostCTA";
import { firmStory, vision, mission, coreValues } from "@/data/about";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <>
      <KohostPageHeader
        title="About Us"
        subtitle="Built on integrity, independence, and a commitment to client success."
      />

      <section className="about-section ptb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="section-heading mb-5">
                <h2>{firmStory.title}</h2>
              </div>
              {firmStory.paragraphs.map((p) => (
                <p key={p.slice(0, 30)} className="lead">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ptb-100 gray-light-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="card border-0 shadow-sm h-100 p-4">
                <h3 className="color-primary">{vision.title}</h3>
                <p className="mb-0 mt-3">{vision.text}</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100 p-4">
                <h3 className="color-primary">{mission.title}</h3>
                <p className="mb-0 mt-3">{mission.text}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ptb-100">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-6 text-center">
              <div className="section-heading">
                <h2>Core Values</h2>
                <p>The principles that guide every engagement and every client relationship.</p>
              </div>
            </div>
          </div>
          <div className="row">
            {coreValues.map((value) => (
              <div key={value.title} className="col-md-6 col-lg-4 mb-4">
                <div className="card single-promo-card p-4 h-100">
                  <h5>{value.title}</h5>
                  <p className="mb-0">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KohostCTA />
    </>
  );
}
