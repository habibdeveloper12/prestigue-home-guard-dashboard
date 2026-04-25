// lib/zoho/cases.ts
import { zohoRequest } from "./client";

export interface ZohoCase {
  id: string;
  Claim_ID_No:string;
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

export async function getCasesByDeal(dealId: string): Promise<ZohoCase[]> {
  // Filter by the Related_Policy lookup field (stores the Deal ID)
  const result = await zohoRequest(
    `/Cases/search?criteria=(Related_Policy:equals:${dealId})`,
  );
  if (!result || !result.data) {
    return [];
  }
  return result.data;
}