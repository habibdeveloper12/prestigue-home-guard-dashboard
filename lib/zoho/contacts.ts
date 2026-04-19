// lib/zoho/contacts.ts
import { zohoRequest } from "./client";

export interface ZohoContact {
  id: string;
  Email: string;
  Phone?: string;
  Mobile?: string;
  Mailing_Street?: string;
  Mailing_City?: string;
  Mailing_State?: string;
  Mailing_Zip?: string;
}

export async function getContactById(
  contactId: string,
): Promise<ZohoContact | null> {
  const result = await zohoRequest(`/Contacts/${contactId}`);
  return result.data?.[0] || null;
}

export async function updateContact(
  contactId: string,
  updates: any,
): Promise<any> {
  const result = await zohoRequest(`/Contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify({ data: [updates] }),
  });
  return result.data[0];
}
