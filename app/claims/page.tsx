import { auth } from "../auth";
import { redirect } from "next/navigation";
import { getCasesByDeal } from "@/lib/zoho/cases";
import ClaimsClient from "../components/ClaimsClient";


export default async function ClaimsPage() {
  const session = await auth();
  if (!session?.user?.dealId) redirect("/login");
  const cases = await getCasesByDeal(session.user.dealId);
  const policyNumber = session.user.policyNumber;

  return <ClaimsClient cases={cases} policyNumber={policyNumber} />;
}
