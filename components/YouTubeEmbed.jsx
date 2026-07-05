'use client';

export default function YouTubeEmbed({ place }) {
  if (!place) return null;
  const query = encodeURIComponent(`${place.name} travel guide`);
  const src = `https://www.youtube.com/embed?listType=search&list=${query}`;
  return (
    <div className="bg-slate/60 border border-slate-border rounded-2xl overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <p className="readout-label">Videos of {place.name}</p>
      </div>
      <iframe
        title={`YouTube videos of ${place.name}`}
        src={src}
        className="w-full h-64 border-0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
