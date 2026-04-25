"use client";

import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ZohoCase } from "@/lib/zoho/cases";
import { useState } from "react";
import ClaimDetailsModal from "./ClaimDetailsModal";

interface ClaimsClientProps {
  cases: ZohoCase[];
  policyNumber?: string;
}

// Status badge helper
const getStatusBadge = (status: string) => {
  const lower = status.toLowerCase();
  if (lower.includes("approved")) {
    return (
      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        Approved
      </span>
    );
  }
  if (lower.includes("closed") || lower.includes("completed")) {
    return (
      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        Completed
      </span>
    );
  }
  if (lower.includes("pending")) {
    return (
      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
        Pending
      </span>
    );
  }
  if (lower.includes("in progress")) {
    return (
      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
        In Progress
      </span>
    );
  }
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
      {status}
    </span>
  );
};

export default function ClaimsClient({
  cases,
  policyNumber,
}: ClaimsClientProps) {
  const [selectedClaim, setSelectedClaim] = useState<ZohoCase | null>(null);
  const totalCases = cases.length;

  return (
    <>
      <div className="mx-auto h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                My Claims
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View and track the status of your service claims.
              </p>
            </div>
            <Link
              href="/claims/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <FileText size={16} />
              Start a New Claim
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Contract Number:
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {policyNumber || "N/A"}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Claim Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Claim Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Subject / Appliance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cases.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No claims found. Click &quot;Start a New Claim&quot; to
                        create one.
                      </td>
                    </tr>
                  ) : (
                    cases.map((c) => (
                      <tr
                        key={c.id}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td
                          onClick={() => setSelectedClaim(c)}
                          className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600 hover:underline"
                        >
                          {c.Claim_ID_No || c.Case_Number}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {new Date(c.Created_Time).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {c.Subject || "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {getStatusBadge(c.Status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> -{" "}
                <span className="font-medium">{totalCases}</span> of{" "}
                <span className="font-medium">{totalCases}</span>
              </p>
              <div className="flex gap-2">
                <button
                  disabled
                  className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  disabled
                  className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ClaimDetailsModal
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        claim={selectedClaim}
      />
    </>
  );
}
