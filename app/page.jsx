'use client';

import { useEffect, useState } from 'react';
import { Gauge } from 'lucide-react';
import LocationSearch from '../components/LocationSearch';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import ErrorBanner from '../components/ErrorBanner';
import MapEmbed from '../components/MapEmbed';
import YouTubeEmbed from '../components/YouTubeEmbed';
import RecordForm from '../components/RecordForm';
import RecordsTable from '../components/RecordsTable';
import ExportMenu from '../components/ExportMenu';
import AboutPMA from '../components/AboutPMA';

export default function Home() {
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [records, setRecords] = useState([]);
  const [recordsError, setRecordsError] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      if (res.ok) setRecords(data.records);
    } catch {
      // Non-fatal — the logbook simply starts empty if this fails.
    }
  }

  async function handleResolve(selectedPlace) {
    setError('');
    setBusy(true);
    try {
      const res = await fetch(`/api/weather?lat=${selectedPlace.latitude}&lon=${selectedPlace.longitude}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not load weather for that location.');
        return;
      }
      setPlace(selectedPlace);
      setWeather(data);
    } catch {
      setError('Network error while fetching weather. Check your connection and retry.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2.5">
          <Gauge className="w-6 h-6 text-ember" strokeWidth={1.75} />
          <span className="font-display font-semibold text-lg tracking-tight text-paper">Isotherm</span>
        </div>
        <p className="readout-label hidden sm:block">Weather console</p>
      </header>

      <section className="space-y-4">
        <LocationSearch onResolve={handleResolve} onError={setError} busy={busy} setBusy={setBusy} />
        <ErrorBanner message={error} onDismiss={() => setError('')} />
      </section>

      {place && weather && (
        <section className="mt-8 space-y-6">
          <CurrentWeather place={place} current={weather.current} daily={dailyFor(weather)} />
          <Forecast daily={dailyFor(weather)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <MapEmbed place={place} />
            <YouTubeEmbed place={place} />
          </div>
        </section>
      )}

      {!place && (
        <p className="mt-8 text-sm text-mist/50 font-mono">
          Search a location above, or use current-location lookup, to see live conditions.
        </p>
      )}

      <section className="mt-16">
        <div className="tick-divider mb-8" />
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-display text-lg text-paper">Weather logbook</h2>
          <ExportMenu records={records} />
        </div>
        <p className="text-sm text-mist/60 mb-5">
          Log a location and date range to persist real temperature data to the database, then
          read, edit, or delete entries below.
        </p>
        <div className="bg-slate/40 border border-slate-border rounded-2xl p-5 mb-6">
          <RecordForm onCreated={(r) => setRecords((prev) => [r, ...prev])} onError={setRecordsError} />
        </div>
        <ErrorBanner message={recordsError} onDismiss={() => setRecordsError('')} />
        <div className="mt-4 bg-slate/40 border border-slate-border rounded-2xl p-5">
          <RecordsTable records={records} onChange={setRecords} onError={setRecordsError} />
        </div>
      </section>

      <AboutPMA />
    </main>
  );
}

function dailyFor(weather) {
  if (!weather?.daily) return [];
  return weather.daily.time.map((date, i) => ({
    date,
    weather_code: weather.daily.weather_code[i],
    temperature_2m_max: weather.daily.temperature_2m_max[i],
    temperature_2m_min: weather.daily.temperature_2m_min[i]
  }));
}
