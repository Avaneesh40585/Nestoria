import { Link } from 'react-router-dom';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';

const WHY = [
  { icon: 'sparkle',    title: 'Editorial placement', body: 'Your property is presented with serious photography and prose written by people who have stayed there.' },
  { icon: 'compass',    title: 'Quality guests',      body: 'Travellers who choose Nestoria are looking for considered stays. Cancellation rates run under 4%.' },
  { icon: 'shield',     title: '10% flat fee',        body: 'No listing fee, no per-stay surcharge, no surge pricing. The maths is predictable.' },
  { icon: 'calendar',   title: 'Monthly payouts',     body: 'Paid on the 1st, net of refunds. Bank transfer or UPI.' },
];

const STEPS = [
  { n: 1, title: 'Apply',     body: 'Tell us about your property in a short form. We respond within a week with a yes, a not-yet, or a conversation.' },
  { n: 2, title: 'Onboard',   body: 'Our editor visits (or arranges remote photography), writes the listing copy with you, and helps you set up rooms.' },
  { n: 3, title: 'Go live',   body: 'Your listing publishes. You manage bookings, calendar, and pricing from the Host workspace — we handle payment.' },
];

export default function BecomeHostScreen() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container-wide">
          <div className="hero-grid">
            <div className="fade-up">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-line" />
                <span className="eyebrow">For hosts</span>
              </div>
              <h1 className="h-display hero-title">
                If you've built<br/>
                <em>something good,</em><br/>
                we'd like to meet you.
              </h1>
              <p className="hero-sub">
                Nestoria works with independent hoteliers and homeowners who care about hospitality as a craft. No mass listings, no race to the bottom — just a small, well-photographed list of stays worth flying for.
              </p>
              <div className="row mt-6" style={{ gap: 12, flexWrap: 'wrap' }}>
                <Link to="/login?role=host" className="btn btn-accent btn-lg">
                  Apply to host <Icon name="arrow-right" size={14} />
                </Link>
                <a href="#how" className="btn btn-ghost btn-lg">How it works</a>
              </div>
            </div>
            <div className="fade-up d2">
              <div className="hero-image-frame">
                <Photo hue="forest" src="https://twsdesejcimvmrbopdwj.supabase.co/storage/v1/object/public/hotel-images/hotels/house-of-cardamom/hero.jpg" alt="House of Cardamom" />
                <div className="hero-photo-meta">
                  <div>
                    <div className="serif" style={{ fontSize: 22, lineHeight: 1.1 }}>House of Cardamom</div>
                    <div className="mono mt-2">Madikeri · Coorg</div>
                  </div>
                  <div className="mono">est. 1934</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container-wide">
          <div className="stats-grid">
            <div><div className="stat-num">10%</div><div className="stat-label">Flat commission</div></div>
            <div><div className="stat-num">4<span style={{fontSize:24,opacity:.5}}>%</span></div><div className="stat-label">Cancellation rate</div></div>
            <div><div className="stat-num">24h</div><div className="stat-label">Avg payout time</div></div>
            <div><div className="stat-num">4.8</div><div className="stat-label">Avg guest rating</div></div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section">
        <div className="container-wide">
          <div className="section-head">
            <div className="section-title">
              <div className="eyebrow mb-3">— Why Nestoria</div>
              <h2 className="h-1">Four reasons our hosts stay with us.</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="kpi-grid">
            {WHY.map((w) => (
              <div key={w.title} className="card-flat" style={{ padding: 24 }}>
                <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-inset)', color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={w.icon} size={18} />
                </span>
                <h3 className="serif mt-4" style={{ fontSize: 20, lineHeight: 1.2 }}>{w.title}</h3>
                <p className="text-muted mt-2" style={{ fontSize: 13, lineHeight: 1.55 }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="section" style={{ paddingTop: 0 }}>
        <div className="container-wide">
          <div className="section-head">
            <div className="section-title">
              <div className="eyebrow mb-3">— How it works</div>
              <h2 className="h-1">Three steps. About six weeks.</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="kpi-grid">
            {STEPS.map((s) => (
              <div key={s.n} className="card-flat" style={{ padding: 32, position: 'relative' }}>
                <div className="serif" style={{ fontSize: 64, lineHeight: 1, color: 'var(--accent)', opacity: 0.85 }}>0{s.n}</div>
                <h3 className="serif mt-3" style={{ fontSize: 24, lineHeight: 1.2 }}>{s.title}</h3>
                <p className="text-muted mt-3" style={{ fontSize: 14, lineHeight: 1.65 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="section" style={{ background: 'var(--bg-inset)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ maxWidth: 880, textAlign: 'center' }}>
          <div className="eyebrow mb-3">— From a host</div>
          <p className="serif" style={{ fontSize: 36, lineHeight: 1.25, color: 'var(--ink)', maxWidth: 760, margin: '0 auto' }}>
            "Nestoria sends fewer guests than the bigger sites — and our reviews have never been better. The guests they send actually want to be here."
          </p>
          <div className="row mt-6" style={{ justifyContent: 'center', gap: 12 }}>
            <span className="avatar">V</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Vikram Singh</div>
              <div className="text-muted" style={{ fontSize: 12 }}>The Marigold House, Udaipur · Host since 2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-wide">
          <div className="card" style={{ padding: '64px 56px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div>
              <div className="eyebrow mb-3">— Ready when you are</div>
              <h2 className="h-1" style={{ maxWidth: 580 }}>List your property in about an hour.</h2>
              <p className="section-sub mt-3" style={{ maxWidth: 480 }}>
                Sign up, fill in the wizard, upload your photographs. We take it from there.
              </p>
            </div>
            <div className="stack" style={{ '--gap': '12px' }}>
              <Link to="/login?role=host" className="btn btn-accent btn-lg">
                Apply to host <Icon name="arrow-right" size={14} />
              </Link>
              <Link to="/contact" className="btn btn-ghost btn-lg">Talk to a human first</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
