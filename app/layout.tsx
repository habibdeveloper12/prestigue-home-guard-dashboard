import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./portal-brand.css";
import Header from "./components/Header";
import { SessionProvider } from "next-auth/react";
import { SiteHeader, SiteFooter } from "./components/SiteChrome";

// Same typeface as prestigehomeguard.com (design sync)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Customer Portal | Prestige Home Guard",
  description: "View your home warranty contract and submit service claims.",
  icons: {
    icon: "https://prestigehomeguard.com/wp-content/uploads/2025/01/cropped-BHG-Logo.png", // 👈 your existing logo in public/
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className} suppressHydrationWarning>
        <SessionProvider>
          {/* Shared website header/footer (source: prestigehomeguard.com feed) */}
          <SiteHeader />
          {/* Portal application navigation */}
          <Header />
          <main>{children}</main>
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
