import { MapPin, Mail, Phone } from "lucide-react";
import Link from "next/link";

const usefulLinks = [
  { label: "Home", href: "https://prestigehomeguard.com/" },
  {
    label: "Plans & Pricing",
    href: "https://prestigehomeguard.com/plans-pricing/",
  },
  { label: "About us", href: "https://prestigehomeguard.com/about-us/" },
  { label: "Careers", href: "https://prestigehomeguard.com/career/" },
  { label: "Contact Us", href: "https://prestigehomeguard.com/contact-us/" },
  {
    label: "Privacy Policy",
    href: "https://prestigehomeguard.com/privacy-policy/",
  },
  {
    label: "TERMS OF SERVICE AGREEMENT",
    href: "https://prestigehomeguard.com/user-agreement/",
  },
];

export default function Footer() {
  return (
    <footer>
      {/* TOP FOOTER – matches section 491dd8a6 */}
      <div
        className="relative bg-cover bg-center bg-no-repeat py-5 px-[15px] shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
        style={{
          backgroundImage:
            "url('https://prestigehomeguard.com/wp-content/uploads/2025/01/plumbero-img45.png')",
        }}
      >
        {/* Overlay for readability (optional, not in JSON but helps) */}
        <div className="absolute inset-0 bg-[#0A2D53]/90" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 – Address */}
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD974] text-black">
                  <MapPin size={18} />
                </span>
                <p className="font-['Poppins'] text-base font-medium text-white md:text-[16px]">
                  2035 Lincoln Hwy, Edison, NJ 08817
                </p>
              </div>
            </div>

            {/* Column 2 – Email */}
            <div className="flex flex-col items-center justify-center md:items-start">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD974] text-black">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="font-['Poppins'] text-base font-medium text-white/70">
                    Email us :
                  </p>
                  <a
                    href="mailto:info@prestigehomeguard.com"
                    className="font-['Poppins'] text-lg font-semibold text-white hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    info@prestigehomeguard.com
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3 – Phone */}
            <div className="flex flex-col items-center justify-center md:items-start">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD974] text-black">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="font-['Poppins'] text-base font-medium text-white/70">
                    Call us now :
                  </p>
                  <a
                    href="tel:+18889706181"
                    className="font-['Poppins'] text-lg font-semibold text-white hover:underline"
                  >
                    (888) 970-6181
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER – matches section 16ef12b6 */}
      <div className="bg-[#0A2D53] px-[15px] pt-[30px] pb-0">
        <div className="mx-auto max-w-[1350px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/20 pb-10">
            {/* Left column – Company info */}
            <div className=" w-2/3 sm:w-full flex flex-col justify-top">
              <h2 className="font-['Poppins'] sm:text-center md:text-left text-[40px] font-bold text-white mb-2">
                Prestige Home Guard
              </h2>
              <p className="font-['Poppins'] sm:text-center md:text-left text-[15px] leading-relaxed text-white/70 mb-6">
                Prestige Home Guard provides trusted home warranty services,
                ensuring hassle-free repairs, replacements, and protection for
                essential home systems and appliances.
              </p>
            </div>

            {/* Right column – Useful Links + Logo */}
            <div className="flex w-3/3 flex-col md:flex-row md:justify-between">
              {/* Useful Links */}
              <div className="flex-1">
                <h3 className="font-['Montserrat'] text-[18px] font-semibold uppercase text-white mb-4 text-center md:text-left">
                  Useful Links
                </h3>
                <ul className="space-y-3 text-center md:text-left">
                  {usefulLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-['Poppins'] text-[15px] text-white/70 hover:text-[#2C75BA] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* PHG White Logo – mobile only (hidden on desktop) */}
                <div className="mt-8 block md:hidden">
                  <img
                    src="https://prestigehomeguard.com/wp-content/uploads/2025/01/PHG-White-Logo-.svg"
                    alt="Prestige Home Guard"
                    className="mx-auto h-16 w-auto"
                  />
                </div>
              </div>

              {/* PHG White Logo – desktop only (hidden on mobile) */}
              <div className="hidden md:flex items-center ml-8">
                <img
                  src="https://prestigehomeguard.com/wp-content/uploads/2025/01/PHG-White-Logo-.svg"
                  alt="Prestige Home Guard"
                  className="h-20 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-['Poppins'] text-[15px] text-center text-white p-4">
            Copyright © 2025 Prestige Home Guard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
