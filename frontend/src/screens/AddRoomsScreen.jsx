import { Fragment, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { hotelsAPI, roomsAPI, hostAPI, uploadAPI } from '../lib/api.js';
import { hotelBasicsSchema, hotelAddressSchema, roomSchema } from '../lib/schemas.js';

const AMENITIES = [
  { key: 'wifi',      label: 'Fibre Wi-Fi',      icon: 'wifi' },
  { key: 'pool',      label: 'Salt-water pool',  icon: 'pool' },
  { key: 'spa',       label: 'Spa & wellness',   icon: 'spa' },
  { key: 'utensils',  label: 'Restaurant & bar', icon: 'utensils' },
  { key: 'ac',        label: 'Air conditioning', icon: 'ac' },
  { key: 'car',       label: 'Airport transfer', icon: 'car' },
  { key: 'concierge', label: '24/7 concierge',   icon: 'concierge' },
  { key: 'coffee',    label: 'All-day coffee',   icon: 'coffee' },
  { key: 'tv',        label: 'Smart TV',         icon: 'tv' },
  { key: 'gym',       label: 'Gym',              icon: 'dumbbell' },
];

const HUES = ['sand','ocean','forest','dusk','warm','cool'];

export default function AddRoomsScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const qc = useQueryClient();
  const editingHotelId = Number(params.get('hotel')) || null;

  const propertiesQ = useQuery({ queryKey: ['host','properties'], queryFn: () => hostAPI.properties().then((d) => d.properties), enabled: !!editingHotelId });
  const hotelForEdit = propertiesQ.data?.find((p) => p.id === editingHotelId);

  const [step, setStep] = useState(editingHotelId ? 2 : 0);
  const [createdHotel, setCreatedHotel] = useState(editingHotelId ? { id: editingHotelId, slug: hotelForEdit?.slug } : null);
  const [basics, setBasics] = useState(null);
  const [address, setAddress] = useState(null);

  const basicsForm = useForm({
    resolver: zodResolver(hotelBasicsSchema),
    defaultValues: { name: '', slug: '', region: '', city: '', description: '', hue: 'sand' },
  });
  const addressForm = useForm({
    resolver: zodResolver(hotelAddressSchema),
    defaultValues: { address: '', phone: '', checkin_time: '15:00', checkout_time: '11:00', amenities: ['wifi','spa','utensils','ac'] },
  });

  const createHotelMut = useMutation({
    mutationFn: (body) => hotelsAPI.create(body),
    onSuccess: (d) => { setCreatedHotel(d.hotel); qc.invalidateQueries({ queryKey: ['host','properties'] }); setStep(2); },
  });

  // ----- Room editor state -----
  const [rooms, setRooms] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);
  const [uploadingFor, setUploadingFor] = useState(null);

  const roomForm = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: { type: 'Heritage Suite', view: '', beds: 'King bed', size_sqm: 32, price_per_night: 10000, hue: 'sand' },
  });

  const createRoomMut = useMutation({
    mutationFn: (body) => roomsAPI.create(body),
    onSuccess: (d) => {
      setRooms((rs) => [...rs, d.room]);
      setEditingIdx(null);
      roomForm.reset();
      qc.invalidateQueries({ queryKey: ['host','properties'] });
    },
  });
  const removeRoomMut = useMutation({
    mutationFn: (id) => roomsAPI.remove(id),
    onSuccess: (_, id) => setRooms((rs) => rs.filter((r) => r.id !== id)),
  });

  const uploadHotelImage = async (file) => {
    setUploadingFor('hotel');
    try {
      const { url } = await uploadAPI.hotelImage(file);
      await hotelsAPI.update(createdHotel.id, { hero_image_url: url });
      qc.invalidateQueries({ queryKey: ['host','properties'] });
    } finally { setUploadingFor(null); }
  };

  const submitBasics = (data) => { setBasics(data); setStep(1); };

  const submitAddress = (data) => {
    setAddress(data);
    createHotelMut.mutate({ ...basics, ...data });
  };

  const submitRoom = (data) => {
    createRoomMut.mutate({ hotel_id: createdHotel.id, ...data });
  };

  const steps = [
    { id: 0, label: 'Basics' },
    { id: 1, label: 'Address & amenities' },
    { id: 2, label: 'Rooms' },
  ];

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 980 }}>
      <button onClick={() => navigate('/host/dashboard')} className="text-muted mb-4" style={{ fontSize: 13 }}>← Back to dashboard</button>
      <div className="eyebrow mb-3">— {editingHotelId ? `Manage · ${hotelForEdit?.name || 'property'}` : 'List a new property'}</div>
      <h1 className="h-1 mb-6">{editingHotelId ? 'Add rooms.' : "Let's get your property listed."}</h1>

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

      <div className="card-flat" style={{ padding: 36 }}>
        {step === 0 && (
          <form className="fade-up" onSubmit={basicsForm.handleSubmit(submitBasics)}>
            <h2 className="h-3 mb-4">Tell us about your property</h2>
            <div className="field mb-3">
              <label className="field-label">Property name</label>
              <input className="input" placeholder="The Marigold House" {...basicsForm.register('name')} />
              {basicsForm.formState.errors.name && <small style={{ color: 'var(--danger)' }}>{basicsForm.formState.errors.name.message}</small>}
            </div>
            <div className="field mb-3">
              <label className="field-label">URL slug</label>
              <input className="input" placeholder="marigold-house" {...basicsForm.register('slug')} />
              {basicsForm.formState.errors.slug && <small style={{ color: 'var(--danger)' }}>{basicsForm.formState.errors.slug.message}</small>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field"><label className="field-label">Region (state)</label>
                <input className="input" placeholder="Rajasthan" {...basicsForm.register('region')} /></div>
              <div className="field"><label className="field-label">City</label>
                <input className="input" placeholder="Udaipur" {...basicsForm.register('city')} /></div>
            </div>
            <div className="field mt-3 mb-3">
              <label className="field-label">A short description</label>
              <textarea className="input" rows={4} placeholder="Tell guests what makes the place special..." {...basicsForm.register('description')} />
              {basicsForm.formState.errors.description && <small style={{ color: 'var(--danger)' }}>{basicsForm.formState.errors.description.message}</small>}
            </div>
            <div className="field mb-4">
              <label className="field-label">Mood / colour</label>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                {HUES.map((h) => (
                  <label key={h} className="chip" style={{ cursor: 'pointer' }}>
                    <input type="radio" value={h} {...basicsForm.register('hue')} style={{ display: 'none' }} />
                    <span style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', background: 'var(--accent)' }} className={`photo-bg`} data-hue={h} />
                    {h}
                  </label>
                ))}
              </div>
            </div>
            <div className="row mt-8" style={{ justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-lg">Continue <Icon name="arrow-right" size={14} /></button>
            </div>
          </form>
        )}

        {step === 1 && (
          <form className="fade-up" onSubmit={addressForm.handleSubmit(submitAddress)}>
            <h2 className="h-3 mb-4">Address & amenities</h2>
            <div className="field mb-3">
              <label className="field-label">Address</label>
              <textarea className="input" rows={2} placeholder="Street, city, state, postcode" {...addressForm.register('address')} />
              {addressForm.formState.errors.address && <small style={{ color: 'var(--danger)' }}>{addressForm.formState.errors.address.message}</small>}
            </div>
            <div className="field mb-6">
              <label className="field-label">Reception phone</label>
              <input className="input" placeholder="+91 ..." {...addressForm.register('phone')} />
            </div>

            <div className="eyebrow mb-3">— Amenities</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
              {AMENITIES.map((a) => {
                const watched = addressForm.watch('amenities') || [];
                const on = watched.includes(a.key);
                return (
                  <button key={a.key} type="button"
                          onClick={() => addressForm.setValue('amenities', on ? watched.filter((x) => x !== a.key) : [...watched, a.key])}
                          style={{
                            padding: '14px',
                            border: `1px solid ${on ? 'var(--accent)' : 'var(--line)'}`,
                            background: on ? 'var(--accent-soft)' : 'var(--bg-elev)',
                            color: on ? 'var(--accent)' : 'var(--ink)',
                            borderRadius: 12,
                            display: 'flex', alignItems: 'center', gap: 10,
                            cursor: 'pointer', fontSize: 13, textAlign: 'left',
                            transition: 'all .15s ease',
                          }}>
                    <Icon name={a.icon} size={16} />
                    {a.label}
                  </button>
                );
              })}
            </div>

            {createHotelMut.isError && (
              <p style={{ color: 'var(--danger)', fontSize: 13 }}>{createHotelMut.error?.response?.data?.error || 'Failed to create hotel'}</p>
            )}

            <div className="row mt-8" style={{ justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={createHotelMut.isPending}>
                {createHotelMut.isPending ? 'Creating…' : 'Continue'} <Icon name="arrow-right" size={14} />
              </button>
            </div>
          </form>
        )}

        {step === 2 && createdHotel && (
          <div className="fade-up">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <h2 className="h-3">Rooms ({rooms.length})</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setEditingIdx('new')}>
                <Icon name="plus" size={12} /> Add room
              </button>
            </div>

            {/* Hero upload */}
            <div className="card-flat mb-6" style={{ padding: 16, background: 'var(--bg-inset)' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>
                  <div className="eyebrow mb-2">— Hero image</div>
                  <span className="text-muted" style={{ fontSize: 13 }}>JPG/PNG/WebP up to 5MB</span>
                </div>
                <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                  {uploadingFor === 'hotel' ? 'Uploading…' : 'Upload'}
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                         onChange={(e) => e.target.files?.[0] && uploadHotelImage(e.target.files[0])} />
                </label>
              </div>
            </div>

            <div className="stack" style={{ '--gap': '12px' }}>
              {rooms.map((r) => (
                <div key={r.id} className="card-flat" style={{ padding: 16, background: 'var(--bg-inset)' }}>
                  <div className="row" style={{ gap: 16 }}>
                    <div style={{ width: 80, height: 60, borderRadius: 8, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <Photo hue={r.hue} src={r.image_url} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="serif" style={{ fontSize: 18 }}>{r.type}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        {[r.view, r.beds, r.size_sqm && `${r.size_sqm} sqm`].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="text-mono" style={{ fontSize: 18 }}>₹{Number(r.price_per_night).toLocaleString()}</div>
                      <div className="eyebrow mt-1">/ night</div>
                    </div>
                    <button className="stepper-btn" onClick={() => removeRoomMut.mutate(r.id)} aria-label="Remove room">
                      <Icon name="x" size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {editingIdx === 'new' && (
                <form className="card-flat" style={{ padding: 16, background: 'var(--bg-inset)' }}
                      onSubmit={roomForm.handleSubmit(submitRoom)}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="field"><label className="field-label">Type</label>
                      <input className="input" {...roomForm.register('type')} />
                      {roomForm.formState.errors.type && <small style={{ color: 'var(--danger)' }}>{roomForm.formState.errors.type.message}</small>}
                    </div>
                    <div className="field"><label className="field-label">₹ / night</label>
                      <input className="input" type="number" {...roomForm.register('price_per_night')} />
                      {roomForm.formState.errors.price_per_night && <small style={{ color: 'var(--danger)' }}>{roomForm.formState.errors.price_per_night.message}</small>}
                    </div>
                    <div className="field"><label className="field-label">Size (sqm)</label>
                      <input className="input" type="number" {...roomForm.register('size_sqm')} /></div>
                    <div className="field"><label className="field-label">View</label>
                      <input className="input" {...roomForm.register('view')} /></div>
                    <div className="field"><label className="field-label">Bed</label>
                      <input className="input" {...roomForm.register('beds')} /></div>
                    <div className="field"><label className="field-label">Mood</label>
                      <select className="select" {...roomForm.register('hue')}>
                        {HUES.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select></div>
                  </div>
                  {createRoomMut.isError && (
                    <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12 }}>{createRoomMut.error?.response?.data?.error || 'Failed'}</p>
                  )}
                  <div className="row mt-4" style={{ justifyContent: 'flex-end', gap: 8 }}>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditingIdx(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={createRoomMut.isPending}>
                      <Icon name="check" size={12} /> {createRoomMut.isPending ? 'Saving…' : 'Save room'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="row mt-8" style={{ justifyContent: 'space-between' }}>
              <button className="btn btn-ghost" onClick={() => editingHotelId ? navigate('/host/dashboard') : setStep(1)}>
                {editingHotelId ? 'Cancel' : 'Back'}
              </button>
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/host/dashboard')}>
                <Icon name="check" size={14} /> {editingHotelId ? 'Done' : 'Publish property'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
