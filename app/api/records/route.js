import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { listRecords, insertRecord } from '../../../lib/db';

function isValidDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s).getTime());
}

async function resolveLocation(query) {
  const coordMatch = query.match(/^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
  if (coordMatch) {
    return {
      name: `${parseFloat(coordMatch[1]).toFixed(4)}, ${parseFloat(coordMatch[2]).toFixed(4)}`,
      country: '',
      latitude: parseFloat(coordMatch[1]),
      longitude: parseFloat(coordMatch[2])
    };
  }
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  const hit = data.results && data.results[0];
  if (!hit) return null;
  return { name: hit.name, country: hit.country || '', latitude: hit.latitude, longitude: hit.longitude };
}

async function fetchDailyTemps(lat, lon, startDate, endDate) {
  const today = new Date();
  const end = new Date(endDate);
  const daysAgo = Math.floor((today - end) / (1000 * 60 * 60 * 24));

  // Dates more than a couple of days in the past fall outside the live
  // forecast window, so pull them from the historical archive instead.
  const base =
    daysAgo > 2
      ? 'https://archive-api.open-meteo.com/v1/archive'
      : 'https://api.open-meteo.com/v1/forecast';

  const url =
    `${base}?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Unable to fetch temperature data for that date range.');
  const data = await res.json();
  if (!data.daily) throw new Error('No temperature data available for that date range.');

  return data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i]
  }));
}

export async function GET() {
  const records = listRecords().map((r) => ({ ...r, daily: JSON.parse(r.daily_json) }));
  return NextResponse.json({ records });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { location, startDate, endDate, notes } = body;

  if (!location || typeof location !== 'string' || !location.trim()) {
    return NextResponse.json({ error: 'A location is required.' }, { status: 400 });
  }
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return NextResponse.json({ error: 'Both start and end dates must be valid (YYYY-MM-DD).' }, { status: 400 });
  }
  if (new Date(startDate) > new Date(endDate)) {
    return NextResponse.json({ error: 'The start date must be on or before the end date.' }, { status: 400 });
  }
  const spanDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
  if (spanDays > 31) {
    return NextResponse.json({ error: 'Please keep date ranges to 31 days or fewer.' }, { status: 400 });
  }

  let place;
  try {
    place = await resolveLocation(location.trim());
  } catch {
    return NextResponse.json({ error: 'The location lookup failed. Try again.' }, { status: 502 });
  }
  if (!place) {
    return NextResponse.json(
      { error: `We couldn't verify "${location}" as a real location. Try a nearby city or postal code.` },
      { status: 404 }
    );
  }

  let daily;
  try {
    daily = await fetchDailyTemps(place.latitude, place.longitude, startDate, endDate);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }

  const now = new Date().toISOString();
  const record = insertRecord({
    id: randomUUID(),
    location_query: location.trim(),
    resolved_name: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    start_date: startDate,
    end_date: endDate,
    daily_json: JSON.stringify(daily),
    notes: notes || '',
    created_at: now,
    updated_at: now
  });

  return NextResponse.json({ record: { ...record, daily } }, { status: 201 });
}
