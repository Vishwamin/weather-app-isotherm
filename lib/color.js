// Maps a temperature (°C) to a color along the glacier → paper → ember
// scale. This is the same scale used to render the isotherm strip, so a
// color always means the same temperature everywhere in the UI.
const STOPS = [
  { t: -10, c: [79, 209, 197] },   // glacier
  { t: 10, c: [125, 178, 186] },
  { t: 20, c: [237, 239, 240] },   // paper (neutral ~room temp)
  { t: 30, c: [255, 158, 110] },
  { t: 42, c: [255, 122, 69] }     // ember
];

export function tempToColor(t) {
  const clamped = Math.max(STOPS[0].t, Math.min(STOPS[STOPS.length - 1].t, t));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (clamped >= a.t && clamped <= b.t) {
      const f = (clamped - a.t) / (b.t - a.t);
      const c = a.c.map((v, idx) => Math.round(v + (b.c[idx] - v) * f));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1].c.join(', ')})`;
}

export function tempToPercent(t, min = -10, max = 42) {
  return Math.max(0, Math.min(100, ((t - min) / (max - min)) * 100));
}
