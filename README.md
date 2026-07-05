# Isotherm

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)# Isotherm

A weather application built with Next.js 14.

The project combines current weather, short-term forecasts, historical weather retrieval, persistent storage, and a small set of utility features (maps, related videos, exports) into a single application. The backend is implemented using Next.js API routes and SQLite, so the project runs as a single service without additional infrastructure.

No API keys are required.

## Features

- Search by city, town, postal code, landmark, or coordinates.
- Browser geolocation support.
- Current weather conditions.
- Five-day forecast.
- Historical weather retrieval over a selected date range.
- Persistent weather logbook backed by SQLite.
- Full CRUD interface for saved records.
- Google Maps embedding for searched locations.
- Embedded YouTube search for location-specific videos.
- Export records as JSON, CSV, XML, Markdown, or PDF.
- Responsive layout.

## Stack

| Component | Technology |
| ---------- | ---------- |
| Framework | Next.js 14 (App Router) |
| UI | React |
| Styling | Tailwind CSS |
| Backend | Next.js Route Handlers |
| Database | SQLite (`node:sqlite`) |
| Weather | Open-Meteo |
| Geocoding | Open-Meteo Geocoding |
| Maps | Google Maps Embed |
| Video | YouTube Embed |
| Export | jsPDF |

## Architecture

```
Browser
    │
    ▼
Next.js
 ├── React UI
 ├── API Routes
 └── SQLite

API Routes
    ├── Open-Meteo
    ├── Geocoding
    ├── CRUD
    └── Export
```

## Repository layout

```
app/
    api/
    page.jsx
    layout.jsx

components/

lib/
    db.js
    export.js
    weatherCodes.js
    color.js

data/
```

## Running

Requirements

- Node.js 22.5+
- npm

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Open

```
http://localhost:3000
```

For a production build,

```bash
npm run build
npm start
```

## Data model

Weather records contain

- location
- coordinates
- date range
- weather data
- notes

The SQLite database is created automatically on first launch.

## External services

Open-Meteo provides current conditions, forecasts, historical weather, and geocoding.

Google Maps is used for map embedding.

YouTube is used to embed search results related to the selected location.

All services used are publicly accessible without authentication.

## Notes

The UI is built around a simple weather-console aesthetic. The temperature gradient ("isotherm bar") is generated directly from fetched temperatures instead of using predefined colors. Typography separates interface labels from numeric readouts to make weather data easier to scan.

## Possible extensions

- User accounts
- Saved locations
- AQI support
- Weather radar
- Charts
- PWA support
- Theme switching

## License

MIT

## Author

Vishwamin Patha

GitHub: https://github.com/Vishwamin
