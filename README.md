# Isotherm — Weather Console

Full-stack weather app built by **Vishwamin Patha** for the PM Accelerator AI Engineer Intern technical assessment (covers **both** Tech Assessment #1 — Frontend and Tech Assessment #2 — Backend).

Live weather + forecast, a persistent "weather logbook" with full CRUD, map + video enrichment, and multi-format export — all built on **free, keyless APIs**, so there's nothing to configure before running it.

## Stack

- **Framework:** Next.js 14 (App Router) — React + Node in one project, satisfying "no Python/Java framework for the frontend" while still giving a real backend.
- **Styling:** Tailwind CSS, custom "instrument panel" design system (see design notes below).
- **Icons:** lucide-react
- **Database:** Node's built-in `node:sqlite` (zero native dependencies — nothing to compile, just `npm install` and go). Requires **Node.js ≥ 22.5**.
- **Weather data:** [Open-Meteo](https://open-meteo.com) (current conditions, 5-day forecast, and historical archive) — free, no API key.
- **Geocoding:** Open-Meteo Geocoding API — resolves city/town/postal-code/landmark text to coordinates, with a fuzzy fallback.
- **Map:** Google Maps embed (`/maps?...&output=embed`) — no API key needed.
- **Video:** YouTube embed player's `listType=search` mode — no API key needed.
- **PDF export:** jsPDF (client-side).

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. That's it — no `.env` file, no API keys.

For a production build:

```bash
npm run build
npm start
```

## What's implemented (mapped to the assessment brief)

**Core (both tracks)**
- Location entry by city, town, postal/ZIP code, landmark name, or raw `lat, lon` — resolved server-side with a fuzzy-match fallback if the exact string isn't found.
- "Use my location" via browser Geolocation.
- Current conditions (temp, feels-like, humidity, wind, precipitation) with condition icons.
- 5-day forecast strip.
- Candidate name + PM Accelerator description in the footer.

**1.1 / 1.2 — Forecast & error handling**
- 5-day forecast (`components/Forecast.jsx`).
- Graceful error banners for "location not found," failed API calls, and network errors (`components/ErrorBanner.jsx`), surfaced from both the search bar and the logbook form.

**2.1 — CRUD**
- **Create:** enter a location + date range → server resolves the location, validates the range (start ≤ end, ≤ 31 days), fetches real daily temps (forecast API for recent/future dates, historical archive API for older ranges), and persists it.
- **Read:** logbook table lists every saved entry (shared across all users of this app instance — no auth/row-level security, matching the brief).
- **Update:** inline edit of the notes field (and the API supports updating the date range) via `PUT /api/records/:id`.
- **Delete:** `DELETE /api/records/:id`.
- Data lives in `data/weather.db` (SQLite file, created automatically).

**2.2 — Extra API integration**
- Google Maps embed of the searched location.
- YouTube "videos of this place" panel.

**2.3 — Data export**
- Export the whole logbook to **JSON, CSV, XML, Markdown, and PDF** from the toolbar above the table (`lib/export.js`).

## Design notes

The visual language is built around a "meteorological instrument" idea rather than a generic dashboard: a dark "night sky" base, an *isotherm bar* (the signature element — a live gradient strip whose color stops are computed from real fetched temperatures, functioning as a genuine data readout rather than decoration), tick-mark dividers styled like an instrument scale, and a mixed type system (Space Grotesk for large readouts, Inter for body copy, IBM Plex Mono for coordinates/timestamps/data — echoing an instrument panel's numeric readouts).

Fully responsive: single-column stacked layout on mobile, the forecast strip becomes horizontally scrollable, and the logbook table scrolls horizontally on narrow screens.

## Project structure

```
app/
  api/
    geocode/route.js       # location text -> coordinates (with fuzzy fallback)
    weather/route.js       # current + 5-day forecast
    records/route.js       # CRUD: list (GET) + create (POST)
    records/[id]/route.js  # CRUD: read/update/delete one record
  page.jsx                  # main UI
  layout.jsx, globals.css
components/                 # UI building blocks
lib/
  db.js                     # SQLite schema + queries
  export.js                 # JSON/CSV/XML/Markdown/PDF export
  weatherCodes.js            # WMO code -> icon/label mapping
  color.js                   # temperature -> color (isotherm bar)
data/                        # SQLite file lives here (gitignored)
```

## Submitting

1. Push this repo to GitHub (public, or private with `community@pmaccelerator.io` and `hr@pmaccelerator.io` added as collaborators).
2. Record a 1–2 minute demo (search a location, log a date range, edit/delete a record, export data) and host it on Drive/YouTube.
3. Submit the assessment form with the repo link, demo link, and a note that both Assessment #1 and #2 are covered.
