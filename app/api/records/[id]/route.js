import { NextResponse } from 'next/server';
import { getRecord, updateRecord, deleteRecord } from '../../../../lib/db';

function isValidDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s).getTime());
}

export async function GET(_request, { params }) {
  const record = getRecord(params.id);
  if (!record) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
  return NextResponse.json({ record: { ...record, daily: JSON.parse(record.daily_json) } });
}

// Update is intentionally scoped to fields that are safe to hand-edit after
// creation (notes, and the date range label) — the underlying resolved
// location and fetched temperatures stay immutable to preserve data
// integrity, matching what the assessment allows the developer to decide.
export async function PUT(request, { params }) {
  const existing = getRecord(params.id);
  if (!existing) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const patch = {};

  if (body.notes !== undefined) {
    if (typeof body.notes !== 'string' || body.notes.length > 2000) {
      return NextResponse.json({ error: 'Notes must be text under 2000 characters.' }, { status: 400 });
    }
    patch.notes = body.notes;
  }

  if (body.startDate !== undefined || body.endDate !== undefined) {
    const startDate = body.startDate ?? existing.start_date;
    const endDate = body.endDate ?? existing.end_date;
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return NextResponse.json({ error: 'Dates must be valid (YYYY-MM-DD).' }, { status: 400 });
    }
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({ error: 'The start date must be on or before the end date.' }, { status: 400 });
    }
    patch.start_date = startDate;
    patch.end_date = endDate;
  }

  const updated = updateRecord(params.id, patch);
  return NextResponse.json({ record: { ...updated, daily: JSON.parse(updated.daily_json) } });
}

export async function DELETE(_request, { params }) {
  const ok = deleteRecord(params.id);
  if (!ok) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
  return NextResponse.json({ success: true });
}
