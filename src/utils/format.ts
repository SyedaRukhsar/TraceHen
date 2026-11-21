// Formatting helpers — the only place date/number formatting lives.

/** "28 Nov 2026" from an ISO-8601 timestamp. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** "28 Nov 2026, 08:00" from an ISO-8601 timestamp. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** "5,000" — thousands separators, no decimals. */
export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

/** Signed count change: "-10" / "+5,000". */
export function formatDelta(n: number): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${formatCount(n)}`;
}
