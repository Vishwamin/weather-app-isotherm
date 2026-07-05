'use client';

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';

export default function RecordForm({ onCreated, onError }) {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, startDate, endDate, notes })
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || 'Could not save that record.');
        return;
      }
      onCreated(data.record);
      setLocation('');
      setStartDate('');
      setEndDate('');
      setNotes('');
    } catch {
      onError('Network error while saving the record.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className="readout-label block mb-1.5">Location</label>
        <input
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Hyderabad, or 500032, or 17.385, 78.4867"
          className="w-full bg-slate border border-slate-border rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist/40 focus:border-glacier/60 transition-colors"
        />
      </div>
      <div>
        <label className="readout-label block mb-1.5">Start date</label>
        <input
          required
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full bg-slate border border-slate-border rounded-lg px-3 py-2.5 text-sm text-paper focus:border-glacier/60 transition-colors [color-scheme:dark]"
        />
      </div>
      <div>
        <label className="readout-label block mb-1.5">End date</label>
        <input
          required
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full bg-slate border border-slate-border rounded-lg px-3 py-2.5 text-sm text-paper focus:border-glacier/60 transition-colors [color-scheme:dark]"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="readout-label block mb-1.5">Notes (optional)</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Trip context, reminders, anything worth logging"
          className="w-full bg-slate border border-slate-border rounded-lg px-3 py-2.5 text-sm text-paper placeholder:text-mist/40 focus:border-glacier/60 transition-colors"
        />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-glacier text-void font-medium text-sm hover:bg-glacier/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Log this range
        </button>
      </div>
    </form>
  );
}
