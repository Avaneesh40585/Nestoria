import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { hostAPI, profileAPI } from '../lib/api.js';
import { hostProfileSchema } from '../lib/schemas.js';
import { useAuth } from '../context/AuthContext.jsx';

function RevenueChart({ months }) {
  const data = (months || []).map((m) => m.revenue);
  if (data.length === 0) return <p className="text-muted">No revenue data yet.</p>;
  const max = Math.max(...data, 1);
  const W = 600, H = 200, pad = 8;
  const bw = (W - pad * (data.length + 1)) / data.length;
  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H + 30}`} width="100%" height="220" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1="0" x2={W} y1={H - H*t} y2={H - H*t} stroke="var(--line)" strokeDasharray="2 4" strokeWidth="1" />
        ))}
        {data.map((v, i) => {
          const x = pad + i * (bw + pad);
          const h = (v / max) * (H - 20);
          const y = H - h;
          const isLast = i === data.length - 1;
          return <rect key={i} x={x} y={y} width={bw} height={h} rx="3"
                       fill={isLast ? 'var(--accent)' : 'var(--ink)'} opacity={isLast ? 1 : 0.18} />;
        })}
        {(months || []).map((m, i) => (i % 3 === 0) && (
          <text key={'l'+i} x={pad + i*(bw+pad) + bw/2} y={H + 18} textAnchor="middle"
                fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-3)">{m.month.slice(5)}</text>
        ))}
      </svg>
    </div>
  );
}

function BookingsTable({ bookings }) {
  if (!bookings.length) return <p className="text-muted" style={{ padding: 20 }}>No bookings yet.</p>;
  return (
    <div className="bookings-table">
      <div className="bookings-row bookings-head">
        <div>Guest</div><div>Property · Room</div><div>Dates</div><div>Status</div><div style={{ textAlign: 'right' }}>Total</div>
      </div>
      {bookings.map((b) => (
        <div className="bookings-row" key={b.id}>
          <div className="row" style={{ gap: 10 }}>
            <span className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{(b.guest_name || '·')[0]}</span>
            <div>
              <div style={{ fontSize: 14 }}>{b.guest_name}</div>
              <div className="text-muted text-mono" style={{ fontSize: 11 }}>NSTRA-{String(b.id).padStart(6,'0')}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13 }}>{b.hotel_name}</div>
            <div className="text-muted" style={{ fontSize: 12 }}>{b.room_type} · {b.guests} guests</div>
          </div>
          <div className="text-mono" style={{ fontSize: 12 }}>
            <div>{new Date(b.checkin_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
            <div className="text-muted">→ {new Date(b.checkout_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
          </div>
          <div><span className={`status-pill ${b.status === 'pending' ? 'upcoming' : 'confirmed'}`}>{b.status}</span></div>
          <div style={{ textAlign: 'right' }} className="text-mono">₹{Number(b.total_amount).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default function HostScreen({ tab: initialTab }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const qc = useQueryClient();
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState(initialTab || params.get('tab') || 'overview');

  const propertiesQ = useQuery({ queryKey: ['host','properties'], queryFn: () => hostAPI.properties().then((d) => d.properties) });
  const statsQ      = useQuery({ queryKey: ['host','stats'],      queryFn: () => hostAPI.stats() });
  const bookingsQ   = useQuery({ queryKey: ['host','bookings'],   queryFn: () => hostAPI.bookings().then((d) => d.bookings) });
  const earningsQ   = useQuery({ queryKey: ['host','earnings'],   queryFn: () => hostAPI.earnings() });
  const profileQ    = useQuery({ queryKey: ['profile'],           queryFn: () => profileAPI.get().then((d) => d.user), enabled: tab === 'profile' });

  const stats = statsQ.data || { revenue: 0, revenue_delta: 0, bookings: 0, bookings_delta: 0, rating: 0, rating_delta: 0, occupancy: 0 };
  const properties = propertiesQ.data || [];
  const upcoming = (bookingsQ.data || []).filter((b) => b.status === 'confirmed' || b.status === 'pending').slice(0, 8);

  const KPI = [
    { label: 'Revenue (MTD)', value: `₹${(stats.revenue/100000).toFixed(2)}L`, delta: stats.revenue_delta, icon: 'sparkle' },
    { label: 'Bookings',      value: stats.bookings,                            delta: stats.bookings_delta, icon: 'calendar' },
    { label: 'Occupancy',     value: `${stats.occupancy}%`,                     delta: stats.occupancy_delta, icon: 'compass' },
    { label: 'Avg rating',    value: Number(stats.rating).toFixed(2),           delta: stats.rating_delta, icon: 'star' },
  ];

  return (
    <div className="container-wide" style={{ paddingTop: 36, paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 36 }}>
        <div>
          <div className="eyebrow mb-3">— Host workspace</div>
          <h1 className="h-1">Good morning, {user?.full_name?.split(' ')[0] || 'host'}.</h1>
          <p className="text-muted mt-3">Here's how your properties are doing this month.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm">
            <Icon name="calendar" size={14} /> {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/host/add-rooms')}>
            <Icon name="plus" size={14} /> Add property
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }} className="kpi-grid">
        {KPI.map((k) => (
          <div className="card-flat" key={k.label} style={{ padding: 22 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
              <span className="eyebrow">{k.label}</span>
              <span style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg-inset)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}>
                <Icon name={k.icon} size={14} />
              </span>
            </div>
            <div className="serif" style={{ fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em' }}>{k.value}</div>
            <div className="row mt-3" style={{ gap: 6 }}>
              <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: k.delta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {k.delta >= 0 ? '↑' : '↓'} {Math.abs(k.delta)}{k.label === 'Avg rating' ? '' : '%'}
              </span>
              <span className="text-muted" style={{ fontSize: 12 }}>vs. last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="tabs-bar">
        {[['overview','Overview'],['properties','Properties'],['bookings','Bookings'],['earnings','Earnings'],['profile','Profile']].map(([k,l]) => (
          <button key={k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          <div className="card-flat" style={{ padding: 28 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div className="eyebrow mb-2">— Revenue, by month</div>
                <div className="serif" style={{ fontSize: 28 }}>₹{(stats.revenue/100000).toFixed(2)}L <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>this month</span></div>
              </div>
            </div>
            <RevenueChart months={earningsQ.data?.monthly} />
          </div>

          <div className="card-flat" style={{ padding: 28 }}>
            <div className="eyebrow mb-2">— Occupancy by property</div>
            <div className="serif mb-4" style={{ fontSize: 28 }}>{stats.occupancy}% <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>average</span></div>
            <div className="stack" style={{ '--gap': '16px' }}>
              {properties.map((p) => (
                <div key={p.id}>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13 }}>{p.name}</span>
                    <span className="text-mono" style={{ fontSize: 13 }}>{p.occupancy}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-inset)', borderRadius: 999 }}>
                    <div style={{ width: `${p.occupancy}%`, height: '100%', background: 'var(--accent)', borderRadius: 999, transition: 'width .6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-flat" style={{ padding: 28, gridColumn: 'span 2' }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div className="eyebrow mb-2">— Upcoming arrivals</div>
                <div className="serif" style={{ fontSize: 22 }}>{upcoming.length} guests this month</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setTab('bookings')}>View all →</button>
            </div>
            <BookingsTable bookings={upcoming.slice(0, 4)} />
          </div>
        </div>
      )}

      {tab === 'properties' && (
        <div className="fade-up stack" style={{ '--gap': '20px' }}>
          {properties.map((p) => (
            <div key={p.id} className="card-flat" style={{ padding: 20, display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 20, alignItems: 'center' }}>
              <div style={{ aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                <Photo hue={p.hue} src={p.hero_image_url} />
              </div>
              <div>
                <div className="row" style={{ gap: 10 }}>
                  <span className="status-pill confirmed">active</span>
                  <span className="text-muted" style={{ fontSize: 12 }}>{p.rooms_count} rooms · {p.region}</span>
                </div>
                <div className="serif mt-2" style={{ fontSize: 24 }}>{p.name}</div>
                <div className="text-muted" style={{ fontSize: 13 }}>{p.city}, {p.region}</div>
                <div className="row mt-3" style={{ gap: 24 }}>
                  <div><div className="eyebrow">Occupancy</div><div className="text-mono" style={{ fontSize: 18, marginTop: 2 }}>{p.occupancy}%</div></div>
                  <div><div className="eyebrow">Revenue / mo</div><div className="text-mono" style={{ fontSize: 18, marginTop: 2 }}>₹{(Number(p.revenue_mtd)/1000).toFixed(0)}k</div></div>
                  <div><div className="eyebrow">Rating</div><div className="text-mono" style={{ fontSize: 18, marginTop: 2 }}>{Number(p.rating_avg).toFixed(1)}</div></div>
                </div>
              </div>
              <div className="stack" style={{ '--gap': '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/host/add-rooms?hotel=${p.id}`)}>
                  <Icon name="plus" size={12} /> Add rooms
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/hotel/${p.slug}`)}>
                  <Icon name="arrow-up-right" size={12} /> Preview
                </button>
              </div>
            </div>
          ))}
          <button className="card-flat" style={{ padding: 36, textAlign: 'center', border: '1px dashed var(--line-strong)', cursor: 'pointer' }}
                  onClick={() => navigate('/host/add-rooms')}>
            <Icon name="plus" size={20} />
            <div className="serif mt-3" style={{ fontSize: 20 }}>List a new property</div>
            <p className="text-muted mt-2" style={{ fontSize: 13 }}>Walk through onboarding in about 8 minutes.</p>
          </button>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="fade-up">
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
            <BookingsTable bookings={bookingsQ.data || []} />
          </div>
        </div>
      )}

      {tab === 'earnings' && (
        <div className="fade-up">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 24 }}>
            <div className="card-flat" style={{ padding: 28 }}>
              <div className="eyebrow mb-2">— Earnings, year to date</div>
              <div className="serif" style={{ fontSize: 40 }}>
                ₹{((earningsQ.data?.monthly || []).reduce((a, m) => a + Number(m.revenue), 0) / 100000).toFixed(2)}L
              </div>
              <p className="text-muted mt-2">Across {properties.length} properties</p>
            </div>
            <div className="card-flat" style={{ padding: 28 }}>
              <div className="eyebrow mb-2">— Next payout</div>
              <div className="serif" style={{ fontSize: 36 }}>
                ₹{((earningsQ.data?.monthly?.at(-1)?.revenue || 0) * 0.9 / 100000).toFixed(2)}L
              </div>
              <p className="text-muted mt-2" style={{ fontSize: 13 }}>Scheduled for end of month</p>
            </div>
          </div>
          <div className="card-flat" style={{ padding: 28 }}>
            <div className="eyebrow mb-3">— Recent transactions</div>
            <div className="stack" style={{ '--gap': '0px' }}>
              {(earningsQ.data?.transactions || []).map((t, i, arr) => (
                <div key={t.id} className="row" style={{ justifyContent: 'space-between', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 14 }}>NSTRA-{String(t.id).padStart(6, '0')}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{t.guest_name} · {t.hotel_name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-mono" style={{ fontSize: 14, color: 'var(--success)' }}>+ ₹{Number(t.total_amount).toLocaleString()}</div>
                    <div className="eyebrow mt-1">{t.status}</div>
                  </div>
                </div>
              ))}
              {(!earningsQ.data?.transactions || earningsQ.data.transactions.length === 0) && (
                <p className="text-muted">No transactions yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'profile' && <HostProfileTab profile={profileQ.data} onSaved={(u) => { setUser({ ...user, ...u }); qc.invalidateQueries({ queryKey: ['profile'] }); }} />}
    </div>
  );
}

function HostProfileTab({ profile, onSaved }) {
  const updateMut = useMutation({
    mutationFn: (data) => profileAPI.update(data),
    onSuccess: (d) => onSaved(d.user),
  });
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(hostProfileSchema),
    defaultValues: {
      full_name:      profile?.full_name || '',
      phone:          profile?.phone || '',
      business_name:  profile?.business_name || '',
      gst_number:     profile?.gst_number || '',
      payout_account: profile?.payout_account || '',
    },
  });
  if (!profile) return <p className="text-muted">Loading…</p>;
  return (
    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 36, alignItems: 'start' }}>
      <form className="card-flat" style={{ padding: 32 }} onSubmit={handleSubmit((d) => updateMut.mutate(d))}>
        <h2 className="h-3 mb-4">Business details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="field"><label className="field-label">Legal name</label>
            <input className="input" {...register('full_name')} />
            {errors.full_name && <small style={{ color: 'var(--danger)' }}>{errors.full_name.message}</small>}
          </div>
          <div className="field"><label className="field-label">Business name</label>
            <input className="input" {...register('business_name')} /></div>
          <div className="field"><label className="field-label">Email</label>
            <input className="input" defaultValue={profile.email} disabled /></div>
          <div className="field"><label className="field-label">Phone</label>
            <input className="input" {...register('phone')} /></div>
          <div className="field"><label className="field-label">GST number</label>
            <input className="input" {...register('gst_number')} /></div>
          <div className="field"><label className="field-label">Payout account</label>
            <input className="input" {...register('payout_account')} placeholder="Bank account / UPI" /></div>
        </div>
        {updateMut.isSuccess && <p className="text-muted mt-4" style={{ fontSize: 12 }}>Saved.</p>}
        <div className="row mt-8" style={{ justifyContent: 'flex-end', gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={updateMut.isPending}>
            {updateMut.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>

      <aside className="stack" style={{ '--gap': '16px' }}>
        <div className="card-flat" style={{ padding: 24 }}>
          <div className="eyebrow mb-2">— Host status</div>
          <div className="serif" style={{ fontSize: 24 }}>{profile.kyc_verified ? 'Verified host' : 'Pending verification'}</div>
          <p className="text-muted mt-2" style={{ fontSize: 13 }}>Member since {new Date(profile.created_at).toLocaleString('en-IN', { month: 'long', year: 'numeric' })}.</p>
        </div>
        {profile.superhost && (
          <div className="card-flat" style={{ padding: 24, background: 'var(--bg-inset)' }}>
            <div className="eyebrow mb-2">— Concierge tier</div>
            <div className="serif" style={{ fontSize: 22 }}>Superhost</div>
            <p className="text-muted mt-2" style={{ fontSize: 12 }}>Maintain 4.8+ rating and 95% response rate to stay qualified.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
