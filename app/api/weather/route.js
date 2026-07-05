import { NextResponse } from 'next/server';

// Returns current conditions plus a 5-day forecast for the given coordinates.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('lat');
  const longitude = searchParams.get('lon');

  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'latitude and longitude are required.' }, { status: 400 });
  }

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset` +
      `&timezone=auto&forecast_days=5`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather service responded ${res.status}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'The weather service is unavailable right now. Please try again shortly.' },
      { status: 502 }
    );
  }
}
