"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Phone } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// The value is what is saved with the claim; the label is what the customer sees.
const systemOptions = [
  "Air Conditioning System",
  "Built-In Microwave",
  "Ceiling and Exhaust Fans",
  "Clothes Dryer",
  "Clothes Washer",
  "Dishwasher",
  "Ductwork",
  "Electrical System",
  "Garage Door Opener",
  "Garbage Disposal",
  "Heating System",
  "Oven Stove Cooktop",
  "Plumbing Stoppage",
  "Plumbing System",
  "Refrigerator",
  "Water Heater",
  "Whirlpool Bathtub",
];
const optionLabels: Record<string, string> = {
  "Oven Stove Cooktop": "Oven / Stove / Cooktop",
};

export default function NewClaimPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    system: "",
    issue: "",
    lastWorking: "",
    tenant: "No",
    bestPhone: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.system) newErrors.system = "Please select a system or appliance.";
    if (!formData.issue.trim()) newErrors.issue = "Please tell us what the problem is.";
    if (!formData.lastWorking)
      newErrors.lastWorking = "Please enter when the item last worked properly.";
    if (!formData.bestPhone)
      newErrors.bestPhone = "Please enter the best phone number to reach you.";
    if (!formData.description.trim())
      newErrors.description = "Please describe the problem.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      document.getElementById(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: formData.system,
          issue: formData.issue,
          lastWorking: formData.lastWorking,
          tenant: formData.tenant,
          bestPhone: formData.bestPhone,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("claim failed");
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/claims");
      router.refresh();
    } catch {
      setSubmitError(
        "We couldn’t submit your claim. Please try again or call (888) 970-6181.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldProps = (name: string) => ({
    id: name,
    name,
    onChange: handleChange,
    required: true,
    className: `phg-input ${errors[name] ? "phg-input-error" : ""}`,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const errorText = (name: string) =>
    errors[name] ? (
      <p id={`${name}-error`} className="phg-error">
        {errors[name]}
      </p>
    ) : null;
  const required = <span className="text-[#C62828]" aria-hidden="true">*</span>;

  return (
    <div className="phg-claim">
      <div className="phg-claim-inner">
        <div className="phg-claim-intro">
          <Link href="/claims" className="phg-back">
            <ChevronLeft size={16} aria-hidden="true" />
            Back to My Claims
          </Link>
          <h1>Start a New Claim</h1>
          <p className="phg-claim-lead">
            Tell us which system or appliance needs service and what happened,
            then submit your claim online.
          </p>
          <p className="phg-claim-policy">
            Policy Number <strong>{session?.user?.policyNumber || "N/A"}</strong>
          </p>
        </div>

        <div className="phg-claim-card">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
            <p className="text-sm text-[#5C697A] sm:col-span-2">
              Fields marked {required} are required.
            </p>

            <div className="sm:col-span-2">
              <label htmlFor="system" className="phg-field-label">
                System or Appliance {required}
              </label>
              <select {...fieldProps("system")} value={formData.system}>
                <option value="">Select a system or appliance</option>
                {systemOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {optionLabels[opt] || opt}
                  </option>
                ))}
              </select>
              {errorText("system")}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="issue" className="phg-field-label">
                What is the problem? {required}
              </label>
              <input type="text" {...fieldProps("issue")} value={formData.issue} placeholder="For example: leaking water" />
              {errorText("issue")}
            </div>

            <div>
              <label htmlFor="lastWorking" className="phg-field-label">
                When did it last work properly? {required}
              </label>
              <input type="datetime-local" {...fieldProps("lastWorking")} value={formData.lastWorking} />
              {errorText("lastWorking")}
            </div>

            <div>
              <label htmlFor="bestPhone" className="phg-field-label">
                Best Phone Number {required}
              </label>
              <input type="tel" autoComplete="tel" {...fieldProps("bestPhone")} value={formData.bestPhone} placeholder="(555) 123-4567" />
              {errorText("bestPhone")}
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="phg-field-label">Are you renting this home?</legend>
              <div className="mt-1.5 flex gap-3">
                {["No", "Yes"].map((value) => (
                  <label key={value} className="phg-choice">
                    <input type="radio" name="tenant" value={value} checked={formData.tenant === value} onChange={handleChange} />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="phg-field-label">
                Describe the problem in detail {required}
              </label>
              <textarea rows={5} {...fieldProps("description")} value={formData.description} placeholder="Tell us what happened, when it started and anything you have noticed." />
              {errorText("description")}
            </div>

            {submitError && (
              <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">
                {submitError}
              </div>
            )}

            <div className="sm:col-span-2">
              <button type="submit" disabled={isSubmitting} className="phg-button phg-button-gold w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  "Submit Claim"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="phg-claim-aside">
          <ol className="phg-steps">
            <li>Choose the system or appliance</li>
            <li>Describe the problem</li>
            <li>Submit your claim, and our team will contact you</li>
          </ol>
          <div className="phg-call">
            <Phone size={20} aria-hidden="true" />
            <div>
              <p>Prefer to call? Our customer service team is available 24/7.</p>
              <a href="tel:+18889706181">(888) 970-6181</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
