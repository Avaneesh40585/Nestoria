import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { GoogleLogin } from '@react-oauth/google';

import Icon from '../components/Icon.jsx';
import Photo from '../components/Photo.jsx';
import { authAPI } from '../lib/api.js';
import { loginSchema, signupSchema } from '../lib/schemas.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login: setSession } = useAuth();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState(params.get('role') === 'host' ? 'host' : 'customer');
  const [err,  setErr]  = useState(null);

  const schema = mode === 'login' ? loginSchema : signupSchema;
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSuccess = (data) => {
    setSession(data.token, { ...data.user, role });
    const next = params.get('next');
    navigate(next || (role === 'host' ? '/host/dashboard' : '/'), { replace: true });
  };

  const loginMut  = useMutation({ mutationFn: (body) => authAPI.login(body),    onSuccess, onError: (e) => setErr(e.response?.data?.error || 'Login failed') });
  const signupMut = useMutation({ mutationFn: (body) => authAPI.register(body), onSuccess, onError: (e) => setErr(e.response?.data?.error || 'Signup failed') });
  const googleMut = useMutation({ mutationFn: (body) => authAPI.google(body),   onSuccess, onError: (e) => setErr(e.response?.data?.error || 'Google sign-in failed') });

  const onSubmit = (values) => {
    setErr(null);
    if (mode === 'login') loginMut.mutate({ role, ...values });
    else signupMut.mutate({ role, ...values });
  };

  const pending = loginMut.isPending || signupMut.isPending || googleMut.isPending;

  return (
    <div className="auth">
      <div className="auth-side">
        <Photo hue="dusk" />
        <div className="auth-quote">
          <span className="eyebrow" style={{ color: 'white', opacity: 0.85 }}>— From the journal</span>
          <h2 className="h-2 mt-4" style={{ color: 'white' }}>"The best stays don't sell you anything. They just hand you a key and disappear."</h2>
          <span className="mono">— Riya B., on The Marigold House</span>
        </div>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="eyebrow mb-3">— {mode === 'login' ? 'Welcome back' : 'Create your account'}</div>
          <h1 className="h-2 mb-6">{mode === 'login' ? 'Sign in to Nestoria.' : 'Two minutes, then you can plan.'}</h1>

          <div className="auth-tabs">
            <button type="button" className={`auth-tab ${mode==='login' ? 'is-active' : ''}`}  onClick={() => { setMode('login');  setErr(null); }}>Sign in</button>
            <button type="button" className={`auth-tab ${mode==='signup' ? 'is-active' : ''}`} onClick={() => { setMode('signup'); setErr(null); }}>Create account</button>
          </div>

          <div className="role-toggle">
            <button type="button" className={role==='customer' ? 'is-active' : ''} onClick={() => setRole('customer')}>I'm travelling</button>
            <button type="button" className={role==='host'     ? 'is-active' : ''} onClick={() => setRole('host')}>I'm hosting</button>
          </div>

          {mode === 'signup' && (
            <div className="field mb-3">
              <label className="field-label">Name</label>
              <input className="input" placeholder="Your full name" {...register('full_name')} />
              {errors.full_name && <small style={{ color: 'var(--danger)' }}>{errors.full_name.message}</small>}
            </div>
          )}

          <div className="field mb-3">
            <label className="field-label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <small style={{ color: 'var(--danger)' }}>{errors.email.message}</small>}
          </div>

          {mode === 'signup' && (
            <div className="field mb-3">
              <label className="field-label">Phone (optional)</label>
              <input className="input" placeholder="+91 …" {...register('phone')} />
            </div>
          )}

          <div className="field mb-4">
            <label className="field-label">Password</label>
            <input className="input" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <small style={{ color: 'var(--danger)' }}>{errors.password.message}</small>}
          </div>

          {err && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{err}</p>}

          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} type="submit" disabled={pending}>
            {pending ? '…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <div className="row mt-4" style={{ gap: 12, alignItems: 'center' }}>
            <hr className="divider" style={{ flex: 1 }} />
            <span className="text-muted" style={{ fontSize: 12 }}>or continue with</span>
            <hr className="divider" style={{ flex: 1 }} />
          </div>

          <div className="mt-4">
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <div style={{ position: 'relative', width: '100%' }}>
                {/* Visible editorial button — clicks pass through to the overlay below */}
                <button type="button" className="btn btn-ghost btn-lg" style={{ width: '100%', pointerEvents: 'none' }}>
                  <Icon name="google" size={16} />
                  {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
                </button>
                {/* Real Google button rendered on top, fully transparent. Sized to fully cover our pill. */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', inset: 0,
                    opacity: 0,
                    colorScheme: 'light',
                    overflow: 'hidden',
                  }}
                >
                  <GoogleLogin
                    onSuccess={(cred) => googleMut.mutate({ role, credential: cred.credential })}
                    onError={() => setErr('Google sign-in was cancelled or failed.')}
                    theme="outline"
                    size="large"
                    width="380"
                    text={mode === 'login' ? 'signin_with' : 'signup_with'}
                  />
                </div>
              </div>
            ) : (
              <button type="button" className="btn btn-ghost btn-lg" style={{ width: '100%' }} disabled>
                <Icon name="google" size={16} /> Google sign-in (set VITE_GOOGLE_CLIENT_ID)
              </button>
            )}
          </div>

          <p className="text-muted mt-6" style={{ fontSize: 12, textAlign: 'center' }}>
            By continuing, you agree to our <Link to="/legal" style={{ borderBottom: '1px solid var(--line-strong)' }}>Terms</Link> and <Link to="/legal?tab=privacy" style={{ borderBottom: '1px solid var(--line-strong)' }}>Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
