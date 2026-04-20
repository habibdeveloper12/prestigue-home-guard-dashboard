// app/actions/auth.ts
"use server";

import { signIn } from "../auth"; // This now points to app/auth.ts
import { findDealByEmailAndPolicy } from "../../lib/zoho/deals";

export async function authenticate(email: string, policyNumber: string) {
  try {
    const deal = await findDealByEmailAndPolicy(email, policyNumber);
    if (!deal) {
      return { error: "Invalid email or policy number" };
    }

    // Reject if the deal stage is "Cancelled"
    if (deal.Stage === "Cancelled") {
      return {
        error: "Your contract has been cancelled. Please contact support.",
      };
    }

    // Proceed with NextAuth sign-in
    await signIn("credentials", {
      email,
      policyNumber,
      dealId: deal.id,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    return { error: "Authentication failed. Please try again." };
  }
}