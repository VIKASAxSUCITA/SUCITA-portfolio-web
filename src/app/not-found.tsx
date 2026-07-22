import Link from "next/link";

export default function NotFound() {
  return (
    <section className="ptb-100">
      <div className="container text-center">
        <h1 className="display-1 color-primary">404</h1>
        <h2>Page Not Found</h2>
        <p className="lead">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn btn-primary mt-3">Back to Home</Link>
      </div>
    </section>
  );
}
