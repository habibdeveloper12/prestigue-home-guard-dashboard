"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { ZohoCase } from "@/lib/zoho/cases";
import { useState } from "react";
import ClaimDetailsModal from "./ClaimDetailsModal";
import { formatDateTime } from "@/lib/format";

interface ClaimsClientProps {
  cases: ZohoCase[];
  policyNumber?: string;
}

// Status badge helper
const getStatusBadge = (status: string = "") => {
  const lower = status.toLowerCase();
  let label = status || "—";
  let colours = "bg-gray-100 text-gray-800";
  if (lower.includes("approved")) {
    label = "Approved";
    colours = "bg-yellow-100 text-yellow-800";
  } else if (lower.includes("closed") || lower.includes("completed")) {
    label = "Completed";
    colours = "bg-green-100 text-green-800";
  } else if (lower.includes("pending")) {
    label = "Pending";
    colours = "bg-blue-100 text-blue-800";
  } else if (lower.includes("in progress")) {
    label = "In Progress";
    colours = "bg-purple-100 text-purple-800";
  }
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colours}`}>
      {label}
    </span>
  );
};

export default function ClaimsClient({ cases, policyNumber }: ClaimsClientProps) {
  const [selectedClaim, setSelectedClaim] = useState<ZohoCase | null>(null);
  const totalCases = cases.length;
  const heading = "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600";

  const claimButton = (c: ZohoCase) => (
    <button
      type="button"
      onClick={() => setSelectedClaim(c)}
      className="cursor-pointer font-semibold text-[#082D53] underline underline-offset-4"
      aria-label={`View details for claim ${c.Claim_ID_No || c.Case_Number}`}
    >
      {c.Claim_ID_No || c.Case_Number}
    </button>
  );

  return (
    <>
      <div className="phg-page max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="phg-h1">My Claims</h1>
            <p className="phg-sub-text">View your service claims and check their status.</p>
          </div>
          <Link href="/claims/new" className="phg-button phg-button-gold">
            <FileText size={18} aria-hidden="true" />
            Start a New Claim
          </Link>
        </div>

        <div className="phg-card overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <p className="phg-label">
              Policy Number{" "}
              <span className="ml-1 text-lg font-semibold text-[#082D53]">{policyNumber || "N/A"}</span>
            </p>
          </div>

          {totalCases === 0 ? (
            <p className="px-6 py-10 text-center text-gray-600">
              You don&rsquo;t have any claims yet. Select &ldquo;Start a New Claim&rdquo; to submit one.
            </p>
          ) : (
            <>
              <div className="hidden overflow-x-auto sm:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className={heading}>Claim Number</th>
                      <th scope="col" className={heading}>Date Submitted</th>
                      <th scope="col" className={heading}>Claim Type</th>
                      <th scope="col" className={heading}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cases.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm">{claimButton(c)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatDateTime(c.Created_Time)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{c.Claim_Type || "—"}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">{getStatusBadge(c.Status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-gray-200 sm:hidden">
                {cases.map((c) => (
                  <li key={c.id} className="space-y-1 px-5 py-4 text-sm text-gray-700">
                    <div className="flex items-center justify-between gap-3">
                      {claimButton(c)}
                      {getStatusBadge(c.Status)}
                    </div>
                    <p>{c.Claim_Type || "—"}</p>
                    <p className="text-gray-500">Submitted {formatDateTime(c.Created_Time)}</p>
                  </li>
                ))}
              </ul>

              <p className="border-t border-gray-200 px-6 py-4 text-sm text-gray-600">
                {totalCases} {totalCases === 1 ? "claim" : "claims"}
              </p>
            </>
          )}
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
