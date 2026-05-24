import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Photo from '../components/Photo.jsx';

const VALUES = [
  {
    icon: 'sparkle',
    title: 'Curated, never crowded',
    body: 'We list small. Eight properties at launch, growing carefully. Every stay is one we would book ourselves.',
  },
  {
    icon: 'compass',
    title: 'Independent operators only',
    body: 'No chains, no aggregators reselling other people\'s inventory. The host you book with is the family that runs the place.',
  },
  {
    icon: 'shield',
    title: 'Honest pricing',
    body: 'One nightly rate, the tax shown clearly, a 10% platform fee disclosed to the host. No surge pricing, no fake urgency.',
  },
];

const TEAM = [
  { name: 'Anaya Mehra',   role: 'Editor at large',     bio: 'Spent a decade writing for travel magazines before deciding the bookings should match the writing.' },
  { name: 'Marcus Lee',    role: 'Engineering',         bio: 'Built the platform from a beach house in Mandrem. The wifi was the hardest part.' },
  { name: 'Riya Bhandari', role: 'Host relationships',  bio: 'Knows every host by first name and most of their dogs by sight.' },
];

export default function AboutScreen() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container-wide">
          <div className="hero-grid">
            <div className="fade-up">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-line" />
                <span className="eyebrow">About Nestoria</span>
              </div>
              <h1 className="h-display hero-title">
                A small list,<br/>
                <em>kept carefully.</em>
              </h1>
              <p className="hero-sub">
                Nestoria is a slow travel platform for independent Indian stays. We started in 2024 because we wanted a booking site that felt like a magazine and worked like a friend — small, opinionated, honest about what you\'re getting.
              </p>
              <div className="row mt-6" style={{ gap: 12, flexWrap: 'wrap' }}>
                <Link to="/hotels" className="btn btn-primary">Browse stays <Icon name="arrow-right" size={14} /></Link>
                <Link to="/journal" className="btn btn-ghost">Read the journal</Link>
              </div>
            </div>
            <div className="fade-up d2">
              <div className="hero-image-frame">
                <Photo hue="sand" />
                <div className="hero-photo-meta">
                  <div>
                    <div className="serif" style={{ fontSize: 22, lineHeight: 1.1 }}>The Marigold House</div>
                    <div className="mono mt-2">Udaipur · Rajasthan</div>
                  </div>
                  <div className="mono">est. 2024</div>
                </div>
                <div className="photo-label">cover · about</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container-wide">
          <div className="stats-grid">
            <div><div className="stat-num">8</div><div className="stat-label">Curated stays</div></div>
            <div><div className="stat-num">5</div><div className="stat-label">Destinations</div></div>
            <div><div className="stat-num">2024</div><div className="stat-label">Year founded</div></div>
            <div><div className="stat-num">3</div><div className="stat-label">People</div></div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section">
        <div className="container-wide">
          <div className="section-head">
            <div className="section-title">
              <div className="eyebrow mb-3">— What we do differently</div>
              <h2 className="h-1">Three things we won\'t compromise on.</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="kpi-grid">
            {VALUES.map((v) => (
              <div className="card-flat" key={v.title} style={{ padding: 28 }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={v.icon} size={20} />
                </span>
                <h3 className="serif mt-4" style={{ fontSize: 24, lineHeight: 1.2 }}>{v.title}</h3>
                <p className="text-muted mt-3" style={{ fontSize: 14, lineHeight: 1.6 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
            <div>
              <div className="eyebrow mb-3">— Our story</div>
              <h2 className="h-1">A booking site that reads like a journal.</h2>
            </div>
            <div className="stack" style={{ '--gap': '20px', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-2)', maxWidth: 640 }}>
              <p>The big OTAs are very good at one thing: showing you a thousand hotels in a city and helping you pick the cheapest. They\'re not very good at the question we kept asking ourselves — <em>which of these eight places will I remember in a year?</em></p>
              <p>Nestoria is the answer we wished existed. A short list, written by people who have stayed in every property, with photographs that are honest and prose that doesn\'t oversell. If a place is small and quiet, we say so. If the wifi is patchy, we say that too.</p>
              <p>We don\'t do dynamic pricing. We don\'t do surge weekends. We don\'t hide the taxes. We charge the hosts a flat 10% and let them keep the rest. That\'s the whole business model.</p>
              <p>Most of all, we don\'t list everything. There are roughly nine hundred independent boutique stays in India. We have eight. We\'ll get to nine when we find one that earns it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section" style={{ background: 'var(--bg-inset)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container-wide">
          <div className="section-head">
            <div className="section-title">
              <div className="eyebrow mb-3">— Three people</div>
              <h2 className="h-1">Who runs Nestoria.</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="kpi-grid">
            {TEAM.map((p) => (
              <div className="card-flat" key={p.name} style={{ padding: 28 }}>
                <span className="avatar" style={{ width: 56, height: 56, fontSize: 22 }}>{p.name[0]}</span>
                <h3 className="serif mt-4" style={{ fontSize: 22, lineHeight: 1.2 }}>{p.name}</h3>
                <div className="eyebrow mt-2">{p.role}</div>
                <p className="text-muted mt-3" style={{ fontSize: 14, lineHeight: 1.6 }}>{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-wide">
          <div className="card" style={{ padding: '64px 56px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div>
              <div className="eyebrow mb-3">— For the curious</div>
              <h2 className="h-1" style={{ maxWidth: 580 }}>Start where the writing is best.</h2>
              <p className="section-sub mt-3" style={{ maxWidth: 480 }}>The journal is where we think aloud about places before they make it onto the booking list.</p>
            </div>
            <div className="stack" style={{ '--gap': '12px' }}>
              <Link to="/journal" className="btn btn-accent btn-lg">Read the journal <Icon name="arrow-right" size={14} /></Link>
              <Link to="/hotels" className="btn btn-ghost btn-lg">Or browse stays</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
