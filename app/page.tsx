import { auth } from "./auth";
import { redirect } from "next/navigation";
import { getDealById } from "@/lib/zoho/deals";
import ContractDetails from "./components/ContractDetails";
import ContractCard from "./components/ContractCard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.dealId) redirect("/login");

  const deal = await getDealById(session.user.dealId);
  if (!deal) return <div className="p-8 text-center">Contract not found</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <ContractDetails deal={deal} />
        <ContractCard deal={deal} />
      </div>
    </div>
  );
}
