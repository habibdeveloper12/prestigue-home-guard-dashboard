// Keeps only the listed fields, so anything else Zoho returns is dropped straight away.
export function pick<T>(record: Record<string, unknown>, fields: readonly string[]): T {
  return Object.fromEntries(
    fields.filter((f) => record[f] !== undefined).map((f) => [f, record[f]]),
  ) as T;
}

// Zoho record ids are digits only.
export const isRecordId = (id: string) => /^\d{1,25}$/.test(id);
