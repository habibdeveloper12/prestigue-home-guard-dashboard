// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    dealId?: string;
    policyNumber?: string;
  }

  interface Session {
    user: {
      email?: string | null;
      dealId?: string;
      policyNumber?: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    dealId?: string;
    policyNumber?: string;
  }
}
