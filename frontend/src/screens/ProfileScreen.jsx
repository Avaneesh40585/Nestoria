import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Icon from '../components/Icon.jsx';
import Photo from '../components/Photo.jsx';
import { profileAPI, bookingsAPI } from '../lib/api.js';
import { profileSchema } from '../lib/schemas.js';
import { useAuth } from '../context/AuthContext.jsx';

function statusKey(s) {
  if (s === 'completed') return 'completed';
  if (s === 'confirmed') return 'upcoming';
  if (s === 'pending')   return 'confirmed';
  return s;
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, logout, setUser } = useAuth();
  const [tab, setTab] = useState('upcoming');

  const profileQ  = useQuery({ queryKey: ['profile'],   queryFn: () => profileAPI.get().then((d) => d.user) });
  const bookingsQ = useQuery({ queryKey: ['bookings/my'], queryFn: () => bookingsAPI.my().then((d) => d.bookings) });

  const cancelMut = useMutation({
    mutationFn: (id) => bookingsAPI.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings/my'] }),
  });

  const updateMut = useMutation({
    mutationFn: (data) => profileAPI.update(data),
    onSuccess: (d) => { setUser({ ...user, ...d.user }); qc.invalidateQueries({ queryKey: ['profile'] }); },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: user?.full_name, phone: user?.phone || '', dob: '', gender: '' },
  });

  const me = profileQ.data || user || { full_name: '—', email: '—' };
  const bookings = bookingsQ.data || [];
  const filtered = bookings.filter((b) => {
    const k = statusKey(b.status);
    if (tab === 'upcoming') return k === 'upcoming' || k === 'confirmed';
    if (tab === 'past')     return k === 'completed';
    return true;
  });

  return (
    <div className="container-wide" style={{ paddingTop: 36, paddingBottom: 80 }}>
      <div className="profile-hero">
        <div className="profile-avatar">{(me.full_name || '·').charAt(0)}</div>
        <div>
          <div className="eyebrow mb-2">— Member since {new Date(me.created_at || Date.now()).getFullYear()}</div>
          <h1 className="h-2">{me.full_name}</h1>
          <div className="row mt-3" style={{ gap: 16, flexWrap: 'wrap' }}>
            <span className="row" style={{ gap: 6, fontSize: 13 }}><Icon name="mail" size={13} /> {me.email}</span>
            {me.phone && <span className="row" style={{ gap: 6, fontSize: 13 }}><Icon name="phone" size={13} /> {me.phone}</span>}
          </div>
        </div>
        <div className="profile-stats">
          <div><div className="serif" style={{ fontSize: 32 }}>{bookings.length}</div><div className="eyebrow mt-2">Stays</div></div>
          <div><div className="serif" style={{ fontSize: 32 }}>{bookings.filter((b) => b.status === 'completed').length}</div><div className="eyebrow mt-2">Completed</div></div>
          <div><div className="serif" style={{ fontSize: 32 }}>{bookings.filter((b) => b.status === 'confirmed').length}</div><div className="eyebrow mt-2">Upcoming</div></div>
        </div>
      </div>

      <div className="tabs-bar">
        {[['upcoming','Upcoming'],['past','Past stays'],['profile','Account']].map(([k,l]) => (
          <button key={k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab !== 'profile' && (
        <div className="stack" style={{ '--gap': '14px' }}>
          {bookingsQ.isLoading ? <p className="text-muted">Loading…</p>
          : filtered.length === 0 ? (
            <div className="card-flat" style={{ padding: 48, textAlign: 'center' }}>
              <Icon name="compass" size={32} />
              <div className="serif mt-3" style={{ fontSize: 24 }}>No {tab} stays.</div>
              <p className="text-muted mt-2">Time to plan another trip?</p>
              <button className="btn btn-primary mt-4" onClick={() => navigate('/hotels')}>Browse stays</button>
            </div>
          ) : filtered.map((b) => (
            <div className="booking-row fade-up" key={b.id}>
              <div className="photo"><Photo hue={b.hotel_hue} src={b.room_image} /></div>
              <div>
                <span className={`status-pill ${statusKey(b.status)}`}>{b.status}</span>
                <div className="serif mt-2" style={{ fontSize: 22 }}>{b.hotel_name}</div>
                <div className="text-muted mt-1" style={{ fontSize: 13 }}>{b.hotel_city}, {b.hotel_region} · {b.room_type}</div>
                <div className="row mt-3" style={{ gap: 16, flexWrap: 'wrap' }}>
                  <span className="text-mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                    {new Date(b.checkin_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    {' → '}
                    {new Date(b.checkout_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{b.guests} guests</span>
                  <span className="text-mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>NSTRA-{String(b.id).padStart(6,'0')}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-mono" style={{ fontSize: 18, fontWeight: 500 }}>₹{Number(b.total_amount).toLocaleString()}</div>
                <div className="eyebrow mt-1">total</div>
              </div>
              <div className="stack" style={{ '--gap': '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/hotel/${b.hotel_slug}`)}>View</button>
                {statusKey(b.status) === 'completed'
                  ? <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/hotel/${b.hotel_slug}`)}>Rebook</button>
                  : (
                    <button className="btn btn-ghost btn-sm" disabled={cancelMut.isPending}
                            onClick={() => { if (confirm('Cancel this booking?')) cancelMut.mutate(b.id); }}>
                      {cancelMut.isPending ? '…' : 'Cancel'}
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 36, alignItems: 'start' }}>
          <form className="card-flat" style={{ padding: 32 }} onSubmit={handleSubmit((d) => updateMut.mutate(d))}>
            <h2 className="h-3 mb-4">Personal details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field">
                <label className="field-label">Full name</label>
                <input className="input" {...register('full_name')} />
                {errors.full_name && <small style={{ color: 'var(--danger)' }}>{errors.full_name.message}</small>}
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="input" defaultValue={me.email} disabled />
              </div>
              <div className="field">
                <label className="field-label">Phone</label>
                <input className="input" {...register('phone')} />
              </div>
              <div className="field">
                <label className="field-label">Date of birth</label>
                <input className="input" type="date" {...register('dob')} />
              </div>
              <div className="field">
                <label className="field-label">Gender</label>
                <select className="select" {...register('gender')}>
                  <option value="">—</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="nonbinary">Non-binary</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
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
              <div className="eyebrow mb-2">— Account</div>
              <button onClick={() => { logout(); navigate('/'); }} className="row" style={{ width: '100%', justifyContent: 'space-between', padding: '12px 0', color: 'var(--danger)' }}>
                <span style={{ fontSize: 14 }}>Sign out</span>
                <Icon name="logout" size={14} />
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
