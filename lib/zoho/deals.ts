// lib/zoho/deals.ts
import { zohoRequest } from "./client";

export interface ZohoDeal {
  id: string;
  Policy_Number?: string;
  Email?: string;
  Deal_Name?: string;
  Contract_Rate?: number;
  Coverage_Plan?: string;
  Stage?: string;
  Service_Call_Fee?: number;
  Contact_Name?: { id: string; name: string };
  // Add other fields as needed
}

export async function findDealByEmailAndPolicy(
  email: string,
  policyNumber: string,
): Promise<ZohoDeal | null> {
  try {
    // Search deals by email
    const result = await zohoRequest(
      `/Deals/search?criteria=(Email:equals:${encodeURIComponent(email)})`,
    );

    const deals = result.data;
    console.log("Zoho search result for email:", email, "Deals found:", deals);
    if (!deals || deals.length === 0) return null;

    // Find deal with matching policy number
    const matchingDeal = deals.find(
      (deal: any) => deal.Policy_Number == Number(policyNumber),
    );

    return matchingDeal || null;
  } catch (error) {
    console.error("Error searching Zoho deals:", error);
    return null;
  }
}

export async function getDealById(dealId: string): Promise<ZohoDeal | null> {
  const result = await zohoRequest(`/Deals/${dealId}`);
  return result.data?.[0] || null;
}
export async function updateDeal(dealId: string, updates: any) {
  const result = await zohoRequest(`/Deals/${dealId}`, {
    method: "PUT",
    body: JSON.stringify({ data: [updates] }),
  });
  return result.data[0];
}