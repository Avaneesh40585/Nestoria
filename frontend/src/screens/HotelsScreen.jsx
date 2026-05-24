import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import HotelCard from '../components/HotelCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Icon from '../components/Icon.jsx';
import { hotelsAPI } from '../lib/api.js';
import { useSavedHotels } from '../hooks/useSavedHotels.js';

const AMENITY_OPTIONS = [
  { key: 'wifi', label: 'Fibre Wi-Fi' },
  { key: 'pool', label: 'Salt-water pool' },
  { key: 'spa', label: 'Spa & wellness' },
  { key: 'utensils', label: 'Restaurant & bar' },
  { key: 'car', label: 'Airport transfer' },
  { key: 'concierge', label: '24/7 concierge' },
];

export default function HotelsScreen() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = params.get('location') || '';
  const [filters, setFilters] = useState({
    minPrice: 0, maxPrice: 30000, minRating: 0, regions: [], amenities: [],
  });
  const [sort, setSort] = useState('score');
  const { isSaved, toggle: toggleSave } = useSavedHotels();
  const [showSearch, setShowSearch] = useState(false);

  const apiParams = {
    location: location || undefined,
    min_price: filters.minPrice || undefined,
    max_price: filters.maxPrice || undefined,
    min_rating: filters.minRating || undefined,
    sort,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['hotels', apiParams],
    queryFn: () => hotelsAPI.search(apiParams).then((d) => d.hotels),
  });

  const regions = useMemo(
    () => Array.from(new Set((data || []).map((h) => h.region).filter(Boolean))),
    [data]
  );

  // Local refinement for region + amenities (server already handles price/rating/location)
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((h) => {
      if (filters.regions.length && !filters.regions.includes(h.region)) return false;
      if (filters.amenities.length) {
        const keys = new Set((h.amenities || []).map((a) => a.key));
        if (!filters.amenities.every((a) => keys.has(a))) return false;
      }
      return true;
    });
  }, [data, filters.regions, filters.amenities]);

  const toggleSet = (key, val) => setFilters((f) => {
    const arr = f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val];
    return { ...f, [key]: arr };
  });

  const onSearch = (q) => {
    const next = new URLSearchParams();
    if (q.location) next.set('location', q.location);
    if (q.checkin)  next.set('checkin',  q.checkin);
    if (q.checkout) next.set('checkout', q.checkout);
    if (q.guests)   next.set('guests',   q.guests);
    setParams(next);
    setShowSearch(false);
  };

  return (
    <div className="container-wide" style={{ paddingTop: 36, paddingBottom: 80 }}>
      <div className="mb-8">
        <div className="eyebrow mb-3">— {location ? `Search · ${location}` : 'All stays'}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap' }}>
          <h1 className="h-1">
            {isLoading ? '…' : filtered.length} stays{location ? ` in ${location}` : ' across India'}.
          </h1>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSearch((s) => !s)}>
            <Icon name="search" size={14} /> Refine search
          </button>
        </div>
        {showSearch && (
          <div className="mt-6 fade-up">
            <SearchBar initial={{ location }} onSubmit={onSearch} />
          </div>
        )}
      </div>

      <div className="list-shell">
        <aside className="filters">
          <div className="filter-block">
            <div className="filter-title">Price range</div>
            <div className="range-slider">
              <input className="input" type="number" placeholder="Min" value={filters.minPrice || ''}
                     onChange={(e) => setFilters((f) => ({ ...f, minPrice: +e.target.value || 0 }))} />
              <span className="text-mono text-muted">—</span>
              <input className="input" type="number" placeholder="Max" value={filters.maxPrice || ''}
                     onChange={(e) => setFilters((f) => ({ ...f, maxPrice: +e.target.value || 30000 }))} />
            </div>
            <div className="mt-3 row" style={{ gap: 8, flexWrap: 'wrap' }}>
              {[[0,5000],[5000,10000],[10000,20000],[20000,30000]].map(([a,b]) => (
                <button key={a} className={`chip ${filters.minPrice===a && filters.maxPrice===b ? 'is-active' : ''}`}
                        onClick={() => setFilters((f) => ({ ...f, minPrice: a, maxPrice: b }))}>
                  ₹{a.toLocaleString()}–{b.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <div className="filter-title">Minimum rating</div>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              {[0, 4.0, 4.5, 4.8].map((r) => (
                <button key={r} className={`chip ${filters.minRating === r ? 'is-active' : ''}`}
                        onClick={() => setFilters((f) => ({ ...f, minRating: r }))}>
                  {r === 0 ? 'Any' : <><Icon name="star" size={11} /> {r.toFixed(1)}+</>}
                </button>
              ))}
            </div>
          </div>

          {regions.length > 0 && (
            <div className="filter-block">
              <div className="filter-title">Region</div>
              <div className="checkboxes">
                {regions.map((r) => (
                  <label key={r} className="cbox">
                    <input type="checkbox" checked={filters.regions.includes(r)} onChange={() => toggleSet('regions', r)} />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="filter-block">
            <div className="filter-title">Amenities</div>
            <div className="checkboxes">
              {AMENITY_OPTIONS.map((a) => (
                <label key={a.key} className="cbox">
                  <input type="checkbox" checked={filters.amenities.includes(a.key)} onChange={() => toggleSet('amenities', a.key)} />
                  <span>{a.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-block" style={{ borderBottom: 0 }}>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}
                    onClick={() => setFilters({ minPrice: 0, maxPrice: 30000, minRating: 0, regions: [], amenities: [] })}>
              Reset filters
            </button>
          </div>
        </aside>

        <div>
          <div className="list-head">
            <div className="list-results">{isLoading ? 'Loading…' : `${filtered.length} results`}</div>
            <div className="sort">
              {[['score','Featured'],['price_asc','Price ↑'],['price_desc','Price ↓'],['rating','Rating']].map(([k,l]) => (
                <button key={k} className={`sort-btn ${sort===k ? 'is-active' : ''}`} onClick={() => setSort(k)}>{l}</button>
              ))}
            </div>
          </div>

          {!isLoading && filtered.length === 0 ? (
            <div className="card-flat" style={{ padding: 48, textAlign: 'center' }}>
              <div className="serif" style={{ fontSize: 32 }}>Nothing here yet.</div>
              <p className="text-muted mt-3">No stays match those filters. Try widening the price range or removing a region.</p>
            </div>
          ) : (
            <div className="hotel-grid">
              {filtered.map((h, i) => (
                <div key={h.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <HotelCard hotel={h} saved={isSaved(h.id)} onSave={() => toggleSave(h.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
