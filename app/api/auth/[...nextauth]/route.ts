import { NextRequest } from "next/server";
import { handlers } from "../../../auth"; // relative path from api/auth/[...nextauth] to app/auth

export const { POST } = handlers;

// The browser reads the session here. The Zoho record id stays on the server.
export async function GET(request: NextRequest) {
  const response = await handlers.GET(request);
  if (!request.nextUrl.pathname.endsWith("/session")) return response;

  const session = await response.json();
  if (session?.user) delete session.user.dealId;

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(JSON.stringify(session), { status: response.status, headers });
}
