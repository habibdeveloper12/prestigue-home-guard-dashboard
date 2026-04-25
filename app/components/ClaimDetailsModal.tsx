"use client";

import {
  X,
  Calendar,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Wrench,
  AlertCircle,
} from "lucide-react";
import { ZohoCase } from "@/lib/zoho/cases";

interface ClaimDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ZohoCase | null;
}

export default function ClaimDetailsModal({
  isOpen,
  onClose,
  claim,
}: ClaimDetailsModalProps) {
  if (!isOpen || !claim) return null;

  const getStatusBadge = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes("received")) {
      return (
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          Received
        </span>
      );
    }
    if (lower.includes("approved")) {
      return (
        <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          Approved
        </span>
      );
    }
    if (lower.includes("completed") || lower.includes("closed")) {
      return (
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Completed
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900">
            Claim Details: {claim.Claim_ID_No || claim.Case_Number}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Type */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              {getStatusBadge(claim.Status)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Type:</span>
              <span className="text-sm text-gray-900">
                {claim.Claim_Type || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Origin:</span>
              <span className="text-sm text-gray-900">
                {claim.Case_Origin || "—"}
              </span>
            </div>
          </div>

          {/* Subject & Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Subject</h3>
            <p className="text-base text-gray-900">{claim.Subject || "—"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Description
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {claim.Description || "No description provided."}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Date Reported
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(claim.Date_reported).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Created Time
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(claim.Created_Time).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Related Policy & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Related Policy
              </h3>
              {claim.Related_Policy ? (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900">
                    {claim.Related_Policy.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {claim.Related_Policy.id}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">—</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Contact
              </h3>
              {claim.Contact_Name ? (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900">
                    {claim.Contact_Name.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {claim.Contact_Name.id}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">—</p>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Service Call Fee
              </p>
              <p className="text-sm text-gray-900">
                ${claim.Service_Call_Fee_Amount || "0"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Claim Cost
              </p>
              <p className="text-sm text-gray-900">
                ${claim.Total_claim_cost || "0"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Owner</p>
              <p className="text-sm text-gray-900">
                {claim.Owner?.name || "—"}
              </p>
            </div>
          </div>

          {/* Comments (if any) */}
          {claim.Comments && claim.Comments.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Comments
              </h3>
              <div className="space-y-2">
                {claim.Comments.map((comment: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.created_by} -{" "}
                      {new Date(comment.created_time).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
