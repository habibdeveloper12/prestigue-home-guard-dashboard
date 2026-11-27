// lib/zoho/client.ts
// Privacy rule: nothing received from Zoho is logged, cached or put in error messages.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // If token is cached and not expired, use it
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  // Use refresh token to get a new access token
  const response = await fetch("https://accounts.zoho.com/oauth/v2/token", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.access_token) {
    throw new Error(`Zoho token refresh failed (status ${response.status})`);
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function zohoRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  const baseUrl = "https://www.zohoapis.com/crm/v5";

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    cache: "no-store",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Zoho API error (status ${response.status})`);
  }

  const text = await response.text();

  // Handle empty response (e.g., 204 No Content)
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Zoho API returned an invalid response");
  }
}
