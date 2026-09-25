/**
 * Utilitas untuk mengekspor data array objek ke berkas CSV yang kompatibel dengan Microsoft Excel & Google Sheets.
 */
export function exportToCsv(filename: string, rows: Record<string, unknown>[], headers?: { key: string; label: string }[]) {
  if (!rows || !rows.length) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  const keys = headers ? headers.map((h) => h.key) : Object.keys(rows[0]);
  const headerLabels = headers ? headers.map((h) => h.label) : keys;

  const escapeCell = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows: string[] = [];
  // Baris Header
  csvRows.push(headerLabels.map((label) => `"${label}"`).join(","));

  // Baris Data
  for (const row of rows) {
    const values = keys.map((key) => escapeCell(row[key]));
    csvRows.push(values.join(","));
  }

  const csvContent = "\uFEFF" + csvRows.join("\r\n"); // UTF-8 BOM untuk Excel
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
