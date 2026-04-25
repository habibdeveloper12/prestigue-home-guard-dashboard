import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { SessionProvider } from "next-auth/react";
import NewHeader from "./components/NewHeader";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home Warranty Dashboard",
  description: "Manage your home warranty contracts",
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
      <body suppressHydrationWarning>
        <SessionProvider>
          {/* <Header /> */}
          <NewHeader />
          <main>{children}</main>
          <Footer/>
        </SessionProvider>
      </body>
    </html>
  );
}
