import { auth } from "./auth";
import { redirect } from "next/navigation";
import { getDealById } from "@/lib/zoho/deals";
import ContractDetails from "./components/ContractDetails";
import ContractCard from "./components/ContractCard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.dealId) redirect("/login");

  const deal = await getDealById(session.user.dealId);
  if (!deal) return <div className="p-8 text-center">Contract not found.</div>;

  return (
    <div className="phg-page max-w-6xl space-y-6">
      <ContractDetails
        deal={{
          // Only the details shown on screen are sent to the browser.
          Policy_Number: deal.Policy_Number,
          Contact_Name: deal.Contact_Name && { name: deal.Contact_Name.name },
          Stage: deal.Stage,
          Coverage_Address: deal.Coverage_Address,
          Coverage_Address_City_Postcode: deal.Coverage_Address_City_Postcode,
          Start_Date: deal.Start_Date,
          End_Date: deal.End_Date,
          Sale_Date: deal.Sale_Date,
          Free_Months: deal.Free_Months,
          Plan_Type: deal.Plan_Type,
          Property_Type: deal.Property_Type,
          Optional_Coverage: deal.Optional_Coverage,
          Total_Plan_Cost: deal.Total_Plan_Cost,
          SCF: deal.SCF,
        }}
      />
      <ContractCard />
    </div>
  );
}
