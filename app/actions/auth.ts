// app/actions/auth.ts
"use server";

import { signIn } from "../auth"; // This now points to app/auth.ts
import { findDealByEmailAndPolicy, isDealActive } from "../../lib/zoho/deals";

export async function authenticate(email: string, policyNumber: string) {
  try {
    const deal = await findDealByEmailAndPolicy(email, policyNumber);
    if (!deal) {
      return { error: "The email address or policy number is incorrect." };
    }

    // Only users with an active policy/deal may log in
    if (!isDealActive(deal)) {
      return {
        error:
          deal.Stage === "Cancelled"
            ? "Your contract has been cancelled. Please call Prestige Home Guard at (888) 970-6181 to reactivate your account."
            : "Your policy is not active, so you can't access the portal yet. Please call Prestige Home Guard at (888) 970-6181 for help.",
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
    return { error: "We couldn't sign you in. Please try again." };
  }
}