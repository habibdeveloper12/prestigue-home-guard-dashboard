// lib/zoho/cases.ts
import { zohoRequest } from "./client";

export interface ZohoCase {
  id: string;
  Case_Number: string;
  Created_Time: string;
  Date_reported: string;
  Subject?: string;
  Status: string;
  Description?: string;
  Claim_Type?: string;
  Case_Origin?: string;
  Service_Call_Fee_Amount?: number;
  Total_claim_cost?: number;
  Owner?: { name: string; id: string; email: string };
  Related_Policy?: { name: string; id: string };
  Contact_Name?: { name: string; id: string };
  Comments?: Array<{
    content: string;
    created_by: string;
    created_time: string;
  }>;
}

export async function getCasesByDeal(email: string): Promise<ZohoCase[]> {
  // Search for cases where the related deal field equals the deal ID
  // The field name might be "Deal_Name" (ID) or "Related_To"
  const result = await zohoRequest(
    `/Cases/search?criteria=(Email:equals:${encodeURIComponent(email)})`,
  );
  // zohoRequest may return null if no content
  if (!result || !result.data) {
    return [];
  }
  return result.data;
}
