import { useCallback, useEffect, useState } from 'react';

const KEY = 'nestoria-saved-hotels';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function useSavedHotels() {
  const [saved, setSaved] = useState(read);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved]);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setSaved(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isSaved = useCallback((id) => saved.includes(id), [saved]);

  const toggle = useCallback((id) => {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }, []);

  return { saved, isSaved, toggle };
}
