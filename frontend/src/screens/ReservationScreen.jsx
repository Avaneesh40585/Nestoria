import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Icon from '../components/Icon.jsx';
import Photo from '../components/Photo.jsx';
import { bookingsAPI } from '../lib/api.js';

function statusKey(s) {
  if (s === 'confirmed') return 'upcoming';
  if (s === 'pending')   return 'confirmed';
  return s;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ReservationScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const bookingQ = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsAPI.detail(id).then((d) => d.booking),
    enabled: !!id,
  });

  const cancelMut = useMutation({
    mutationFn: () => bookingsAPI.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['booking', id] });
      qc.invalidateQueries({ queryKey: ['bookings/my'] });
    },
  });

  if (bookingQ.isLoading) {
    return <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}><p className="text-muted">Loading…</p></div>;
  }
  if (!bookingQ.data) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center', maxWidth: 600 }}>
        <h2 className="h-2">Reservation not found</h2>
        <p className="text-muted mt-3">We couldn't find that booking — it may have been removed or you may not have access.</p>
        <button className="btn btn-primary mt-6" onClick={() => navigate('/profile')}>Back to profile</button>
      </div>
    );
  }

  const b = bookingQ.data;
  const k = statusKey(b.status);
  const nights = Math.max(1, Math.round((new Date(b.checkout_date) - new Date(b.checkin_date)) / 86400000));
  const isCancellable = b.status === 'confirmed' || b.status === 'pending';
  const isCompleted   = b.status === 'completed';
  const ref = `NSTRA-${String(b.id).padStart(6, '0')}`;

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 1100 }}>
      <button onClick={() => navigate('/profile')} className="text-muted mb-4" style={{ fontSize: 13 }}>
        ← All reservations
      </button>

      <div className="row" style={{ gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <span className={`status-pill ${k}`}>{b.status}</span>
        <span className="text-mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{ref}</span>
        <span className="text-mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          Booked {new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <h1 className="h-1 mb-6">{b.hotel_name}</h1>

      <div className="receipt-shell">
        <main className="card-flat" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 'clamp(120px, 30vw, 160px)', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              <Photo hue={b.hotel_hue} src={b.hotel_hero} alt={b.hotel_name} />
            </div>
            <div>
              <div className="eyebrow mb-2">— {b.hotel_region}</div>
              <div className="serif" style={{ fontSize: 22, lineHeight: 1.15 }}>{b.room_type}</div>
              <div className="text-muted mt-2" style={{ fontSize: 13 }}>{b.hotel_city}, {b.hotel_region}</div>
              {b.hotel_address && <div className="text-muted mt-1" style={{ fontSize: 12 }}>{b.hotel_address}</div>}
            </div>
          </div>

          <div className="facts-grid-2">
            <div>
              <div className="eyebrow mb-2">Check-in</div>
              <div className="serif" style={{ fontSize: 18 }}>{fmtDate(b.checkin_date)}</div>
            </div>
            <div>
              <div className="eyebrow mb-2">Check-out</div>
              <div className="serif" style={{ fontSize: 18 }}>{fmtDate(b.checkout_date)}</div>
            </div>
            <div>
              <div className="eyebrow mb-2">Nights</div>
              <div className="serif" style={{ fontSize: 18 }}>{nights}</div>
            </div>
            <div>
              <div className="eyebrow mb-2">Guests</div>
              <div className="serif" style={{ fontSize: 18 }}>{b.guests}</div>
            </div>
          </div>

          {b.hotel_phone && (
            <div className="mt-6">
              <div className="eyebrow mb-2">Property contact</div>
              <a href={`tel:${b.hotel_phone}`} className="row" style={{ gap: 8, fontSize: 14, color: 'var(--ink)' }}>
                <Icon name="phone" size={14} /> {b.hotel_phone}
              </a>
            </div>
          )}

          {cancelMut.isError && (
            <p style={{ color: 'var(--danger)', marginTop: 16, fontSize: 13 }}>
              {cancelMut.error?.response?.data?.error || 'Could not cancel. Please try again.'}
            </p>
          )}

          <div className="row mt-8" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={() => navigate(`/hotel/${b.hotel_slug}`)}>
              Open hotel page <Icon name="arrow-up-right" size={14} />
            </button>
            {isCancellable && (
              <button
                className="btn btn-ghost"
                style={{ color: 'var(--danger)', borderColor: 'color-mix(in oklab, var(--danger) 30%, var(--line))' }}
                disabled={cancelMut.isPending}
                onClick={() => { if (confirm('Cancel this reservation? Free cancellation applies until 48 hours before check-in.')) cancelMut.mutate(); }}
              >
                {cancelMut.isPending ? 'Cancelling…' : 'Cancel reservation'}
              </button>
            )}
            {isCompleted && !b.has_review && (
              <button className="btn btn-primary" onClick={() => navigate(`/review/${b.id}`)}>
                Write a review <Icon name="arrow-right" size={14} />
              </button>
            )}
          </div>
        </main>

        <aside className="card-flat receipt-card" style={{ padding: 'var(--space-5)' }}>
          <div className="eyebrow mb-3">— Receipt</div>
          <div className="summary-row"><span className="text-muted">Subtotal</span><span className="text-mono">₹{Number(b.base_amount).toLocaleString()}</span></div>
          <div className="summary-row"><span className="text-muted">Taxes</span><span className="text-mono">₹{Number(b.tax_amount).toLocaleString()}</span></div>
          <hr className="divider mt-3 mb-3" />
          <div className="summary-row total"><span>Total</span><span className="text-mono">₹{Number(b.total_amount).toLocaleString()}</span></div>
          <div className="mt-6">
            <div className="eyebrow mb-2">Payment</div>
            <div className="text-muted" style={{ fontSize: 13 }}>
              {b.payment_status === 'paid' ? 'Paid in full' : b.payment_status === 'refunded' ? 'Refunded' : 'Pay at hotel'}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
