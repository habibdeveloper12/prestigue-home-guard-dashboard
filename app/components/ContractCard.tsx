import Link from "next/link";
import { Phone, UserRound } from "lucide-react";

// Help panel shown under the contract details.
export default function ContractCard() {
  return (
    <section className="phg-card flex flex-wrap items-center justify-between gap-4 p-6">
      <div className="flex min-w-0 items-center gap-4">
        <span className="phg-icon">
          <Phone size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 className="phg-title">Need help?</h2>
          <p className="text-sm text-[#5C697A]">
            Call customer service 24/7 at{" "}
            <a href="tel:+18889706181" className="font-semibold text-[#082D53] whitespace-nowrap">
              (888) 970-6181
            </a>
            .
          </p>
        </div>
      </div>
      <Link href="/profile" className="phg-button phg-button-outline">
        <UserRound size={18} aria-hidden="true" />
        View My Profile
      </Link>
    </section>
  );
}
