// app/auth.ts
import NextAuth, { CredentialsSignin } from "next-auth";
import { verifyRecaptcha } from "../lib/recaptcha";
import CredentialsProvider from "next-auth/providers/credentials";
import { findDealByEmailAndPolicy, isDealActive } from "../lib/zoho/deals"; // adjust path if needed

// Reasons a sign-in is refused. The code tells the sign-in page which message to show.
class RobotCheckFailed extends CredentialsSignin {
  code = "robot";
}
class ContractCancelled extends CredentialsSignin {
  code = "cancelled";
}
class PolicyInactive extends CredentialsSignin {
  code = "inactive";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        policyNumber: { label: "Policy Number", type: "text" },
        recaptchaToken: { label: "reCAPTCHA", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.policyNumber) return null;

        // Checked here, before any lookup, so the sign-in address can't be called without it.
        if (!(await verifyRecaptcha(credentials.recaptchaToken))) {
          throw new RobotCheckFailed();
        }

        const email = credentials.email as string;
        const policyNumber = credentials.policyNumber as string;

        const deal = await findDealByEmailAndPolicy(email, policyNumber);
        if (!deal) return null;

        // Only active policies/deals can sign in (enforced here too, so the
        // NextAuth endpoint can't be called directly to bypass the check)
        if (!isDealActive(deal)) {
          throw deal.Stage === "Cancelled" ? new ContractCancelled() : new PolicyInactive();
        }

        // Return an object that matches the NextAuth User type
        return {
          id: deal.id,
          email: email,
          policyNumber: policyNumber,
          dealId: deal.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.dealId = user.dealId;
        token.policyNumber = user.policyNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.dealId = token.dealId as string;
        session.user.policyNumber = token.policyNumber as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
