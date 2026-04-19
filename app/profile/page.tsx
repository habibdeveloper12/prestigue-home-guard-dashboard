// app/profile/page.tsx
import { auth } from "../../app/auth";
import { redirect } from "next/navigation";
import { getDealById } from "@/lib/zoho/deals";
import { getContactById } from "@/lib/zoho/contacts";
import ProfileForm from "../../app/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.dealId) {
    redirect("/login");
  }

  // Fetch the deal (contract) for the logged‑in user
  const deal = await getDealById(session.user.dealId);
  if (!deal) {
    return <div className="p-8 text-center">Contract not found</div>;
  }

  // Fetch the associated contact details
  let contact = null;
  if (deal.Contact_Name?.id) {
    contact = await getContactById(deal.Contact_Name.id);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your contact information and address details.
          </p>
        </div>

        <ProfileForm
          policyNumber={deal.Policy_Number}
          contact={contact}
          dealId={deal.id}
          deal={deal}
        />
      </div>
    </div>
  );
}
