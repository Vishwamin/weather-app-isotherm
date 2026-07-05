function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function flatten(records) {
  return records.map((r) => ({
    id: r.id,
    location: r.resolved_name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    start_date: r.start_date,
    end_date: r.end_date,
    avg_high_c: (r.daily.reduce((s, d) => s + d.tempMax, 0) / r.daily.length).toFixed(1),
    avg_low_c: (r.daily.reduce((s, d) => s + d.tempMin, 0) / r.daily.length).toFixed(1),
    notes: r.notes || '',
    created_at: r.created_at
  }));
}

export function exportJSON(records) {
  download('weather-records.json', JSON.stringify(records, null, 2), 'application/json');
}

export function exportCSV(records) {
  const rows = flatten(records);
  if (rows.length === 0) {
    download('weather-records.csv', 'no records\n', 'text/csv');
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))
  ];
  download('weather-records.csv', lines.join('\n'), 'text/csv');
}

export function exportXML(records) {
  const rows = flatten(records);
  const esc = (v) =>
    String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  const body = rows
    .map(
      (row) =>
        `  <record>\n` +
        Object.entries(row)
          .map(([k, v]) => `    <${k}>${esc(v)}</${k}>`)
          .join('\n') +
        `\n  </record>`
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<records>\n${body}\n</records>\n`;
  download('weather-records.xml', xml, 'application/xml');
}

export function exportMarkdown(records) {
  const rows = flatten(records);
  const header = '| Location | Country | Start | End | Avg High (°C) | Avg Low (°C) | Notes |';
  const divider = '|---|---|---|---|---|---|---|';
  const lines = rows.map(
    (r) =>
      `| ${r.location} | ${r.country} | ${r.start_date} | ${r.end_date} | ${r.avg_high_c} | ${r.avg_low_c} | ${r.notes.replace(/\|/g, '/')} |`
  );
  const md = `# Weather Records\n\n${header}\n${divider}\n${lines.join('\n')}\n`;
  download('weather-records.md', md, 'text/markdown');
}

export async function exportPDF(records) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const rows = flatten(records);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Weather Records — Isotherm', 14, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 24);

  let y = 34;
  doc.setFont('helvetica', 'bold');
  doc.text('Location', 14, y);
  doc.text('Range', 80, y);
  doc.text('Avg Hi/Lo', 130, y);
  doc.text('Notes', 165, y);
  doc.setFont('helvetica', 'normal');
  y += 5;
  doc.setDrawColor(180);
  doc.line(14, y, 196, y);
  y += 5;

  rows.forEach((r) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(8);
    doc.text(`${r.location}${r.country ? ', ' + r.country : ''}`, 14, y, { maxWidth: 62 });
    doc.text(`${r.start_date} → ${r.end_date}`, 80, y, { maxWidth: 46 });
    doc.text(`${r.avg_high_c} / ${r.avg_low_c}`, 130, y);
    doc.text(r.notes || '—', 165, y, { maxWidth: 30 });
    y += 8;
  });

  doc.save('weather-records.pdf');
}
