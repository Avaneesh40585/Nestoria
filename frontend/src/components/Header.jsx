import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/',          label: 'Stays' },
  { to: '/hotels',    label: 'Explore' },
  { to: '/journal',   label: 'Journal' },
  { to: '/about',     label: 'About' },
];

export default function Header({ theme, setTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHost = user?.role === 'host';
  const [open, setOpen] = useState(false);

  // Close drawer on route change.
  useEffect(() => { setOpen(false); }, [location.pathname, location.search]);

  // Body-scroll lock + Escape close while drawer is open.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('body-locked');
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('body-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className="header">
        <div className="container-wide header-inner">
          <Link to="/" className="logo" aria-label="Nestoria home">
            <span className="logo-mark">Nestoria<span className="logo-dot" /></span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <span className="hide-mobile"><ThemeToggle theme={theme} setTheme={setTheme} /></span>
            {user ? (
              <button
                className="btn btn-ghost btn-sm hide-mobile"
                onClick={() => navigate(isHost ? '/host/profile' : '/profile')}
              >
                <Icon name="user" size={14} /> {user.full_name?.split(' ')[0] || 'You'}
              </button>
            ) : (
              <button className="btn btn-primary btn-sm hide-mobile" onClick={() => navigate('/login')}>Sign in</button>
            )}
            {user && (
              <button
                className="btn btn-ghost btn-sm hide-mobile"
                onClick={() => { logout(); navigate('/'); }}
                aria-label="Sign out"
              >
                <Icon name="logout" size={14} />
              </button>
            )}

            <button
              type="button"
              className="nav-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((s) => !s)}
            >
              <Icon name={open ? 'x' : 'menu'} size={20} />
            </button>
          </div>
        </div>
      </header>

      {open && createPortal(
        <>
          <div className="mobile-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside id="mobile-nav" className="mobile-drawer" role="dialog" aria-label="Menu">
            <div className="mobile-drawer-head">
              <span className="logo-mark">Nestoria<span className="logo-dot" /></span>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <nav aria-label="Primary mobile">
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} end className={({ isActive }) => isActive ? 'is-active' : ''}>
                  {l.label}
                </NavLink>
              ))}
              {user && (
                <NavLink to={isHost ? '/host/profile' : '/profile'} className={({ isActive }) => isActive ? 'is-active' : ''}>
                  <Icon name="user" size={16} /> Profile
                </NavLink>
              )}
            </nav>

            <div className="mobile-drawer-footer">
              <ThemeToggle theme={theme} setTheme={setTheme} />
              {user ? (
                <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/'); }}>
                  <Icon name="logout" size={14} /> Sign out
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign in</button>
              )}
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  );
}
