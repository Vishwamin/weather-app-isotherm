// Uses Node's built-in SQLite (node:sqlite, stable Node >= 22.5) so the
// project needs zero native/compiled dependencies to install and run.
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'weather.db');

// Reuse a single connection across hot-reloads / route invocations.
const globalForDb = globalThis;
export const db = globalForDb.__weatherDb || new DatabaseSync(DB_PATH);
if (process.env.NODE_ENV !== 'production') globalForDb.__weatherDb = db;

db.exec('PRAGMA journal_mode = WAL;');

db.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    location_query TEXT NOT NULL,
    resolved_name TEXT NOT NULL,
    country TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    daily_json TEXT NOT NULL,
    notes TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

export function listRecords() {
  return db.prepare('SELECT * FROM records ORDER BY created_at DESC').all();
}

export function getRecord(id) {
  return db.prepare('SELECT * FROM records WHERE id = ?').get(id);
}

export function insertRecord(rec) {
  db.prepare(
    `INSERT INTO records
      (id, location_query, resolved_name, country, latitude, longitude, start_date, end_date, daily_json, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    rec.id,
    rec.location_query,
    rec.resolved_name,
    rec.country,
    rec.latitude,
    rec.longitude,
    rec.start_date,
    rec.end_date,
    rec.daily_json,
    rec.notes,
    rec.created_at,
    rec.updated_at
  );
  return getRecord(rec.id);
}

export function updateRecord(id, patch) {
  const existing = getRecord(id);
  if (!existing) return null;
  const merged = { ...existing, ...patch, updated_at: new Date().toISOString() };
  db.prepare(
    `UPDATE records SET
      location_query = ?,
      resolved_name = ?,
      country = ?,
      latitude = ?,
      longitude = ?,
      start_date = ?,
      end_date = ?,
      daily_json = ?,
      notes = ?,
      updated_at = ?
     WHERE id = ?`
  ).run(
    merged.location_query,
    merged.resolved_name,
    merged.country,
    merged.latitude,
    merged.longitude,
    merged.start_date,
    merged.end_date,
    merged.daily_json,
    merged.notes,
    merged.updated_at,
    id
  );
  return getRecord(id);
}

export function deleteRecord(id) {
  const info = db.prepare('DELETE FROM records WHERE id = ?').run(id);
  return info.changes > 0;
}
