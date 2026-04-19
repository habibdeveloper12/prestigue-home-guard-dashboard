"use client";

import { Calendar, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContractCardProps {
  deal: any; // Replace with proper ZohoDeal type
}

export default function ContractCard({ deal }: ContractCardProps) {
  const router = useRouter();

  // Extract data with fallbacks
  const contractRate = deal.Total_Plan_Cost
    ? `$${deal.Total_Plan_Cost.toLocaleString()}`
    : "$0.00";
  const startDate = deal.Start_Date
    ? new Date(deal.Start_Date).toLocaleDateString("en-US")
    : "N/A";
  const endDate = deal.End_Date
    ? new Date(deal.End_Date).toLocaleDateString("en-US")
    : "N/A";
  const freeMonths = deal.Free_Months ? `${deal.Free_Months} Free Months` : "";
  const orderDate = deal.Created_Time
    ? new Date(deal.Created_Time).toLocaleDateString("en-US")
    : "N/A";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">My Contracts</h3>
        <button
          onClick={() => router.push("/claims/new")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Start a New Claim
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-2 text-blue-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{contractRate}</p>
            <p className="text-sm text-gray-500">Contract Rate</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Order Date</p>
            <p className="text-base text-gray-800">{orderDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Contract Dates</p>
            <p className="flex items-center gap-1 text-base text-gray-800">
              <Calendar size={14} className="text-gray-400" />
              {startDate} - {endDate}
            </p>
            {freeMonths && (
              <p className="text-xs text-green-600">({freeMonths})</p>
            )}
          </div>
        </div>

        <button
          onClick={() => router.push("/profile")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
