// lib/zoho/cases.ts
import { zohoRequest } from "./client";
import { isRecordId, pick } from "./pick";

// Only what the claims list and claim popup display. This is sent to the customer's browser.
export interface ZohoCase {
  Claim_ID_No: string;
  Created_Time: string;
  Date_reported: string;
  Subject?: string;
  Status: string;
  Claim_Type?: string;
  Case_Origin?: string;
  Service_Call_Fee_Amount?: number;
  Related_Policy?: { name: string };
  Contact_Name?: { name: string };
}

const CASE_FIELDS = [
  "Claim_ID_No",
  "Created_Time",
  "Date_reported",
  "Subject",
  "Status",
  "Claim_Type",
  "Case_Origin",
  "Service_Call_Fee_Amount",
  "Related_Policy",
  "Contact_Name",
] as const;

const nameOnly = (value?: { name: string }) => (value ? { name: value.name } : undefined);

export async function getCasesByDeal(dealId: string): Promise<ZohoCase[]> {
  if (!isRecordId(dealId)) return [];
  // Filter by the Related_Policy lookup field (stores the Deal ID)
  const result = await zohoRequest(
    `/Cases/search?criteria=(Related_Policy:equals:${dealId})&fields=${CASE_FIELDS.join(",")}`,
  );
  const records: Record<string, unknown>[] = result?.data ?? [];

  return records.map((r) => {
    const claim = pick<ZohoCase>(r, CASE_FIELDS);
    return {
      ...claim,
      Related_Policy: nameOnly(claim.Related_Policy),
      Contact_Name: nameOnly(claim.Contact_Name),
    };
  });
}
