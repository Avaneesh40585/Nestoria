import { useCallback, useEffect, useState } from 'react';

export const ACCENT_PRESETS = {
  terracotta: {
    label: 'Terracotta',
    swatch: '#c66b46',
    light: { accent: 'oklch(0.58 0.13 35)',  soft: 'oklch(0.94 0.04 35)',  ink: 'oklch(0.97 0.006 80)' },
    dark:  { accent: 'oklch(0.74 0.13 38)',  soft: 'oklch(0.28 0.06 38)',  ink: 'oklch(0.15 0.012 60)' },
  },
  forest: {
    label: 'Forest',
    swatch: '#3f8a5b',
    light: { accent: 'oklch(0.5 0.1 155)',   soft: 'oklch(0.92 0.04 155)', ink: 'oklch(0.97 0.006 80)' },
    dark:  { accent: 'oklch(0.72 0.12 155)', soft: 'oklch(0.26 0.05 155)', ink: 'oklch(0.15 0.012 60)' },
  },
  ink: {
    label: 'Ink',
    swatch: '#3e5a8a',
    light: { accent: 'oklch(0.42 0.06 250)', soft: 'oklch(0.92 0.03 250)', ink: 'oklch(0.97 0.006 80)' },
    dark:  { accent: 'oklch(0.7 0.1 250)',   soft: 'oklch(0.26 0.04 250)', ink: 'oklch(0.15 0.012 60)' },
  },
  saffron: {
    label: 'Saffron',
    swatch: '#d59038',
    light: { accent: 'oklch(0.65 0.15 65)',  soft: 'oklch(0.95 0.06 65)',  ink: 'oklch(0.18 0.012 60)' },
    dark:  { accent: 'oklch(0.78 0.14 65)',  soft: 'oklch(0.3 0.07 65)',   ink: 'oklch(0.15 0.012 60)' },
  },
  plum: {
    label: 'Plum',
    swatch: '#9a4e7a',
    light: { accent: 'oklch(0.5 0.13 340)',  soft: 'oklch(0.94 0.04 340)', ink: 'oklch(0.97 0.006 80)' },
    dark:  { accent: 'oklch(0.72 0.12 340)', soft: 'oklch(0.28 0.06 340)', ink: 'oklch(0.15 0.012 60)' },
  },
};

const DEFAULT = { accent: 'terracotta' };

function applyTweaks(tweaks, theme) {
  const preset = ACCENT_PRESETS[tweaks.accent] || ACCENT_PRESETS.terracotta;
  const colors = preset[theme] || preset.light;
  const r = document.documentElement;
  r.style.setProperty('--accent', colors.accent);
  r.style.setProperty('--accent-soft', colors.soft);
  r.style.setProperty('--accent-ink', colors.ink);
}

export function useTweaks(theme) {
  const [tweaks, setTweaks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nestoria-tweaks') || 'null');
      return { ...DEFAULT, ...(saved || {}) };
    } catch { return DEFAULT; }
  });
  useEffect(() => {
    localStorage.setItem('nestoria-tweaks', JSON.stringify(tweaks));
    applyTweaks(tweaks, theme);
  }, [tweaks, theme]);
  const setTweak = useCallback((k, v) => setTweaks((s) => ({ ...s, [k]: v })), []);
  return [tweaks, setTweak];
}
