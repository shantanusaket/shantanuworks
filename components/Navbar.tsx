import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link href="/" className="logo">
          SHANTANUWORKS™
        </Link>

        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/process">How We Work</Link>
          <Link href="/what-we-build">What We Build</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <Link href="/contact" className="primary-btn">
          Start a Project
        </Link>
      </div>
    </header>
  );
}