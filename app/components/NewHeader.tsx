"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, Menu, X, Phone, LogOut } from "lucide-react";
import { useState } from "react";
import Header from "./Header";

// Navigation items matching the "main-menu" in the JSON
const navItems = [
  { name: "Home", href: "https://prestigehomeguard.com/" },
  {
    name: "Resources",
    href: "https://prestigehomeguard.com/resources/",
    dropdown: [
      { name: "Why Purchase a Home Warranty?", href: "https://prestigehomeguard.com/why-purchase-a-home-warranty/" },
      { name: "Services", href: "https://prestigehomeguard.com/services/" },
      { name: "About Us", href: "https://prestigehomeguard.com/about/" },
      { name: "Careers", href: "https://prestigehomeguard.com/careers/" },
    ],
  },
  { name: "Plans & Pricing", href: "https://prestigehomeguard.com/plans/" },
  { name: "Blog", href: "https://prestigehomeguard.com/blog/" },
  { name: "Contact Us", href: "https://prestigehomeguard.com/contact/" },
];

export default function NewHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header>
      {/* Top Bar – matches first container (3ec6bff) */}
      <div className="bg-[#ffffff] text-white">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          {/* Logo – Column 1 (width 69%) */}
          <div className="w-[69%]">
            <Link href="/" className="inline-block">
              <img
                src="https://prestigehomeguard.com/wp-content/uploads/2025/01/BHG-Logo.png"
                alt="Prestige Home Guard"
                className="w-auto"
              />
            </Link>
          </div>

          {/* Empty spacer – Column 2 (hidden on mobile) */}
          <div className="hidden md:block w-[81%]" />

          {/* Phone Icon Box – Column 3 (hidden on mobile) */}
          <div className="hidden md:flex items-center w-[77%]">
            <a href="tel:+18889706181" className="flex items-center gap-2">
              {/* Circle with phone icon – matches the "stacked" view and border-radius 33px */}
              <span className="flex items-center justify-center h-[50px] w-[50px] rounded-full bg-[#082D53] text-white">
                <Phone size={18} />
              </span>
              <div className="ml-2">
                <h3 className="text-sm text-black font-bold leading-tight">
                  24/7 CUSTOMER SERVICES
                </h3>
                <p className="text-xs text-black">(888) 970-6181</p>
              </div>
            </a>
          </div>

          {/* GET A FREE QUOTE button – Column 4 (hidden on mobile) */}
          <div className="hidden md:block w-[41%] pt-[35px]">
            <a
              href="https://prestigehomeguard.com/get-free-consultation/" target="_blank" rel="noopener noreferrer"
              className="inline-block rounded border border-[#FFD974] bg-[#FFD974] px-[22px] py-[12px] text-sm font-semibold text-[#082D53] hover:bg-gray-100"
            >
              GET A FREE QUOTE
            </a>
          </div>

          {/* Session & logout for mobile (shown next to logo) */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-xs truncate">
              {session?.user?.email || ""}
            </span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar – matches second container (4e6b93c8) */}
      <div className="bg-[#EEEEEE]">
        <div className="mx-auto flex max-w-[1370px] items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          {/* Navigation column – width 100% */}
          <div className="w-full flex items-center justify-center">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 font-['Poppins'] text-[19px] font-semibold">
              {navItems.map((item) => {
                if (item.dropdown) {
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button className="flex items-center gap-1 text-black hover:text-[#3255A4]">
                        {item.name}
                        <ChevronDown size={16} />
                      </button>
                      {openDropdown === item.name && (
                        <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              target="_blank" rel="noopener noreferrer"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    target="_blank" rel="noopener noreferrer"
                    className={`hover:text-[#3255A4] ${
                      pathname === item.href
                        ? "text-[#3255A4] underline"
                        : "text-black"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {/* Desktop session & logout */}
              {/* <div className="flex items-center gap-3 ml-4">
                <span className="text-sm text-black font-normal">
                  {session?.user?.email || ""}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-black hover:text-[#3255A4]"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div> */}
            </nav>

            {/* Mobile menu trigger */}
            {/* <div className="lg:hidden flex items-center gap-2">
              <span className="text-sm text-black">
                {session?.user?.email || ""}
              </span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 text-black hover:text-[#3255A4]"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div> */}
          </div>

          {/* Empty spacer column – width 50% (hidden, not necessary) */}
          <div className="hidden w-[50%]" />
        </div>
      </div>
<Header/>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => {
              if (item.dropdown) {
                return (
                  <details key={item.name} className="group">
                    <summary className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      {item.name}
                      <ChevronDown size={14} />
                    </summary>
                    <div className="ml-4 space-y-1">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    pathname === item.href
                      ? "text-[#3255A4] bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
