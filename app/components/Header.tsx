"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Home, FileText, Shield, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import Image from "next/image";


const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Claims", href: "/claims", icon: FileText },
  { name: "Coverage", href: "/coverage", icon: Shield },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src={"/PHG-Logo.png"}
              alt="HomeGuard Logo"
              width={150}
              height={80}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu & Logout */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <span className="text-sm text-gray-600">
              {session?.user?.email || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="flex flex-col space-y-1 px-4 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-gray-100 pt-2">
              <div className="px-3 py-2 text-sm text-gray-600">
                {session?.user?.email}
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
