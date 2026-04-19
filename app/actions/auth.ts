// app/actions/auth.ts
"use server";

import { signIn } from "../auth"; // This now points to app/auth.ts
import { findDealByEmailAndPolicy } from "../../lib/zoho/deals";

export async function authenticate(email: string, policyNumber: string) {
  try {
    // Verify credentials against Zoho
    const deal = await findDealByEmailAndPolicy(email, policyNumber);
 console.log("Authentication attempt for:", email, policyNumber, "Found deal:", deal);
    if (!deal) {
      return { error: "Invalid email or policy number" };
    }

    // Sign in with NextAuth
    await signIn("credentials", {
      email,
      policyNumber,
      dealId: deal.id,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    return { error: "Authentication failed" };
  }
}
