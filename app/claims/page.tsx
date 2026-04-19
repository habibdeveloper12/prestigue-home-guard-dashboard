import { auth } from "../auth";
import { redirect } from "next/navigation";
import { getCasesByDeal } from "@/lib/zoho/cases";
import ClaimsClient from "../components/ClaimsClient";
import { getDealById } from "@/lib/zoho/deals";


export default async function ClaimsPage() {
  const session = await auth();
  if (!session?.user?.dealId) redirect("/login");
const deal = await getDealById(session.user.dealId);
  const cases = await getCasesByDeal(deal?.Email ?? session.user.email ?? "");
  const policyNumber = session.user.policyNumber;

  return <ClaimsClient cases={cases} policyNumber={policyNumber} />;
}
