'use client';

import * as Icons from 'lucide-react';
import { describeCode } from '../lib/weatherCodes';

function dayLabel(dateStr, index) {
  if (index === 0) return 'Today';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export default function Forecast({ daily }) {
  if (!daily || daily.length === 0) return null;

  return (
    <div>
      <p className="readout-label mb-3">5-day forecast</p>
      <div className="flex gap-3 overflow-x-auto scroll-strip pb-2 -mx-1 px-1">
        {daily.map((d, i) => {
          const { label, icon } = describeCode(d.weather_code);
          const Icon = Icons[icon] || Icons.HelpCircle;
          return (
            <div
              key={d.date}
              className="shrink-0 w-32 bg-slate/60 border border-slate-border rounded-xl p-4 text-center"
            >
              <p className="font-mono text-xs text-mist/70">{dayLabel(d.date, i)}</p>
              <Icon className="w-7 h-7 text-glacier mx-auto my-3" strokeWidth={1.5} />
              <p className="text-paper font-display text-lg leading-none">
                {Math.round(d.temperature_2m_max)}°
                <span className="text-mist/50 text-sm"> / {Math.round(d.temperature_2m_min)}°</span>
              </p>
              <p className="text-[0.65rem] text-mist/60 mt-2 leading-snug h-8">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
