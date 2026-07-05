'use client';

import * as Icons from 'lucide-react';
import { describeCode } from '../lib/weatherCodes';
import IsothermBar from './IsothermBar';

export default function CurrentWeather({ place, current, daily }) {
  if (!current) return null;
  const { label, icon } = describeCode(current.weather_code);
  const Icon = Icons[icon] || Icons.HelpCircle;
  const today = daily?.[0];

  return (
    <div className="bg-slate/60 border border-slate-border rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <p className="readout-label">Current reading</p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-paper mt-1">
            {place.name}
          </h2>
          <p className="font-mono text-xs text-mist/60 mt-1">
            {place.latitude.toFixed(3)}°, {place.longitude.toFixed(3)}°
            {place.country ? ` · ${place.country}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Icon className="w-12 h-12 sm:w-14 sm:h-14 text-ember shrink-0" strokeWidth={1.5} />
          <div>
            <div className="font-display text-5xl sm:text-6xl font-semibold text-paper leading-none">
              {Math.round(current.temperature_2m)}°
            </div>
            <p className="text-mist text-sm mt-1">{label}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <IsothermBar
          currentTemp={current.temperature_2m}
          dailyMin={today?.temperature_2m_min}
          dailyMax={today?.temperature_2m_max}
        />
      </div>

      <div className="tick-divider my-6" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Metric label="Feels like" value={`${Math.round(current.apparent_temperature)}°`} />
        <Metric label="Humidity" value={`${current.relative_humidity_2m}%`} />
        <Metric label="Wind" value={`${Math.round(current.wind_speed_10m)} km/h`} />
        <Metric label="Precip" value={`${current.precipitation ?? 0} mm`} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="readout-label">{label}</p>
      <p className="font-mono text-lg text-paper mt-0.5">{value}</p>
    </div>
  );
}
