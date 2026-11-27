// lib/zoho/contacts.ts
import { zohoRequest } from "./client";
import { isRecordId, pick } from "./pick";

export interface ZohoContact {
  Email?: string;
  Phone?: string;
  Home_Phone?: string;
  Mailing_Street?: string;
  Mailing_City?: string;
  Mailing_State?: string;
  Mailing_Zip?: string;
}

// The only fields the portal asks Zoho for.
const CONTACT_FIELDS = [
  "Email",
  "Phone",
  "Home_Phone",
  "Mailing_Street",
  "Mailing_City",
  "Mailing_State",
  "Mailing_Zip",
] as const;

export async function getContactById(contactId: string): Promise<ZohoContact | null> {
  if (!isRecordId(contactId)) return null;
  const result = await zohoRequest(`/Contacts?ids=${contactId}&fields=${CONTACT_FIELDS.join(",")}`);
  const record = result?.data?.[0];
  return record ? pick<ZohoContact>(record, CONTACT_FIELDS) : null;
}

export async function updateContact(contactId: string, updates: Record<string, unknown>) {
  await zohoRequest(`/Contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify({ data: [updates] }),
  });
}
