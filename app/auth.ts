// app/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findDealByEmailAndPolicy } from "../lib/zoho/deals"; // adjust path if needed

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        policyNumber: { label: "Policy Number", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.policyNumber) return null;

        const email = credentials.email as string;
        const policyNumber = credentials.policyNumber as string;

        const deal = await findDealByEmailAndPolicy(email, policyNumber);
        if (!deal) return null;

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
