'use client';

import { tempToColor, tempToPercent } from '../lib/color';

export default function IsothermBar({ currentTemp, dailyMin, dailyMax }) {
  const markerPct = tempToPercent(currentTemp);
  const ticks = [-10, 0, 10, 20, 30, 42];

  return (
    <div className="w-full">
      <div className="relative h-3 rounded-full overflow-hidden border border-white/10">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${tempToColor(-10)}, ${tempToColor(10)}, ${tempToColor(
              20
            )}, ${tempToColor(30)}, ${tempToColor(42)})`
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-void border-2 border-paper shadow-lg"
          style={{ left: `calc(${markerPct}% - 6px)` }}
          title={`${currentTemp}°C`}
        />
        {typeof dailyMin === 'number' && (
          <div
            className="absolute top-0 bottom-0 w-px bg-void/40"
            style={{ left: `${tempToPercent(dailyMin)}%` }}
          />
        )}
        {typeof dailyMax === 'number' && (
          <div
            className="absolute top-0 bottom-0 w-px bg-void/40"
            style={{ left: `${tempToPercent(dailyMax)}%` }}
          />
        )}
      </div>
      <div className="flex justify-between mt-1.5">
        {ticks.map((t) => (
          <span key={t} className="readout-label !text-[0.6rem]">
            {t}°
          </span>
        ))}
      </div>
    </div>
  );
}
