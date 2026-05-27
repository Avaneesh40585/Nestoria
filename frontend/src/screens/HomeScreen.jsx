import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import SearchBar from '../components/SearchBar.jsx';
import HotelCard from '../components/HotelCard.jsx';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { hotelsAPI } from '../lib/api.js';
import { JOURNAL_POSTS } from '../lib/content.js';
import { useSavedHotels } from '../hooks/useSavedHotels.js';
import { useAuth } from '../context/AuthContext.jsx';

const JOURNAL = JOURNAL_POSTS.slice(0, 3);

export default function HomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isSaved, toggle: toggleSave } = useSavedHotels();
  const onSave = (id) => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    toggleSave(id);
  };

  const destinationsQ = useQuery({
    queryKey: ['destinations'],
    queryFn: () => hotelsAPI.destinations().then((d) => d.destinations),
  });
  const featuredQ = useQuery({
    queryKey: ['hotels', 'featured'],
    queryFn: () => hotelsAPI.search({ sort: 'score' }).then((d) => d.hotels.slice(0, 4)),
  });

  const goSearch = (q) => {
    const params = new URLSearchParams();
    if (q.location) params.set('location', q.location);
    if (q.checkin)  params.set('checkin',  q.checkin);
    if (q.checkout) params.set('checkout', q.checkout);
    if (q.guests)   params.set('guests',   q.guests);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container-wide">
          <div className="hero-grid">
            <div className="fade-up">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-line" />
                <span className="eyebrow">A Journal of Stays · Issue 12</span>
              </div>
              <h1 className="h-display hero-title">
                Stays for the<br/>
                <em>quietly curious.</em>
              </h1>
              <p className="hero-sub">
                Hand-picked houses, lodges and retreats across India — chosen for the kind of details that make a stay actually memorable.
              </p>
              <SearchBar onSubmit={goSearch} />
              <div className="row mt-6" style={{ gap: 24, flexWrap: 'wrap' }}>
                <span className="eyebrow">Popular —</span>
                {['Udaipur','Goa','Coorg','Munnar','Auroville'].map((p) => (
                  <a key={p} href="#" onClick={(e) => { e.preventDefault(); goSearch({ location: p }); }}
                     style={{ fontSize: 13, borderBottom: '1px solid var(--line-strong)', paddingBottom: 1, color: 'var(--ink-2)' }}>
                    {p}
                  </a>
                ))}
              </div>
            </div>
            <div className="fade-up d2">
              {(() => {
                const cover = featuredQ.data?.[0];
                return (
                  <Link
                    to={cover ? `/hotel/${cover.slug}` : '/hotels'}
                    className="hero-image-frame"
                    style={{ display: 'block' }}
                  >
                    <Photo hue={cover?.hue || 'dusk'} src={cover?.hero_image_url} alt={cover?.name || ''} />
                    <div className="hero-photo-meta">
                      <div>
                        <div className="serif" style={{ fontSize: 22, lineHeight: 1.1 }}>
                          {cover?.name || 'The Marigold House'}
                        </div>
                        <div className="mono mt-2">
                          {cover ? `${cover.city} · ${cover.region}` : 'Udaipur · Rajasthan'}
                        </div>
                      </div>
                      <div className="mono">№ 01 / {featuredQ.data?.length || 8}</div>
                    </div>
                  </Link>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container-wide">
          <div className="stats-grid">
            <div><div className="stat-num">{featuredQ.data ? '8+' : '—'}</div><div className="stat-label">Curated stays</div></div>
            <div><div className="stat-num">{destinationsQ.data?.length ?? '—'}</div><div className="stat-label">Destinations</div></div>
            <div><div className="stat-num">4.8<span style={{fontSize:24,opacity:.5}}>/5</span></div><div className="stat-label">Average guest score</div></div>
            <div><div className="stat-num">2014</div><div className="stat-label">Year founded</div></div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="section">
        <div className="container-wide">
          <div className="section-head">
            <div className="section-title">
              <div className="eyebrow mb-3">— Destinations</div>
              <h2 className="h-1">Where to begin.</h2>
              <p className="section-sub">From the Thar to the Konkan. Five regions, five very different mornings.</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hotels')}>
              All destinations <Icon name="arrow-right" size={14} />
            </button>
          </div>
          <div className="dests-grid">
            {(destinationsQ.data || []).slice(0, 5).map((d) => (
              <div key={d.name} className="dest-card" onClick={() => navigate(`/hotels?location=${encodeURIComponent(d.name)}`)}>
                <Photo hue={d.hue || 'sand'} src={d.hero_image_url} alt={d.name} />
                <div className="dest-card-info">
                  <div>
                    <div className="dest-name">{d.name}</div>
                    <div className="dest-meta mt-2">{d.region}</div>
                  </div>
                  <div className="dest-meta">{d.stays} stays</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container-wide">
          <div className="section-head">
            <div className="section-title">
              <div className="eyebrow mb-3">— Editor's Picks</div>
              <h2 className="h-1">This month's most-talked-about stays.</h2>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hotels')}>
              View all stays <Icon name="arrow-right" size={14} />
            </button>
          </div>
          <div className="hotel-grid">
            {featuredQ.isLoading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="hcard"><div className="hcard-img" /><div className="hcard-body"><div className="hcard-name" style={{opacity:.4}}>Loading…</div></div></div>)
              : (featuredQ.data || []).map((h) => (
                  <HotelCard key={h.id} hotel={h} saved={isSaved(h.id)} onSave={() => onSave(h.id)} />
                ))}
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="section" style={{ background: 'var(--bg-inset)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container-wide">
          <div className="section-head">
            <div className="section-title">
              <div className="eyebrow mb-3">— The Journal</div>
              <h2 className="h-1">Field notes from the road.</h2>
            </div>
          </div>
          <div className="dests-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '300px' }}>
            {JOURNAL.map((j) => (
              <Link key={j.slug} to={`/journal/${j.slug}`} className="dest-card" style={{ cursor: 'pointer' }}>
                <Photo hue={j.hue} src={j.src} alt={j.title} />
                <div className="dest-card-info">
                  <div style={{ maxWidth: '78%' }}>
                    <div className="dest-meta mb-2">{j.dest.toUpperCase()} · {j.read.toUpperCase()} READ</div>
                    <div className="serif" style={{ fontSize: 22, lineHeight: 1.15, color: 'white' }}>{j.title}</div>
                  </div>
                  <Icon name="arrow-up-right" size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOST CTA */}
      <section className="section">
        <div className="container-wide">
          <div className="card" style={{ padding: '64px 56px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div>
              <div className="eyebrow mb-3">— For Hosts</div>
              <h2 className="h-1" style={{ maxWidth: 580 }}>If you've built something quiet and good, we'd like to meet you.</h2>
              <p className="section-sub mt-3" style={{ maxWidth: 480 }}>
                Nestoria works with independent hoteliers and homeowners who care about hospitality as a craft. No mass listings. No race to the bottom.
              </p>
            </div>
            <div className="stack" style={{ '--gap': '12px' }}>
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/login?role=host')}>
                Apply to host <Icon name="arrow-right" size={14} />
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/become-host')}>Read our standards</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
