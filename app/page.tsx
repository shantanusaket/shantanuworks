import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}

      <section className="hero">
        <div className="container">

          <div className="hero-badge">
            EXECUTION PLATFORM
          </div>

          <h1>
            Designing Systems
            <br />
            That Drive Results
          </h1>

          <p className="hero-description">
            Helping organizations improve visibility,
            efficiency, and decision-making through
            practical digital solutions.
          </p>

          <p className="hero-sub">
            From business websites and reporting systems
            to dashboards, automation workflows, and
            intelligent digital tools, ShantanuWorks™
            transforms ideas into systems that create
            measurable value.
          </p>

          <div className="hero-buttons">
            <Link
              href="/contact"
              className="primary-btn"
            >
              Start a Project
            </Link>

            <Link
              href="/contact"
              className="secondary-btn"
            >
              Book a Free Consultation
            </Link>
          </div>

          <div className="trust-line">
            Websites • Dashboards • Reporting •
            Automation • AI Solutions
          </div>

        </div>
      </section>
    </main>
  );
}