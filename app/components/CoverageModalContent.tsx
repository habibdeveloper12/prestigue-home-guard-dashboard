import { planItems, planName } from "@/lib/plans";

interface CoverageListProps {
  plan?: string | null;
  optionalCoverage?: string[] | null;
}

// Shows only what belongs to the customer's own plan, plus any optional coverage on their record.
export default function CoverageModalContent({ plan, optionalCoverage }: CoverageListProps) {
  const items = planItems(plan);
  const name = planName(plan);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-800">
          {items ? `Your ${name} Plan` : "Your Plan"}
        </h3>
        {items ? (
          <ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-2 py-1">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#FFC947]" aria-hidden="true"></span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">
            Please call customer service at{" "}
            <a href="tel:+18889706181" className="whitespace-nowrap font-semibold text-[#082D53]">(888) 970-6181</a>{" "}
            for your coverage details.
          </p>
        )}
      </div>

      {!!optionalCoverage?.length && (
        <div>
          <h3 className="mb-3 text-lg font-medium text-gray-800">Your Optional Coverage</h3>
          <ul className="rounded-lg bg-blue-50 p-4">
            {optionalCoverage.map((item) => (
              <li key={item} className="py-1 text-gray-800">{item}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-gray-600">Coverage depends on your plan and its terms.</p>
    </div>
  );
}
