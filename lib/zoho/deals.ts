// lib/zoho/deals.ts
import { zohoRequest } from "./client";
import { isRecordId, pick } from "./pick";
import { cleanEmail, cleanPolicyNumber } from "../validate";

export interface ZohoDeal {
  id: string;
  Policy_Number?: string;
  Email?: string;
  Stage?: string;
  Contact_Name?: { id: string; name: string };
  Forget_Id_Req_Count?: number;
  Coverage_Address?: string;
  Coverage_Address_City_Postcode?: string;
  Start_Date?: string;
  End_Date?: string;
  Sale_Date?: string;
  Free_Months?: number;
  Plan_Type?: string;
  Property_Type?: string;
  Optional_Coverage?: string[];
  Total_Plan_Cost?: number;
  SCF?: number;
}

// The only fields the portal asks Zoho for. Add a field here before using it.
const CONTRACT_FIELDS = [
  "Policy_Number",
  "Stage",
  "Contact_Name",
  "Coverage_Address",
  "Coverage_Address_City_Postcode",
  "Start_Date",
  "End_Date",
  "Sale_Date",
  "Free_Months",
  "Plan_Type",
  "Property_Type",
  "Optional_Coverage",
  "Total_Plan_Cost",
  "SCF",
] as const;

const LOOKUP_FIELDS = ["Email", "Policy_Number", "Stage", "Forget_Id_Req_Count"] as const;

// Deal stages that are allowed to log in to the dashboard.
// Override with a comma-separated env var, e.g. ACTIVE_DEAL_STAGES="Active,Renewed"
const ACTIVE_DEAL_STAGES = (process.env.ACTIVE_DEAL_STAGES || "Active")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isDealActive(deal: ZohoDeal | null | undefined): boolean {
  if (!deal?.Stage) return false;
  return ACTIVE_DEAL_STAGES.includes(deal.Stage.trim().toLowerCase());
}

// Zoho's "equals" search also returns partial and look-alike matches,
// so only records with exactly this email address are kept.
export async function findDealsByEmail(value: string): Promise<ZohoDeal[]> {
  const email = cleanEmail(value);
  if (!email) return [];

  const result = await zohoRequest(
    `/Deals/search?criteria=(Email:equals:${encodeURIComponent(email)})&fields=${LOOKUP_FIELDS.join(",")}`,
  );
  const records: Record<string, unknown>[] = result?.data ?? [];

  return records
    .filter((r) => String(r.Email ?? "").trim().toLowerCase() === email.toLowerCase())
    .map((r) => pick<ZohoDeal>(r, ["id", ...LOOKUP_FIELDS]));
}

export async function findDealByEmailAndPolicy(
  email: string,
  policyNumber: string,
): Promise<ZohoDeal | null> {
  const policy = cleanPolicyNumber(policyNumber);
  if (!policy) return null;

  try {
    const deals = await findDealsByEmail(email);
    return deals.find((deal) => Number(deal.Policy_Number) === Number(policy)) || null;
  } catch {
    console.error("Zoho policy search failed");
    return null;
  }
}

export async function getDealById(dealId: string): Promise<ZohoDeal | null> {
  if (!isRecordId(dealId)) return null;
  const result = await zohoRequest(`/Deals?ids=${dealId}&fields=${CONTRACT_FIELDS.join(",")}`);
  const record = result?.data?.[0];
  return record ? pick<ZohoDeal>(record, ["id", ...CONTRACT_FIELDS]) : null;
}

export async function updateDeal(dealId: string, updates: Record<string, unknown>) {
  await zohoRequest(`/Deals/${dealId}`, {
    method: "PUT",
    body: JSON.stringify({ data: [updates] }),
  });
}
