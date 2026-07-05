import { NextResponse } from 'next/server';

// Resolves free-text location input (city, town, postal code, landmark name)
// to coordinates using Open-Meteo's geocoding service (no API key required).
// Falls back to a looser query if an exact match isn't found, which is the
// "fuzzy match" behavior requested by the assessment.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();

  if (!query) {
    return NextResponse.json({ error: 'A location query is required.' }, { status: 400 });
  }

  // GPS coordinates entered directly, e.g. "17.385, 78.4867"
  const coordMatch = query.match(/^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
  if (coordMatch) {
    const latitude = parseFloat(coordMatch[1]);
    const longitude = parseFloat(coordMatch[2]);
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      return NextResponse.json({ error: 'Those coordinates are out of range.' }, { status: 400 });
    }
    return NextResponse.json({
      results: [
        {
          name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          country: '',
          admin1: '',
          latitude,
          longitude,
          matchType: 'coordinates'
        }
      ]
    });
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding service responded ${res.status}`);
    const data = await res.json();

    let results = data.results || [];
    let matchType = 'exact';

    if (results.length === 0) {
      // Fuzzy fallback: retry with just the first comma-separated token
      const looseQuery = query.split(',')[0].trim();
      if (looseQuery && looseQuery !== query) {
        const fallbackUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          looseQuery
        )}&count=6&language=en&format=json`;
        const fallbackRes = await fetch(fallbackUrl);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          results = fallbackData.results || [];
          matchType = 'fuzzy';
        }
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { error: `We couldn't find "${query}". Try a nearby city or a postal code instead.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      results: results.map((r) => ({
        name: r.name,
        country: r.country || '',
        admin1: r.admin1 || '',
        latitude: r.latitude,
        longitude: r.longitude,
        matchType
      }))
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'The location lookup failed. Check your connection and try again.' },
      { status: 502 }
    );
  }
}
