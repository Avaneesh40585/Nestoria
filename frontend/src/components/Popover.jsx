import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const GAP = 8;
const EDGE = 16;

export default function Popover({ anchorRef, open, onClose, placement = 'below-left', className = '', children }) {
  const popRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, visibility: 'hidden' });

  const reposition = () => {
    const anchor = anchorRef.current;
    const pop    = popRef.current;
    if (!anchor || !pop) return;
    const a = anchor.getBoundingClientRect();
    const popW = pop.offsetWidth;
    const popH = pop.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = placement === 'below-right' ? a.right - popW : a.left;
    let top  = a.bottom + GAP;

    left = Math.max(EDGE, Math.min(left, vw - popW - EDGE));
    if (top + popH > vh - EDGE) top = Math.max(EDGE, a.top - GAP - popH);

    setPos({ top, left, visibility: 'visible' });
  };

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => reposition();
    const onResize = () => reposition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const pop = popRef.current;
      const anchor = anchorRef.current;
      if (pop && pop.contains(e.target)) return;
      if (anchor && anchor.contains(e.target)) return;
      onClose?.();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, anchorRef, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={popRef}
      className={`search-popover ${className}`}
      style={{ position: 'fixed', top: pos.top, left: pos.left, visibility: pos.visibility, zIndex: 200 }}
      role="dialog"
    >
      {children}
    </div>,
    document.body
  );
}
