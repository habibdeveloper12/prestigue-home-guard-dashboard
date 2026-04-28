"use client";

import {
  FileText,
  Home,
  Calendar,
  CheckCircle,
  Shield,
  DollarSign,
  Wrench,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import Modal from "./Modal/Modal";
import CoverageModalContent from "./CoverageModalContent";

interface ContractDetailsProps {
  deal: any; // Replace with proper ZohoDeal type
}

export default function ContractDetails({ deal }: ContractDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Map deal fields to display values
  const policyNumber = deal.Policy_Number || "N/A";
  const customerName = deal.Contact_Name?.name || "N/A";
  const coverageAddress = deal.Coverage_Address || "";
  const coverageCityPostcode = deal.Coverage_Address_City_Postcode || "";
  const fullAddress =
    `${coverageAddress}, ${coverageCityPostcode}`
      .trim()
      .replace(/^, |, $/g, "") || "N/A";

  const startDate = deal.Start_Date
    ? new Date(deal.Start_Date).toLocaleDateString("en-US")
    : "N/A";
  const endDate = deal.End_Date
    ? new Date(deal.End_Date).toLocaleDateString("en-US")
    : "N/A";
  const freeMonths = deal.Free_Months
    ? `(${deal.Free_Months} Free Months)`
    : "";
  const contractTerm = `${startDate} - ${endDate} ${freeMonths}`.trim();

  const status = deal.Stage || "Active";
  const coveragePlan = deal.Plan_Type || "Total Plan";
  const optionalCoverage = deal.Optional_Coverage?.join(", ") || "None";
  const contractRate = deal.Total_Plan_Cost
    ? `$${deal.Total_Plan_Cost.toLocaleString()}`
    : "$0.00";
  const serviceCallFee = deal.SCF
    ? `$${deal.SCF}`
    : "$00.00"; // default

  const details = [
    {
      label: "Property Type",
      value: "Single Family (Less than 5,000 sq.ft.)",
      icon: Home,
    }, // still static
    { label: "Customer Name", value: customerName, icon: FileText },
    { label: "Covered Property", value: fullAddress, icon: MapPin },
    { label: "Contract Term", value: contractTerm, icon: Calendar },
    { label: "Contract Status", value: status, icon: CheckCircle, badge: true },
    { label: "Coverage Plan", value: coveragePlan, icon: Shield, isLink: true },
    { label: "Optional Coverage", value: optionalCoverage, icon: Shield },
    { label: "Contract Rate", value: contractRate, icon: DollarSign },
    { label: "Service Call Fee", value: serviceCallFee, icon: Wrench },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Contract #{policyNumber}
        </h2>
        <span className="rounded-full  bg-[#227fe258] text-base px-3 py-1 text-sm font-medium text-blue-700">
          Property, Coverage & Rate Information
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {details.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-0.5 text-gray-400">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>
                {item.isLink ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm font-medium text-[#0A2D53] hover:underline"
                  >
                    {item.value}
                  </button>
                ) : (
                  <p
                    className={`text-base ${
                      item.badge
                        ? "font-semibold text-[#0A2D53]"
                        : "text-gray-800"
                    }`}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm font-medium text-[#0A2D53] hover:underline"
        >
          What's Covered? →
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Total Plan Coverage"
      >
        <CoverageModalContent />
      </Modal>
    </div>
  );
}
