export default function KohostPageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section
      className="page-header-section ptb-100 gradient-bg"
      style={{ background: "linear-gradient(135deg, #083d36 0%, #188a6d 100%)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7 text-center">
            <div className="page-header-content text-white">
              <h1 className="text-white mb-3">{title}</h1>
              {subtitle && <p className="lead mb-0">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
