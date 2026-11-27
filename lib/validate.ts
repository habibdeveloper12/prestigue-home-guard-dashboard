// Input checks for values that are used in a Zoho search.
// Characters with a meaning in Zoho search criteria, spaces and extra "@" signs are refused.
export function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim();
  if (email.length > 100) return null;
  return /^[^\s@(),:;<>"\\\[\]]+@[^\s@(),:;<>"\\\[\]]+\.[^\s@(),:;<>"\\\[\]]{2,}$/.test(email) ? email : null;
}

export function cleanPolicyNumber(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const number = value.trim();
  return /^\d{1,25}$/.test(number) ? number : null;
}
