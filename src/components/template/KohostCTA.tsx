import Link from "next/link";

export default function KohostCTA() {
  return (
    <section className="ptb-100 gray-light-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <h2>Let&apos;s work together</h2>
            <p className="lead">
              Contact Sucita & Partners today for accounting, tax, audit, and compliance
              support tailored to your business.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg mt-3">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
