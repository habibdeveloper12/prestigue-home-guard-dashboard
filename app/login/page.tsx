"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/app/actions/auth";
import Link from "next/link";
import { Mail, Key } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await authenticate(email, policyNumber);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://prestigehomeguard.com/wp-content/uploads/2025/01/BHG-Logo.png"
              alt="Prestige Home Guard"
              width={400}
              height={100}
              className="mx-auto h-auto w-full max-w-xs"
            />
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            Customer Portal
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="policy"
                className="block text-sm font-medium text-gray-700"
              >
                Policy #
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Key size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="policy"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  required
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., 271349963"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#0A2D53] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/forgot-policy"
              className="text-sm font-medium text-[#0A2D53] hover:underline"
            >
              Forgot Policy #
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
