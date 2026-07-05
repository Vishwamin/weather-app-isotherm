'use client';

export default function MapEmbed({ place }) {
  if (!place) return null;
  const src = `https://www.google.com/maps?q=${place.latitude},${place.longitude}&z=10&output=embed`;
  return (
    <div className="bg-slate/60 border border-slate-border rounded-2xl overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <p className="readout-label">Map</p>
      </div>
      <iframe
        title={`Map of ${place.name}`}
        src={src}
        className="w-full h-64 border-0 grayscale-[30%] contrast-125"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
