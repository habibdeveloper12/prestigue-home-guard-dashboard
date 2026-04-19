"use client";

import { useState } from "react";
import { Mail, Phone, Home } from "lucide-react";

interface ProfileFormProps {
  policyNumber?: string;
  contact: any; // Replace with proper ZohoContact type
  dealId: string;
  deal: any; // Replace with proper ZohoDeal type
}

export default function ProfileForm({
  policyNumber,
  contact,
  dealId,
  deal,
}: ProfileFormProps) {
  const [formData, setFormData] = useState({
    email: contact?.Email || "",
    homePhone: contact?.Phone || "",
    workPhone: contact?.Home_Phone || "",
    mailingAddress: contact?.Mailing_Street || "",
    mailingCity: contact?.Mailing_City || "",
    mailingState: contact?.Mailing_State || "",
    mailingZip: contact?.Mailing_Zip || "",
    coverageAddress: deal?.Coverage_Address || "",
    coverageAddressCityZip: deal?.Coverage_Address_City_Postcode || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Update failed");
      }

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Contract Number (Read-only) */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">
            Contract Number:
          </span>
          <span className="text-lg font-semibold text-gray-900">
            {policyNumber}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Phone Numbers - Two Column Layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="homePhone"
              className="block text-sm font-medium text-gray-700"
            >
              Home Phone
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="homePhone"
                name="homePhone"
                value={formData.homePhone}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="workPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Work Phone
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="workPhone"
                name="workPhone"
                value={formData.workPhone}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Mailing Address */}
        <div>
          <label
            htmlFor="mailingAddress"
            className="block text-sm font-medium text-gray-700"
          >
            Mailing Address
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Home size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="mailingAddress"
              name="mailingAddress"
              value={formData.mailingAddress}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="mailingCity"
              className="block text-sm font-medium text-gray-700"
            >
              Mailing City
            </label>
            <input
              type="text"
              id="mailingCity"
              name="mailingCity"
              value={formData.mailingCity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label
              htmlFor="mailingState"
              className="block text-sm font-medium text-gray-700"
            >
              Mailing State
            </label>
            <input
              type="text"
              id="mailingState"
              name="mailingState"
              value={formData.mailingState}
              onChange={handleChange}
              maxLength={2}
              className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-3 text-gray-900 uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label
              htmlFor="mailingZip"
              className="block text-sm font-medium text-gray-700"
            >
              Mailing Zip
            </label>
            <input
              type="text"
              id="mailingZip"
              name="mailingZip"
              value={formData.mailingZip}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="mailingCity"
              className="block text-sm font-medium text-gray-700"
            >
              Coverage Address
            </label>
            <input
              type="text"
              id="coverageAddress"
              name="coverageAddress"
              value={formData.coverageAddress}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label
              htmlFor="mailingState"
              className="block text-sm font-medium text-gray-700"
            >
              Coverage Address City & Postcode
            </label>
            <input
              type="text"
              id="coverageAddressCityZip"
              name="coverageAddressCityZip"
              value={formData.coverageAddressCityZip}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-3 text-gray-900 uppercase focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Success / Error Messages */}
        {successMessage && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Update Button */}
        <div className="flex justify-end border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
