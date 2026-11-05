// app/actions/auth.ts
"use server";

import { signIn } from "../auth"; // This now points to app/auth.ts
import { findDealByEmailAndPolicy, isDealActive } from "../../lib/zoho/deals";

export async function authenticate(email: string, policyNumber: string) {
  try {
    const deal = await findDealByEmailAndPolicy(email, policyNumber);
    if (!deal) {
      return { error: "Invalid email or policy number" };
    }

    // Only users with an active policy/deal may log in
    if (!isDealActive(deal)) {
      return {
        error:
          deal.Stage === "Cancelled"
            ? "Your contract has been cancelled. Please contact the admin at Prestige Home Guard to reactivate your account."
            : "Your policy is not active, so you can't access the dashboard yet. Please contact the admin at Prestige Home Guard for assistance.",
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