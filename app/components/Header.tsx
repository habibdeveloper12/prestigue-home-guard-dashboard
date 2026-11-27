"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Home, FileText, Shield, User, LogOut, LogIn } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Claims", href: "/claims", icon: FileText },
  { name: "Coverage", href: "/coverage", icon: Shield },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Logged-out pages (login, forgot policy) show only the website header: the app navigation is for signed-in customers.
  if (!session?.user && (pathname === "/login" || pathname.startsWith("/forgot-policy"))) {
    return null;
  }

  return (
    <div className="phg-tabs">
      <div className="phg-tabs-inner">
        <nav aria-label="Customer portal">
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                    <Icon size={16} aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="phg-tabs-user">
          {session?.user?.email && <span className="phg-tabs-email">{session.user.email}</span>}
          {session?.user ? (
            <button type="button" onClick={handleLogout}>
              <LogOut size={16} aria-hidden="true" />
              Sign Out
            </button>
          ) : (
            <button type="button" onClick={() => (window.location.href = "/login")}>
              <LogIn size={16} aria-hidden="true" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
