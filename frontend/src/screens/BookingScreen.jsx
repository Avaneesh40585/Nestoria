import { Fragment, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { roomsAPI, bookingsAPI, hotelsAPI } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const TAX = 0.18;

function nightsBetween(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
}

export default function BookingScreen() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const roomId  = Number(params.get('room'));
  const slug    = params.get('hotel');
  const checkin  = params.get('checkin');
  const checkout = params.get('checkout');
  const guestsQ  = Number(params.get('guests') || 2);

  const [step, setStep] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [form, setForm] = useState({
    fullName: user?.full_name || '',
    email:    user?.email || '',
    phone:    user?.phone || '',
    note:     '',
    method:   'card',
    card: '', expiry: '', cvv: '', name: '',
  });
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const roomQ  = useQuery({ queryKey: ['room', roomId], queryFn: () => roomsAPI.detail(roomId).then((d) => d.room), enabled: !!roomId });
  const hotelQ = useQuery({ queryKey: ['hotel', slug],  queryFn: () => hotelsAPI.detail(slug).then((d) => d.hotel), enabled: !!slug });

  const createMut = useMutation({
    mutationFn: () => bookingsAPI.create({ room_id: roomId, checkin_date: checkin, checkout_date: checkout, guests: guestsQ }),
    onSuccess: (data) => { setBookingId(data.booking.id); setStep(2); },
  });

  if (user?.role === 'host') {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center', maxWidth: 720 }}>
        <h2 className="h-2">Hosts can't book stays.</h2>
        <p className="text-muted mt-3">Bookings are made from a customer account. Sign out and sign in (or sign up) as a traveller to continue.</p>
        <button className="btn btn-primary mt-6" onClick={() => { logout(); navigate('/login'); }}>Sign out</button>
      </div>
    );
  }

  if (!roomId || !checkin || !checkout) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center', maxWidth: 800 }}>
        <h2 className="h-2">Pick a stay first.</h2>
        <p className="text-muted mt-3">Choose a hotel and dates, then we can take it from here.</p>
        <button className="btn btn-primary mt-6" onClick={() => navigate('/hotels')}>Browse stays</button>
      </div>
    );
  }
  if (roomQ.isLoading || hotelQ.isLoading) return <div className="container" style={{ padding: 80, textAlign: 'center' }}>Loading…</div>;

  const room  = roomQ.data;
  const hotel = hotelQ.data;
  const nights = nightsBetween(checkin, checkout);
  const subtotal = (room?.price_per_night || 0) * nights;
  const taxes    = Math.round(subtotal * TAX);
  const total    = subtotal + taxes;

  const steps = [
    { id: 0, label: 'Guest details' },
    { id: 1, label: 'Payment' },
    { id: 2, label: 'Confirmation' },
  ];

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 1100 }}>
      <button onClick={() => navigate(`/hotel/${hotel.slug}`)} className="text-muted mb-4" style={{ fontSize: 13 }}>
        ← Back to {hotel.name}
      </button>
      <h1 className="h-1 mb-6">Reserve your stay.</h1>

      <div className="book-steps">
        {steps.map((s, i) => (
          <Fragment key={s.id}>
            <div className={`book-step ${step === s.id ? 'is-active' : ''} ${step > s.id ? 'is-done' : ''}`}>
              <span className="book-step-num">{step > s.id ? <Icon name="check" size={12} /> : s.id + 1}</span>
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && <span className="book-step-line" />}
          </Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 36, alignItems: 'start' }}>
        <main className="card-flat" style={{ padding: 36 }}>
          {step === 0 && (
            <div className="fade-up">
              <h2 className="h-3 mb-4">Who's staying?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="field"><label className="field-label">Full name</label>
                  <input className="input" value={form.fullName} onChange={(e) => upd('fullName', e.target.value)} /></div>
                <div className="field"><label className="field-label">Email</label>
                  <input className="input" type="email" value={form.email} onChange={(e) => upd('email', e.target.value)} /></div>
                <div className="field"><label className="field-label">Phone</label>
                  <input className="input" value={form.phone} onChange={(e) => upd('phone', e.target.value)} /></div>
                <div className="field"><label className="field-label">Arrival time</label>
                  <select className="select" defaultValue="evening">
                    <option value="afternoon">Afternoon (15:00–17:00)</option>
                    <option value="evening">Evening (17:00–20:00)</option>
                    <option value="late">Late (20:00+)</option>
                  </select></div>
              </div>
              <div className="field mt-4">
                <label className="field-label">Anything we should know?</label>
                <textarea className="input" rows={3} value={form.note} onChange={(e) => upd('note', e.target.value)}
                          placeholder="Dietary needs, anniversaries, arrival quirks..." />
              </div>

              <div className="row mt-8" style={{ justifyContent: 'space-between' }}>
                <button className="btn btn-ghost" onClick={() => navigate(`/hotel/${hotel.slug}`)}>Back</button>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(1)} disabled={!form.fullName || !form.email}>
                  Continue to payment <Icon name="arrow-right" size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="fade-up">
              <h2 className="h-3 mb-4">Payment method</h2>
              <div className="row mb-4" style={{ gap: 8 }}>
                {['card','upi','paylater'].map((m) => (
                  <button key={m} className={`chip ${form.method === m ? 'is-active' : ''}`} onClick={() => upd('method', m)}>
                    {m === 'card' ? 'Card' : m === 'upi' ? 'UPI' : 'Pay at hotel'}
                  </button>
                ))}
              </div>

              {form.method === 'card' && (
                <>
                  <div className="field"><label className="field-label">Card number</label>
                    <input className="input" placeholder="•••• •••• •••• ••••" value={form.card} onChange={(e) => upd('card', e.target.value)} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                    <div className="field"><label className="field-label">Expiry</label>
                      <input className="input" placeholder="MM / YY" value={form.expiry} onChange={(e) => upd('expiry', e.target.value)} /></div>
                    <div className="field"><label className="field-label">CVV</label>
                      <input className="input" placeholder="•••" value={form.cvv} onChange={(e) => upd('cvv', e.target.value)} /></div>
                  </div>
                  <div className="field mt-4"><label className="field-label">Name on card</label>
                    <input className="input" value={form.name} onChange={(e) => upd('name', e.target.value)} /></div>
                </>
              )}

              {form.method === 'upi' && (
                <div className="field"><label className="field-label">UPI ID</label>
                  <input className="input" placeholder="yourname@bank" /></div>
              )}

              {form.method === 'paylater' && (
                <div className="card-flat" style={{ padding: 20 }}>
                  <div className="row" style={{ gap: 12 }}>
                    <Icon name="sparkle" size={18} />
                    <div>
                      <div style={{ fontWeight: 500 }}>Pay when you arrive.</div>
                      <p className="text-muted mt-2" style={{ fontSize: 13 }}>Your card is held to secure the booking. The hotel will charge you at check-in.</p>
                    </div>
                  </div>
                </div>
              )}

              <hr className="divider mt-6" />
              <div className="row mt-4" style={{ gap: 12 }}>
                <Icon name="shield" size={18} />
                <span className="text-muted" style={{ fontSize: 13 }}>Encrypted in transit. Free cancellation until 48 hours before check-in.</span>
              </div>

              {createMut.isError && (
                <p style={{ color: 'var(--danger)', marginTop: 16, fontSize: 13 }}>
                  {createMut.error?.response?.data?.error || 'Booking failed. Please try again.'}
                </p>
              )}

              <div className="row mt-8" style={{ justifyContent: 'space-between' }}>
                <button className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
                <button className="btn btn-accent btn-lg" onClick={() => createMut.mutate()} disabled={createMut.isPending}>
                  {createMut.isPending ? 'Confirming…' : `Confirm reservation · ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-up" style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Icon name="check" size={32} />
              </div>
              <h2 className="h-1">You're booked.</h2>
              <p className="text-muted mt-3" style={{ maxWidth: 380, margin: '12px auto 0' }}>
                A confirmation is on its way to {form.email}. The team at {hotel.name} will be in touch the day before arrival.
              </p>
              <div className="card-flat mt-6" style={{ padding: 20, textAlign: 'left', maxWidth: 400, margin: '32px auto 0' }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="eyebrow">Reservation</div>
                    <div className="text-mono mt-2" style={{ fontSize: 16 }}>NSTRA-{String(bookingId).padStart(6, '0')}</div>
                  </div>
                  <Icon name="arrow-up-right" size={20} />
                </div>
              </div>
              <div className="row mt-8" style={{ justifyContent: 'center', gap: 12 }}>
                <button className="btn btn-ghost" onClick={() => navigate('/profile')}>View in profile</button>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Back to home</button>
              </div>
            </div>
          )}
        </main>

        <aside className="summary" style={{ position: 'sticky', top: 96 }}>
          <div style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
            <div style={{ width: 88, height: 88, borderRadius: 12, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              <Photo hue={hotel.hue} src={hotel.hero_image_url} />
            </div>
            <div>
              <div className="serif" style={{ fontSize: 18, lineHeight: 1.15 }}>{hotel.name}</div>
              <div className="text-muted mt-2" style={{ fontSize: 12 }}>{hotel.city}, {hotel.region}</div>
              {hotel.rating_avg > 0 && (
                <div className="row mt-2" style={{ gap: 4 }}>
                  <Icon name="star" size={11} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 12 }}>{Number(hotel.rating_avg).toFixed(1)} · {hotel.rating_count}</span>
                </div>
              )}
            </div>
          </div>

          <div className="summary-row"><span className="text-muted">Room</span><span className="text-mono">{room.type}</span></div>
          <div className="summary-row"><span className="text-muted">Check-in</span><span className="text-mono">{checkin}</span></div>
          <div className="summary-row"><span className="text-muted">Check-out</span><span className="text-mono">{checkout}</span></div>
          <div className="summary-row"><span className="text-muted">Nights</span><span className="text-mono">{nights}</span></div>
          <div className="summary-row"><span className="text-muted">Guests</span><span className="text-mono">{guestsQ}</span></div>

          <hr className="divider mt-3 mb-3" />
          <div className="summary-row"><span className="text-muted">Subtotal</span><span className="text-mono">₹{subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span className="text-muted">Taxes</span><span className="text-mono">₹{taxes.toLocaleString()}</span></div>
          <div className="summary-row total"><span>Total</span><span className="text-mono">₹{total.toLocaleString()}</span></div>
        </aside>
      </div>
    </div>
  );
}
