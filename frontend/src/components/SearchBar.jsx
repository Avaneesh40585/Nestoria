import { useState } from 'react';
import Icon from './Icon.jsx';

export default function SearchBar({ initial = {}, onSubmit }) {
  const [location, setLocation] = useState(initial.location || '');
  const [checkin,  setCheckin]  = useState(initial.checkin  || '');
  const [checkout, setCheckout] = useState(initial.checkout || '');
  const [guests,   setGuests]   = useState(initial.guests   || 2);
  const [focused,  setFocused]  = useState(null);

  const submit = (e) => {
    e?.preventDefault?.();
    onSubmit?.({ location, checkin, checkout, guests });
  };

  return (
    <form className="search" onSubmit={submit}>
      <label className={`search-field ${focused === 'loc' ? 'is-focus' : ''}`}>
        <span className="search-label">Where</span>
        <input className="search-input" placeholder="Search city, region, or hotel"
               value={location} onFocus={() => setFocused('loc')} onBlur={() => setFocused(null)}
               onChange={(e) => setLocation(e.target.value)} />
      </label>
      <label className={`search-field ${focused === 'in' ? 'is-focus' : ''}`}>
        <span className="search-label">Check-in</span>
        <input className="search-input" type="date" value={checkin}
               onFocus={() => setFocused('in')} onBlur={() => setFocused(null)}
               onChange={(e) => setCheckin(e.target.value)} />
      </label>
      <label className={`search-field ${focused === 'out' ? 'is-focus' : ''}`}>
        <span className="search-label">Check-out</span>
        <input className="search-input" type="date" value={checkout}
               onFocus={() => setFocused('out')} onBlur={() => setFocused(null)}
               onChange={(e) => setCheckout(e.target.value)} />
      </label>
      <label className={`search-field ${focused === 'g' ? 'is-focus' : ''}`}>
        <span className="search-label">Guests</span>
        <select className="search-input" value={guests} style={{ background: 'transparent' }}
                onFocus={() => setFocused('g')} onBlur={() => setFocused(null)}
                onChange={(e) => setGuests(+e.target.value)}>
          {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} guest{n>1?'s':''}</option>)}
        </select>
      </label>
      <button type="submit" className="search-submit">
        <Icon name="search" size={16} />
        <span>Search</span>
      </button>
    </form>
  );
}
