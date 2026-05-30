import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';

import HotelCard from '../components/HotelCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Icon from '../components/Icon.jsx';
import Stepper from '../components/Stepper.jsx';
import { hotelsAPI } from '../lib/api.js';
import { useSavedHotels } from '../hooks/useSavedHotels.js';
import { useAuth } from '../context/AuthContext.jsx';

const AMENITY_OPTIONS = [
  { key: 'wifi', label: 'Fibre Wi-Fi' },
  { key: 'pool', label: 'Salt-water pool' },
  { key: 'spa', label: 'Spa & wellness' },
  { key: 'utensils', label: 'Restaurant & bar' },
  { key: 'car', label: 'Airport transfer' },
  { key: 'concierge', label: '24/7 concierge' },
];

const DEFAULT_FILTERS = { minPrice: 0, maxPrice: 30000, minRating: 0, regions: [], amenities: [] };

export default function HotelsScreen() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = params.get('location') || '';
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(params.get('sort') || 'score');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const next = params.get('sort') || 'score';
    if (next !== sort) setSort(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Body-scroll lock + Escape close for the mobile filter drawer.
  useEffect(() => {
    if (!filtersOpen) return;
    document.body.classList.add('body-locked');
    const onKey = (e) => { if (e.key === 'Escape') setFiltersOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('body-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [filtersOpen]);

  const setSortAndUrl = (k) => {
    setSort(k);
    const next = new URLSearchParams(params);
    next.set('sort', k);
    setParams(next, { replace: true });
  };
  const { isSaved, toggle: toggleSave } = useSavedHotels();
  const { user } = useAuth();
  const routerLocation = useLocation();
  const onSave = (id) => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(routerLocation.pathname + routerLocation.search)}`);
      return;
    }
    toggleSave(id);
  };
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

  const activeFilterCount =
    (filters.regions?.length || 0) +
    (filters.amenities?.length || 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < 30000 ? 1 : 0);

  const FiltersBody = (
    <>
      <div className="filter-block">
        <div className="filter-title">Price range</div>
        <div className="stack" style={{ '--gap': '10px' }}>
          <Stepper
            label="Min"
            value={filters.minPrice}
            min={0}
            max={Math.max(0, filters.maxPrice - 500)}
            step={500}
            format={(v) => `₹${v.toLocaleString('en-IN')}`}
            onChange={(v) => setFilters((f) => ({ ...f, minPrice: v }))}
          />
          <Stepper
            label="Max"
            value={filters.maxPrice}
            min={Math.min(filters.minPrice + 500, 50000)}
            max={50000}
            step={500}
            format={(v) => `₹${v.toLocaleString('en-IN')}`}
            onChange={(v) => setFilters((f) => ({ ...f, maxPrice: v }))}
          />
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
    </>
  );

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

      <div className="hotels-toolbar">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFiltersOpen(true)}>
          <Icon name="filter" size={14} /> Filters
          {activeFilterCount > 0 && <span className="filter-count-pill">{activeFilterCount}</span>}
        </button>
        <div className="sort">
          {[['score','Featured'],['price_asc','Price ↑'],['price_desc','Price ↓'],['rating','Rating']].map(([k,l]) => (
            <button key={k} className={`sort-btn ${sort===k ? 'is-active' : ''}`} onClick={() => setSortAndUrl(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="list-shell">
        <aside className="filters">
          {FiltersBody}
          <div className="filter-block" style={{ borderBottom: 0 }}>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}
                    onClick={() => setFilters(DEFAULT_FILTERS)}>
              Reset filters
            </button>
          </div>
        </aside>

        <div>
          <div className="list-head hide-mobile">
            <div className="list-results">{isLoading ? 'Loading…' : `${filtered.length} results`}</div>
            <div className="sort">
              {[['score','Featured'],['price_asc','Price ↑'],['price_desc','Price ↓'],['rating','Rating']].map(([k,l]) => (
                <button key={k} className={`sort-btn ${sort===k ? 'is-active' : ''}`} onClick={() => setSortAndUrl(k)}>{l}</button>
              ))}
            </div>
          </div>

          {!isLoading && filtered.length === 0 ? (
            <div className="card-flat" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <div className="serif" style={{ fontSize: 32 }}>Nothing here yet.</div>
              <p className="text-muted mt-3">No stays match those filters. Try widening the price range or removing a region.</p>
            </div>
          ) : (
            <div className="hotel-grid">
              {filtered.map((h, i) => (
                <div key={h.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <HotelCard hotel={h} saved={isSaved(h.id)} onSave={() => onSave(h.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && createPortal(
        <>
          <div className="mobile-backdrop" onClick={() => setFiltersOpen(false)} aria-hidden="true" />
          <aside className="filters-as-drawer" role="dialog" aria-label="Filters">
            <div className="filters-as-drawer-handle" />
            <div className="filters-as-drawer-head">
              <h2 className="h-3" style={{ margin: 0 }}>Filters</h2>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="filters-as-drawer-body">
              {FiltersBody}
            </div>
            <div className="filters-as-drawer-foot">
              <button className="btn btn-ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Reset
              </button>
              <button className="btn btn-primary" onClick={() => setFiltersOpen(false)}>
                Show {filtered.length} stays
              </button>
            </div>
          </aside>
        </>,
        document.body
      )}
    </div>
  );
}
