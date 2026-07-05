'use client';

import { Download } from 'lucide-react';
import { exportJSON, exportCSV, exportXML, exportMarkdown, exportPDF } from '../lib/export';

export default function ExportMenu({ records }) {
  const disabled = records.length === 0;

  const options = [
    { label: 'JSON', fn: exportJSON },
    { label: 'CSV', fn: exportCSV },
    { label: 'XML', fn: exportXML },
    { label: 'Markdown', fn: exportMarkdown },
    { label: 'PDF', fn: exportPDF }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="readout-label flex items-center gap-1.5">
        <Download className="w-3.5 h-3.5" /> Export
      </span>
      {options.map((o) => (
        <button
          key={o.label}
          disabled={disabled}
          onClick={() => o.fn(records)}
          className="px-3 py-1.5 rounded-md border border-slate-border text-xs font-mono text-mist hover:text-paper hover:border-glacier/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
