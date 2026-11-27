// Display helpers for the portal. Presentation only.

/** Date-only values (YYYY-MM-DD) are formatted in UTC so the day never shifts with the viewer's time zone. */
export function formatDate(value?: string | null): string {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: dateOnly ? "UTC" : "America/New_York",
  });
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });
}

export function formatMoney(value: number | string): string {
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
