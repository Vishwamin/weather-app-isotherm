'use client';

import { useState } from 'react';
import { Trash2, Pencil, Check, X, Loader2 } from 'lucide-react';

export default function RecordsTable({ records, onChange, onError }) {
  const [editingId, setEditingId] = useState(null);
  const [draftNotes, setDraftNotes] = useState('');
  const [busyId, setBusyId] = useState(null);

  function startEdit(r) {
    setEditingId(r.id);
    setDraftNotes(r.notes || '');
  }

  async function saveEdit(id) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: draftNotes })
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || 'Could not update that record.');
        return;
      }
      onChange((prev) => prev.map((r) => (r.id === id ? data.record : r)));
      setEditingId(null);
    } catch {
      onError('Network error while updating the record.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/records/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || 'Could not delete that record.');
        return;
      }
      onChange((prev) => prev.filter((r) => r.id !== id));
    } catch {
      onError('Network error while deleting the record.');
    } finally {
      setBusyId(null);
    }
  }

  if (records.length === 0) {
    return (
      <p className="text-sm text-mist/50 font-mono py-6 text-center">
        No entries yet — log a location and date range above.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left readout-label border-b border-slate-border">
            <th className="py-2 pr-4">Location</th>
            <th className="py-2 pr-4">Range</th>
            <th className="py-2 pr-4">Avg Hi / Lo</th>
            <th className="py-2 pr-4">Notes</th>
            <th className="py-2 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => {
            const avgHi = r.daily.reduce((s, d) => s + d.tempMax, 0) / r.daily.length;
            const avgLo = r.daily.reduce((s, d) => s + d.tempMin, 0) / r.daily.length;
            const isEditing = editingId === r.id;
            const isBusy = busyId === r.id;
            return (
              <tr key={r.id} className="border-b border-slate-border/50 align-top">
                <td className="py-3 pr-4">
                  <p className="text-paper">{r.resolved_name}</p>
                  <p className="text-mist/50 text-xs font-mono">{r.country}</p>
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-mist">
                  {r.start_date} → {r.end_date}
                </td>
                <td className="py-3 pr-4 font-mono text-paper">
                  {avgHi.toFixed(1)}° / {avgLo.toFixed(1)}°
                </td>
                <td className="py-3 pr-4 max-w-[220px]">
                  {isEditing ? (
                    <input
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                      className="w-full bg-slate border border-slate-border rounded px-2 py-1 text-xs text-paper"
                      autoFocus
                    />
                  ) : (
                    <span className="text-mist/70">{r.notes || '—'}</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(r.id)}
                          disabled={isBusy}
                          className="text-glacier hover:text-glacier/70 transition-colors"
                          title="Save"
                        >
                          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-mist/50 hover:text-paper transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(r)}
                          className="text-mist/60 hover:text-glacier transition-colors"
                          title="Edit notes"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(r.id)}
                          disabled={isBusy}
                          className="text-mist/60 hover:text-ember transition-colors"
                          title="Delete"
                        >
                          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
