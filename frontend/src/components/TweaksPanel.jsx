import { useState } from 'react';
import { ACCENT_PRESETS } from '../hooks/useTweaks.js';
import Icon from './Icon.jsx';

export default function TweaksPanel({ tweaks, setTweak }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Theme tweaks"
        style={{
          position: 'fixed', right: 20, bottom: 20, zIndex: 60,
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--bg-elev)', border: '1px solid var(--line-strong)',
          color: 'var(--ink)', boxShadow: 'var(--shadow-md)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name={open ? 'x' : 'sliders'} size={18} />
      </button>
      {open && (
        <div
          role="dialog"
          style={{
            position: 'fixed', right: 20, bottom: 76, zIndex: 60,
            width: 240, padding: 20,
            background: 'var(--bg-elev)', border: '1px solid var(--line)',
            borderRadius: 16, boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="eyebrow mb-3">— Accent palette</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(ACCENT_PRESETS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setTweak('accent', key)}
                aria-label={p.label}
                title={p.label}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: p.swatch,
                  border: tweaks.accent === key ? '2px solid var(--accent)' : '1px solid var(--line)',
                  boxShadow: tweaks.accent === key ? '0 0 0 3px color-mix(in oklab, var(--accent) 30%, transparent)' : 'none',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                }}
              >
                {tweaks.accent === key && <Icon name="check" size={14} stroke={2.5} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
