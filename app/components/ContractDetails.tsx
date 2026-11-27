"use client";

import {
  FileText,
  Home,
  Calendar,
  CalendarCheck,
  Shield,
  ShieldPlus,
  DollarSign,
  Wrench,
  MapPin,
  User,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import Modal from "./Modal/Modal";
import CoverageModalContent from "./CoverageModalContent";
import { formatDate, formatMoney } from "@/lib/format";
import { planName } from "@/lib/plans";

interface ContractDetailsProps {
  deal: any; // Replace with proper ZohoDeal type
}

export default function ContractDetails({ deal }: ContractDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Map deal fields to display values
  const policyNumber = deal.Policy_Number || "N/A";
  const customerName = deal.Contact_Name?.name || "N/A";
  const coverageAddress = deal.Coverage_Address || "";
  const coverageCityPostcode = deal.Coverage_Address_City_Postcode || "";
  const fullAddress =
    `${coverageAddress}, ${coverageCityPostcode}`
      .trim()
      .replace(/^, |, $|,$/g, "") || "N/A";

  const startDate = formatDate(deal.Start_Date);
  const endDate = formatDate(deal.End_Date);
  const freeMonths = deal.Free_Months
    ? `Includes ${deal.Free_Months} free ${Number(deal.Free_Months) === 1 ? "month" : "months"}`
    : "";

  const status = deal.Stage || "Active";
  const coveragePlan = planName(deal.Plan_Type);
  const propertyType = deal.Property_Type?.trim() || "Single Family";
  const optionalCoverage = deal.Optional_Coverage?.join(", ") || "None";
  const contractRate = deal.Total_Plan_Cost
    ? formatMoney(deal.Total_Plan_Cost)
    : "$0.00";
  const serviceCallFee = deal.SCF ? formatMoney(deal.SCF) : "N/A";
  const orderDate = formatDate(deal.Sale_Date);

  const details = [
    { label: "Customer Name", value: customerName, icon: User },
    { label: "Covered Property", value: fullAddress, icon: MapPin },
    { label: "Property Type", value: propertyType, icon: Home },
    { label: "Contract Term", value: `${startDate} – ${endDate}`, note: freeMonths, icon: Calendar },
    { label: "Order Date", value: orderDate, icon: CalendarCheck },
    { label: "Optional Coverage", value: optionalCoverage, icon: ShieldPlus },
  ];

  const summary = [
    { label: "Coverage Plan", value: coveragePlan, icon: Shield },
    { label: "Contract Rate", value: contractRate, icon: DollarSign },
    { label: "Service Call Fee", value: serviceCallFee, icon: Wrench },
  ];

  const firstName = customerName === "N/A" ? "" : customerName.split(" ")[0];

  return (
    <div className="space-y-6">
      <section className="phg-hero">
        <div className="min-w-0">
          <p className="phg-eyebrow">Policy Number {policyNumber}</p>
          <h1>{firstName ? `Welcome, ${firstName}` : "Welcome"}</h1>
          <p className="phg-hero-sub">
            Contract status: <span className="phg-status">{status}</span>
          </p>
        </div>
        <div className="phg-hero-actions">
          <Link href="/claims/new" className="phg-button phg-button-gold">
            Start a New Claim
          </Link>
          <Link href="/claims" className="phg-button phg-button-ghost">
            View My Claims
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="phg-card flex items-center gap-4 p-5">
              <span className="phg-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="phg-label">{item.label}</p>
                <p className="text-xl font-semibold text-[#082D53] break-words">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <section className="phg-card p-6" aria-labelledby="contract-heading">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="contract-heading" className="phg-title flex items-center gap-2">
            <FileText size={20} aria-hidden="true" />
            Contract Details
          </h2>
          <button type="button" onClick={() => setIsModalOpen(true)} className="phg-link">
            What&rsquo;s Covered <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          {details.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <span className="phg-icon phg-icon-sm">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="phg-label">{item.label}</dt>
                  <dd className="text-base text-[#1F2D3D] break-words">{item.value}</dd>
                  {item.note && <dd className="text-sm text-[#5C697A]">{item.note}</dd>}
                </div>
              </div>
            );
          })}
        </dl>
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="What’s Covered">
        <CoverageModalContent plan={deal.Plan_Type} optionalCoverage={deal.Optional_Coverage} />
      </Modal>
    </div>
  );
}
