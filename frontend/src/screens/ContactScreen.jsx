import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Icon from '../components/Icon.jsx';

const schema = z.object({
  name:    z.string().min(2, 'Tell us your name'),
  email:   z.string().email('Enter a valid email'),
  subject: z.string().min(2, 'Pick a subject'),
  message: z.string().min(10, 'A line or two helps us reply faster'),
});

export default function ContactScreen() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = () => {
    // Demo: no backend send. Just acknowledge.
    setSent(true);
    setTimeout(() => { setSent(false); reset(); }, 4000);
  };

  return (
    <div className="container-wide" style={{ paddingTop: 36, paddingBottom: 80 }}>
      <div className="mb-8">
        <div className="eyebrow mb-3">— Contact</div>
        <h1 className="h-1" style={{ maxWidth: 720 }}>Say hello.</h1>
        <p className="section-sub mt-3" style={{ maxWidth: 540, fontSize: 16 }}>
          Questions about a booking, a property, or partnering with us — we usually reply within a day.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 48 }} className="list-shell">
        {/* Info column */}
        <aside className="stack" style={{ '--gap': '16px', alignSelf: 'start' }}>
          <div className="card-flat" style={{ padding: 24 }}>
            <div className="eyebrow mb-2">— Email</div>
            <a href="mailto:hello@nestoria.example" className="serif" style={{ fontSize: 22, borderBottom: '1px solid var(--line-strong)' }}>
              hello@nestoria.example
            </a>
            <p className="text-muted mt-3" style={{ fontSize: 13 }}>For bookings, support and general enquiries. Replied to within 24 hours.</p>
          </div>

          <div className="card-flat" style={{ padding: 24 }}>
            <div className="eyebrow mb-2">— Hosting</div>
            <a href="mailto:hosts@nestoria.example" className="serif" style={{ fontSize: 22, borderBottom: '1px solid var(--line-strong)' }}>
              hosts@nestoria.example
            </a>
            <p className="text-muted mt-3" style={{ fontSize: 13 }}>To list your property or talk to host relations.</p>
          </div>

          <div className="card-flat" style={{ padding: 24 }}>
            <div className="eyebrow mb-2">— Phone</div>
            <div className="serif" style={{ fontSize: 22 }}>+91 80 4567 8910</div>
            <p className="text-muted mt-3" style={{ fontSize: 13 }}>Weekdays, 10am – 7pm IST.</p>
          </div>

          <div className="card-flat" style={{ padding: 24, background: 'var(--bg-inset)' }}>
            <div className="eyebrow mb-2">— Office</div>
            <div className="serif" style={{ fontSize: 18, lineHeight: 1.35 }}>
              Nestoria Inc.<br/>
              Bangalore · Karnataka<br/>
              India 560001
            </div>
          </div>
        </aside>

        {/* Form column */}
        <form className="card-flat" style={{ padding: 36 }} onSubmit={handleSubmit(onSubmit)}>
          <h2 className="h-3 mb-6">Drop us a line</h2>

          {sent ? (
            <div className="fade-up" style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon name="check" size={28} />
              </div>
              <div className="serif" style={{ fontSize: 26 }}>Thanks — we'll reply within a day.</div>
              <p className="text-muted mt-3">Keep an eye on your inbox.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="field">
                  <label className="field-label">Name</label>
                  <input className="input" placeholder="Your name" {...register('name')} />
                  {errors.name && <small style={{ color: 'var(--danger)' }}>{errors.name.message}</small>}
                </div>
                <div className="field">
                  <label className="field-label">Email</label>
                  <input className="input" type="email" placeholder="you@example.com" {...register('email')} />
                  {errors.email && <small style={{ color: 'var(--danger)' }}>{errors.email.message}</small>}
                </div>
              </div>
              <div className="field mt-3">
                <label className="field-label">Subject</label>
                <select className="select" {...register('subject')}>
                  <option value="">Choose…</option>
                  <option value="booking">Booking enquiry</option>
                  <option value="property">A property question</option>
                  <option value="hosting">I want to list a property</option>
                  <option value="press">Press / partnership</option>
                  <option value="other">Something else</option>
                </select>
                {errors.subject && <small style={{ color: 'var(--danger)' }}>{errors.subject.message}</small>}
              </div>
              <div className="field mt-3">
                <label className="field-label">Message</label>
                <textarea className="input" rows={6} placeholder="A line or two about what you're after." {...register('message')} />
                {errors.message && <small style={{ color: 'var(--danger)' }}>{errors.message.message}</small>}
              </div>
              <div className="row mt-6" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-muted" style={{ fontSize: 12 }}>We never share your details.</span>
                <button type="submit" className="btn btn-accent">
                  Send message <Icon name="arrow-right" size={14} />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
