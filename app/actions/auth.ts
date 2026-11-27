// app/actions/auth.ts
"use server";

import { CredentialsSignin } from "next-auth";
import { signIn } from "../auth"; // This now points to app/auth.ts

const MESSAGES: Record<string, string> = {
  credentials: "The email address or policy number is incorrect.",
  robot: "Please confirm you are not a robot, then try again.",
  cancelled:
    "Your contract has been cancelled. Please call Prestige Home Guard at (888) 970-6181 to reactivate your account.",
  inactive:
    "Your policy is not active, so you can't access the portal yet. Please call Prestige Home Guard at (888) 970-6181 for help.",
};

export async function authenticate(email: string, policyNumber: string, recaptchaToken: string) {
  try {
    // All checks happen in authorize() in app/auth.ts.
    await signIn("credentials", { email, policyNumber, recaptchaToken, redirect: false });
    return { success: true };
  } catch (error) {
    const code = error instanceof CredentialsSignin ? error.code : "";
    return { error: MESSAGES[code] || "We couldn't sign you in. Please try again." };
  }
}
