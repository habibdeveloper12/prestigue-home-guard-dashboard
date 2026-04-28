"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ForgotPolicyPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setError("Please verify you are not a robot.");
      return;
    }

    // Here you would send email + token to your API route for verification
    // Example:
 const res = await fetch("/api/retrieve-policy", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ email, recaptchaToken }),
 });

 if (res.ok) {
   setSubmitted(true);
 } else {
   setError("Something went wrong. Please try again.");
 }

    // For demonstration, we simulate success:
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-700">CHOICE</h1>
          <p className="text-lg font-medium text-gray-600">Home Warranty</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            Send Policy #
          </h2>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Google reCAPTCHA Widget */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={handleRecaptchaChange}
                />
              </div>

              {/* Terms of Service Note */}
              <p className="text-xs text-gray-500">
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A2D53] hover:underline"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A2D53] hover:underline"
                >
                  Terms of Service
                </a>{" "}
                apply.
              </p>

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Retrieve Policy #
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-[#0A2D53]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                If an account exists for {email}, we've sent policy details to
                your inbox.
              </p>
            </div>
          )}

          {/* Back to Sign In */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0A2D53] hover:text-blue-800 hover:underline"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
