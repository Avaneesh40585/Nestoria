export default function Icon({ name, size = 18, stroke = 1.6, ...props }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    ...props,
  };
  switch (name) {
    case 'search':      return (<svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>);
    case 'pin':         return (<svg {...common}><path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>);
    case 'calendar':    return (<svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>);
    case 'users':       return (<svg {...common}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 0 1 5.5 4.5"/></svg>);
    case 'moon':        return (<svg {...common}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>);
    case 'sun':         return (<svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>);
    case 'heart':       return (<svg {...common}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
    case 'heart-fill':  return (<svg {...common} fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
    case 'star':        return (<svg {...common} fill="currentColor" stroke="none"><path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 16.9l-6.2 3.4 1.6-6.8L2.2 8.9l6.9-.6L12 2z"/></svg>);
    case 'arrow-right': return (<svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>);
    case 'arrow-up-right': return (<svg {...common}><path d="M7 17 17 7M9 7h8v8"/></svg>);
    case 'chevron-down': return (<svg {...common}><path d="m6 9 6 6 6-6"/></svg>);
    case 'chevron-left': return (<svg {...common}><path d="m15 6-6 6 6 6"/></svg>);
    case 'chevron-right':return (<svg {...common}><path d="m9 6 6 6-6 6"/></svg>);
    case 'menu':         return (<svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>);
    case 'x':            return (<svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>);
    case 'minus':        return (<svg {...common}><path d="M5 12h14"/></svg>);
    case 'plus':         return (<svg {...common}><path d="M12 5v14M5 12h14"/></svg>);
    case 'check':        return (<svg {...common}><path d="M20 6 9 17l-5-5"/></svg>);
    case 'wifi':         return (<svg {...common}><path d="M2 8.5a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/></svg>);
    case 'pool':         return (<svg {...common}><path d="M2 18c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/><path d="M2 14c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/><path d="M7 13V5a2 2 0 0 1 4 0M17 13V5a2 2 0 0 0-4 0"/></svg>);
    case 'spa':          return (<svg {...common}><path d="M12 22c-4-4-4-8 0-12 4 4 4 8 0 12Z"/><path d="M5 17c-1-3 0-6 3-7M19 17c1-3 0-6-3-7"/></svg>);
    case 'utensils':     return (<svg {...common}><path d="M4 3v7a2 2 0 0 0 2 2v9M8 3v7M14 9V3a2 2 0 0 1 4 0v9h-4Zm0 0v10"/></svg>);
    case 'car':          return (<svg {...common}><path d="M5 16h14l-1.5-6.5A2 2 0 0 0 15.5 8h-7A2 2 0 0 0 6.5 9.5L5 16Z"/><circle cx="8" cy="18" r="1.6"/><circle cx="16" cy="18" r="1.6"/></svg>);
    case 'dumbbell':     return (<svg {...common}><path d="M2 12h2M20 12h2M5 8v8M19 8v8M9 6v12M15 6v12M9 12h6"/></svg>);
    case 'coffee':       return (<svg {...common}><path d="M4 8h14v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"/><path d="M18 10h2a2 2 0 0 1 0 4h-2"/><path d="M7 3v2M11 3v2M15 3v2"/></svg>);
    case 'tv':           return (<svg {...common}><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8"/></svg>);
    case 'ac':           return (<svg {...common}><path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>);
    case 'concierge':    return (<svg {...common}><path d="M3 18h18M5 18a7 7 0 0 1 14 0"/><path d="M12 8V5M9 5h6"/></svg>);
    case 'filter':       return (<svg {...common}><path d="M3 5h18M6 12h12M10 19h4"/></svg>);
    case 'sliders':      return (<svg {...common}><path d="M4 6h13M4 12h7M4 18h10"/><circle cx="19" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></svg>);
    case 'shield':       return (<svg {...common}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>);
    case 'phone':        return (<svg {...common}><path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>);
    case 'mail':         return (<svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>);
    case 'lock':         return (<svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>);
    case 'user':         return (<svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>);
    case 'logout':       return (<svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>);
    case 'compass':      return (<svg {...common}><circle cx="12" cy="12" r="9"/><path d="m15 9-3 6-3-3 6-3Z"/></svg>);
    case 'sparkle':      return (<svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.5 2.5M16 16l2.5 2.5M16 8l2.5-2.5M5.5 18.5 8 16"/></svg>);
    case 'google':       return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22.5 12.27c0-.83-.07-1.62-.21-2.39H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.58c2.09-1.93 3.21-4.77 3.21-8.18Z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.99 7.29-2.68l-3.58-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.28-1.92-6.14-4.51H2.16v2.83A11 11 0 0 0 12 23Z" fill="#34A853"/>
        <path d="M5.86 14.12A6.55 6.55 0 0 1 5.5 12c0-.74.13-1.45.36-2.12V7.05H2.16A11 11 0 0 0 1 12c0 1.77.42 3.45 1.16 4.95l3.7-2.83Z" fill="#FBBC05"/>
        <path d="M12 5.38c1.61 0 3.06.55 4.21 1.64l3.16-3.16C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.16 7.05l3.7 2.83C6.72 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
      </svg>
    );
    default: return null;
  }
}
