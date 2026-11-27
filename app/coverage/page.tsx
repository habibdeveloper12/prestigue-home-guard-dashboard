import { redirect } from "next/navigation";
import { ExternalLink, Phone, Shield, ShieldPlus, Wrench } from "lucide-react";
import { auth } from "../auth";
import { getDealById } from "@/lib/zoho/deals";
import { formatMoney } from "@/lib/format";
import { planName } from "@/lib/plans";
import CoverageModalContent from "../components/CoverageModalContent";

export default async function CoveragePage() {
  const session = await auth();
  if (!session?.user?.dealId) redirect("/login");

  // Same record the dashboard shows. No coverage terms are written here: the website and the customer's contract hold them.
  const deal = (await getDealById(session.user.dealId)) as
    | { Plan_Type?: string; Optional_Coverage?: string[]; SCF?: number }
    | null;
  if (!deal) return <div className="p-8 text-center">Contract not found.</div>;

  const summary = [
    { label: "Coverage Plan", value: planName(deal.Plan_Type), icon: Shield },
    { label: "Optional Coverage", value: deal.Optional_Coverage?.join(", ") || "None", icon: ShieldPlus },
    { label: "Service Call Fee", value: deal.SCF ? formatMoney(deal.SCF) : "N/A", icon: Wrench },
  ];

  return (
    <div className="phg-page max-w-6xl space-y-6">
      <div>
        <h1 className="phg-h1">My Coverage</h1>
        <p className="phg-sub-text">Your plan at a glance. Coverage depends on your plan and its terms.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="phg-card flex items-center gap-4 p-5">
              <span className="phg-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="phg-label">{item.label}</p>
                <p className="break-words text-lg font-semibold text-[#082D53]">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <section className="phg-card p-6" aria-labelledby="covered-heading">
        <h2 id="covered-heading" className="phg-title mb-4">What&rsquo;s Covered</h2>
        <CoverageModalContent plan={deal.Plan_Type} optionalCoverage={deal.Optional_Coverage} />
      </section>

      <section className="phg-card p-6">
        <h2 className="phg-title">Learn about coverage</h2>
        <p className="mt-1 text-sm text-gray-600">
          See what our plans cover, or compare plans on our website.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a className="phg-button phg-button-gold" href="https://prestigehomeguard.com/whats-covered-2/" target="_blank" rel="noopener">
            What&rsquo;s Covered <ExternalLink size={16} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a className="phg-button phg-button-outline" href="https://prestigehomeguard.com/plans-pricing/" target="_blank" rel="noopener">
            Plans &amp; Pricing <ExternalLink size={16} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </section>

      <section className="phg-card flex flex-wrap items-center gap-4 p-6">
        <span className="phg-icon">
          <Phone size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 className="phg-title">Questions about your coverage?</h2>
          <p className="text-sm text-gray-600">
            Call customer service 24/7 at{" "}
            <a href="tel:+18889706181" className="whitespace-nowrap font-semibold text-[#082D53]">(888) 970-6181</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
