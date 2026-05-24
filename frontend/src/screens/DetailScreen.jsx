import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import Stepper from '../components/Stepper.jsx';
import { hotelsAPI } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const HUES = ['warm', 'forest', 'ocean', 'dusk'];

function Rating({ value, size = 12 }) {
  return (
    <span className="hcard-rating">
      <Icon name="star" size={size} style={{ color: 'var(--accent)' }} />
      <span>{Number(value).toFixed(1)}</span>
    </span>
  );
}

export default function DetailScreen() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const today    = new Date();
  const inDate   = new Date(today.getTime() + 14 * 86400000).toISOString().slice(0, 10);
  const outDate  = new Date(today.getTime() + 17 * 86400000).toISOString().slice(0, 10);

  const [checkin, setCheckin]   = useState(inDate);
  const [checkout, setCheckout] = useState(outDate);
  const [guests, setGuests]     = useState(2);
  const [rooms, setRooms]       = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['hotel', slug],
    queryFn: () => hotelsAPI.detail(slug).then((d) => d.hotel),
  });

  if (isLoading) return <div className="container-wide" style={{ padding: '120px 0', textAlign: 'center' }}><p className="text-muted">Loading…</p></div>;
  if (!data) return <div className="container-wide" style={{ padding: '120px 0', textAlign: 'center' }}><h2 className="h-2">Hotel not found</h2></div>;

  const hotel = data;
  const baseRoom = hotel.rooms?.[0];
  const nights = Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000));
  const subtotal = baseRoom ? baseRoom.price_per_night * nights * rooms : 0;
  const taxes    = Math.round(subtotal * 0.18);
  const total    = subtotal + taxes;

  const reserve = (roomId = selectedRoomId || baseRoom?.id) => {
    if (!user) { navigate(`/login?next=${encodeURIComponent('/booking?room=' + roomId)}`); return; }
    const params = new URLSearchParams();
    params.set('room',     roomId);
    params.set('hotel',    hotel.slug);
    params.set('checkin',  checkin);
    params.set('checkout', checkout);
    params.set('guests',   guests);
    navigate(`/booking?${params.toString()}`);
  };

  const tabs = ['overview', 'amenities', 'rooms', 'reviews', 'location'];

  return (
    <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <div className="row mb-6" style={{ gap: 8 }}>
        <button onClick={() => navigate('/hotels')} className="text-muted" style={{ fontSize: 13 }}>← All stays</button>
        <span className="text-muted" style={{ fontSize: 13, opacity: 0.5 }}>/</span>
        <span className="text-mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-3)' }}>{hotel.region}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div className="row" style={{ gap: 10, marginBottom: 12 }}>
            {hotel.badge && <span className="tag">{hotel.badge}</span>}
            <span className="eyebrow">{hotel.region} · est. 2014</span>
          </div>
          <h1 className="h-1">{hotel.name}</h1>
          <div className="row mt-3" style={{ gap: 18, flexWrap: 'wrap' }}>
            <span className="row" style={{ gap: 6 }}><Icon name="pin" size={14} /> <span style={{ fontSize: 14 }}>{hotel.address || `${hotel.city}, ${hotel.region}`}</span></span>
            {hotel.rating_avg > 0 && (
              <span className="row" style={{ gap: 6 }}>
                <Icon name="star" size={14} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 14 }}>{Number(hotel.rating_avg).toFixed(1)} · {hotel.rating_count} reviews</span>
              </span>
            )}
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icon name="heart" size={14} /> Save</button>
          <button className="btn btn-ghost btn-sm"><Icon name="arrow-up-right" size={14} /> Share</button>
        </div>
      </div>

      <div className="detail-gallery">
        <div><Photo hue={hotel.hue} src={hotel.hero_image_url} label="hero · 8:5" /></div>
        {HUES.map((h, i) => (
          <div key={h}><Photo hue={hotel.gallery?.[i]?.url ? undefined : h} src={hotel.gallery?.[i]?.url} label={['suite','garden','pool','dining'][i]} /></div>
        ))}
      </div>

      <div className="tabs-bar">
        {tabs.map((t) => (
          <button key={t} className={activeTab === t ? 'is-active' : ''} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="detail-shell">
        <main>
          {activeTab === 'overview' && (
            <>
              <section className="mb-8">
                <div className="eyebrow mb-3">— About the stay</div>
                <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 640, color: 'var(--ink-2)' }}>{hotel.description}</p>
              </section>
              <section className="mb-8">
                <div className="eyebrow mb-4">— Quick facts</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, padding: '20px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
                  {[
                    ['Check-in',  String(hotel.checkin_time || '15:00').slice(0,5)],
                    ['Check-out', String(hotel.checkout_time || '11:00').slice(0,5)],
                    ['Rooms',     (hotel.rooms || []).length || '—'],
                    ['Host',      hotel.host_business || hotel.host_name || '—'],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <div className="eyebrow mb-2">{k}</div>
                      <div className="serif" style={{ fontSize: 26 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'amenities' && (
            <section className="fade-up">
              <div className="eyebrow mb-4">— What's included</div>
              <div className="amenities-grid">
                {(hotel.amenities || []).map((a) => (
                  <div className="amenity" key={a.key}>
                    <span className="amenity-icon"><Icon name={a.icon} size={18} /></span>
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'rooms' && (
            <section className="fade-up">
              <div className="eyebrow mb-4">— Available rooms</div>
              <div className="room-list">
                {(hotel.rooms || []).map((r) => (
                  <div className="room" key={r.id}>
                    <div className="room-img"><Photo hue={r.hue} src={r.image_url} /></div>
                    <div className="room-content">
                      <h3 className="room-title">{r.type}</h3>
                      <span className="text-muted" style={{ fontSize: 13 }}>{[r.view, r.beds, r.size_sqm && `${r.size_sqm} sqm`].filter(Boolean).join(' · ')}</span>
                      <div className="room-feats mt-3">
                        <span className="chip">Free cancellation</span>
                        <span className="chip">Breakfast</span>
                        <span className="chip">Wi-Fi</span>
                      </div>
                    </div>
                    <div className="room-action">
                      <div>
                        <div className="text-mono" style={{ fontSize: 22, fontWeight: 500, textAlign: 'right' }}>₹{Number(r.price_per_night).toLocaleString('en-IN')}</div>
                        <div className="text-muted" style={{ fontSize: 12, textAlign: 'right' }}>/ night</div>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => { setSelectedRoomId(r.id); reserve(r.id); }}>
                        Reserve <Icon name="arrow-right" size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'reviews' && (
            <section className="fade-up">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 28 }}>
                <div>
                  <div className="serif" style={{ fontSize: 56, lineHeight: 1 }}>{Number(hotel.rating_avg || 0).toFixed(1)}</div>
                  <div className="text-muted mt-2" style={{ fontSize: 13 }}>{hotel.rating_count} verified reviews</div>
                </div>
              </div>

              <div className="reviews">
                {(hotel.reviews || []).map((rv) => (
                  <div className="review" key={rv.id}>
                    <p className="review-quote">"{rv.comment}"</p>
                    <div className="review-meta">
                      <div className="row" style={{ gap: 12 }}>
                        <span className="avatar">{rv.customer_name?.[0] || '·'}</span>
                        <div className="review-author">
                          {rv.customer_name}
                          <small>{new Date(rv.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</small>
                        </div>
                      </div>
                      <Rating value={rv.rating} />
                    </div>
                  </div>
                ))}
                {(!hotel.reviews || hotel.reviews.length === 0) && (
                  <p className="text-muted">No reviews yet — be the first to stay.</p>
                )}
              </div>
            </section>
          )}

          {activeTab === 'location' && (
            <section className="fade-up">
              <div className="eyebrow mb-4">— On the map</div>
              <div style={{ aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', position: 'relative', background: 'var(--bg-inset)', border: '1px solid var(--line)' }}>
                <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="800" height="450" fill="var(--bg-inset)" />
                  <rect width="800" height="450" fill="url(#grid)" />
                  <path d="M50,200 Q200,100 380,160 T720,180 L740,300 Q500,360 280,330 T80,310 Z" fill="var(--bg)" stroke="var(--line-strong)" strokeWidth="1"/>
                  <path d="M0,300 Q200,360 400,330 T800,340 L800,450 L0,450 Z" fill="color-mix(in oklab, var(--accent-2) 14%, transparent)" />
                  <g transform="translate(400, 220)">
                    <circle r="38" fill="color-mix(in oklab, var(--accent) 18%, transparent)" />
                    <circle r="22" fill="color-mix(in oklab, var(--accent) 30%, transparent)" />
                    <circle r="8" fill="var(--accent)" />
                  </g>
                </svg>
                <div style={{ position: 'absolute', left: 20, bottom: 20, padding: '10px 14px', background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 12, fontSize: 13 }}>
                  <div style={{ fontWeight: 500 }}>{hotel.name}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{hotel.city}, {hotel.region}</div>
                </div>
              </div>
            </section>
          )}
        </main>

        <aside>
          <div className="book-card">
            <div className="book-price-row">
              <div className="price-big">
                <span className="price-amount">₹{Number(baseRoom?.price_per_night || hotel.price_from || 0).toLocaleString('en-IN')}</span>
                <span className="price-unit">/ night</span>
              </div>
              {hotel.rating_avg > 0 && <Rating value={hotel.rating_avg} />}
            </div>
            <div className="book-dates">
              <div className="book-date-field">
                <div className="book-date-label">Check-in</div>
                <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} className="book-date-value" style={{ border: 0, background: 'transparent', padding: 0, width: '100%' }} />
              </div>
              <div className="book-date-field">
                <div className="book-date-label">Check-out</div>
                <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} className="book-date-value" style={{ border: 0, background: 'transparent', padding: 0, width: '100%' }} />
              </div>
            </div>
            <div className="stack" style={{ '--gap': '12px', padding: '8px 0' }}>
              <Stepper label="Guests" value={guests} min={1} max={8} onChange={setGuests} />
              <hr className="divider" />
              <Stepper label="Rooms" value={rooms} min={1} max={4} onChange={setRooms} />
            </div>

            <div style={{ padding: '16px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', margin: '16px 0' }}>
              <div className="summary-row"><span className="text-muted">₹{Number(baseRoom?.price_per_night || 0).toLocaleString()} × {nights} nights × {rooms} room</span><span className="text-mono">₹{subtotal.toLocaleString()}</span></div>
              <div className="summary-row"><span className="text-muted">Taxes & fees</span><span className="text-mono">₹{taxes.toLocaleString()}</span></div>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span className="text-mono">₹{total.toLocaleString()}</span>
            </div>

            <button className="btn btn-accent btn-lg mt-4" style={{ width: '100%' }} onClick={() => reserve()}>
              Reserve <Icon name="arrow-right" size={14} />
            </button>
            <p className="text-muted mt-3" style={{ fontSize: 12, textAlign: 'center' }}>You won't be charged yet.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
