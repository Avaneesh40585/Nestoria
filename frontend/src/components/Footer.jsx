import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-mark">Nestoria<span className="logo-dot" /></span>
            <p>A curated collection of stays for travellers who notice the details.</p>
          </div>
          <div className="footer-col">
            <h4>Discover</h4>
            <Link to="/hotels">Destinations</Link>
            <Link to="/hotels?sort=score">Featured stays</Link>
            <Link to="/hotels?sort=rating">Editor's picks</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/">About</Link>
            <Link to="/login">Become a host</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/">Help centre</Link>
            <Link to="/">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Nestoria Inc. — Crafted in India</span>
          <span className="text-mono">v 2.0 · Editorial</span>
        </div>
      </div>
    </footer>
  );
}
