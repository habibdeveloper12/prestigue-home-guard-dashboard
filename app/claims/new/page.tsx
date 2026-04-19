"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

// Sample dropdown options
const systemOptions = [
  "Air Conditioning System",
  "Heating System",
  "Refrigerator",
  "Dishwasher",
  "Clothes Washer",
  "Clothes Dryer",
  "Garage Door Opener",
  "Water Heater",
  "Plumbing System",
  "Electrical System",
];

const unitOptions = ["1", "2", "3", "4", "5+"];
const issueOptions = [
  "Not cooling",
  "Not heating",
  "Leaking water",
  "Strange noise",
  "Not turning on",
  "Error code displayed",
  "Other",
];

export default function NewClaimPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    system: "Air Conditioning System",
    units: "",
    issue: "",
    lastWorking: "",
    tenant: "No",
    bestPhone: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.system) newErrors.system = "System is required";
    if (!formData.units) newErrors.units = "Number of units is required";
    if (!formData.issue) newErrors.issue = "Issue is required";
    if (!formData.lastWorking)
      newErrors.lastWorking = "Please specify when it last worked";
    if (!formData.bestPhone)
      newErrors.bestPhone = "Best phone number is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    // Redirect to claims list or success page
    router.push("/claims");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Back button */}
        <Link
          href="/claims"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft size={16} />
          Back to Claims
        </Link>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Add a new Claim
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Contract Number:
            </span>
            <span className="text-base font-semibold text-gray-900">
              271349963
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* System Dropdown */}
            <div>
              <label
                htmlFor="system"
                className="block text-sm font-medium text-gray-700"
              >
                System <span className="text-red-500">*</span>
              </label>
              <select
                id="system"
                name="system"
                value={formData.system}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.system ? "border-red-300" : "border-gray-300"
                } bg-white py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              >
                {systemOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.system && (
                <p className="mt-1 text-sm text-red-600">{errors.system}</p>
              )}
            </div>

            {/* Number of units */}
            <div>
              <label
                htmlFor="units"
                className="block text-sm font-medium text-gray-700"
              >
                Number of units <span className="text-red-500">*</span>
              </label>
              <select
                id="units"
                name="units"
                value={formData.units}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.units ? "border-red-300" : "border-gray-300"
                } bg-white py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              >
                <option value="">Select --</option>
                {unitOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.units && (
                <p className="mt-1 text-sm text-red-600">{errors.units}</p>
              )}
            </div>

            {/* Issue Dropdown */}
            <div>
              <label
                htmlFor="issue"
                className="block text-sm font-medium text-gray-700"
              >
                Issue <span className="text-red-500">*</span>
              </label>
              <select
                id="issue"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.issue ? "border-red-300" : "border-gray-300"
                } bg-white py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              >
                <option value="">Select --</option>
                {issueOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.issue && (
                <p className="mt-1 text-sm text-red-600">{errors.issue}</p>
              )}
            </div>

            {/* Last Working Date/Time */}
            <div>
              <label
                htmlFor="lastWorking"
                className="block text-sm font-medium text-gray-700"
              >
                When was the last time the item was working properly?{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="lastWorking"
                name="lastWorking"
                value={formData.lastWorking}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.lastWorking ? "border-red-300" : "border-gray-300"
                } bg-white py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.lastWorking && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastWorking}
                </p>
              )}
            </div>

            {/* Tenant */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tenant
              </label>
              <div className="mt-2 flex gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tenant"
                    value="No"
                    checked={formData.tenant === "No"}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tenant"
                    value="Yes"
                    checked={formData.tenant === "Yes"}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
              </div>
            </div>

            {/* Best Phone */}
            <div>
              <label
                htmlFor="bestPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Best Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="bestPhone"
                name="bestPhone"
                value={formData.bestPhone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
                className={`mt-1 block w-full rounded-lg border ${
                  errors.bestPhone ? "border-red-300" : "border-gray-300"
                } bg-white py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.bestPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.bestPhone}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Describe in detail the problem occurring.{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Please provide as much detail as possible..."
                className={`mt-1 block w-full rounded-lg border ${
                  errors.description ? "border-red-300" : "border-gray-300"
                } bg-white py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Required fields note */}
            <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-4">
              <AlertCircle size={18} className="mt-0.5 text-blue-600" />
              <p className="text-sm text-blue-700">
                Complete all required fields to continue.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Claim"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
