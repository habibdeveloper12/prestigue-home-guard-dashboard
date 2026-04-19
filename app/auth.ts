// app/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findDealByEmailAndPolicy } from "@/lib/zoho/deals";

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
        const deal = await findDealByEmailAndPolicy(
          credentials.email as string,
          credentials.policyNumber as string,
        );
        if (!deal) return null;
        return {
          id: deal.id,
          email: credentials.email,
          policyNumber: credentials.policyNumber,
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
