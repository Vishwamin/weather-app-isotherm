'use client';

import { useState } from 'react';
import { Search, LocateFixed, Loader2 } from 'lucide-react';

export default function LocationSearch({ onResolve, onError, busy, setBusy }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [lookupTimer, setLookupTimer] = useState(null);

  async function lookup(value) {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (res.ok) setSuggestions(data.results || []);
    } catch {
      // Silent — suggestions are best-effort; the submit path surfaces real errors.
    }
  }

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    if (lookupTimer) clearTimeout(lookupTimer);
    setLookupTimer(setTimeout(() => lookup(value), 350));
  }

  function pick(place) {
    setSuggestions([]);
    setQuery(`${place.name}${place.country ? ', ' + place.country : ''}`);
    onResolve(place);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || 'Location not found.');
        return;
      }
      pick(data.results[0]);
    } catch {
      onError('Could not reach the location service. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by this browser.');
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        const place = {
          name: 'Current location',
          country: '',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setQuery('Current location');
        onResolve(place);
      },
      () => {
        setBusy(false);
        onError('We could not access your location. Check browser permissions.');
      },
      { timeout: 8000 }
    );
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist/60" />
          <input
            value={query}
            onChange={handleChange}
            placeholder="City, ZIP / postal code, landmark, or lat, lon"
            className="w-full bg-slate border border-slate-border rounded-lg pl-10 pr-3 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-glacier/60 transition-colors"
            aria-label="Location search"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full bg-slate-light border border-slate-border rounded-lg overflow-hidden shadow-xl">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => pick(s)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-border/60 transition-colors flex items-baseline justify-between gap-2"
                  >
                    <span className="text-paper">{s.name}</span>
                    <span className="text-mist/50 text-xs font-mono">
                      {[s.admin1, s.country].filter(Boolean).join(', ')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={busy}
          title="Use current location"
          className="shrink-0 px-3 rounded-lg border border-slate-border text-mist hover:text-glacier hover:border-glacier/50 transition-colors disabled:opacity-40"
        >
          <LocateFixed className="w-4 h-4" />
        </button>
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 px-4 rounded-lg bg-ember text-void font-medium text-sm hover:bg-ember/90 transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </button>
      </form>
    </div>
  );
}
