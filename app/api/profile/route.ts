// app/api/profile/route.ts
import { auth } from "../../../app/auth";
import { NextRequest, NextResponse } from "next/server";
import { getDealById, updateDeal } from "@/lib/zoho/deals";
import { updateContact } from "@/lib/zoho/contacts";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.dealId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    email,
    homePhone,
    workPhone,
    mailingAddress,
    mailingCity,
    mailingState,
    mailingZip,
    coverageAddress,
    coverageAddressCityZip,
  } = body;

  // The record to update always comes from the signed-in session, never from the browser.
  const dealId = session.user.dealId;

  try {
    const deal = await getDealById(dealId);
    if (!deal?.Contact_Name?.id) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Update Contact
    await updateContact(deal.Contact_Name.id, {
      Email: email,
      Phone: homePhone,
      Home_Phone: workPhone,
      Mailing_Street: mailingAddress,
      Mailing_City: mailingCity,
      Mailing_State: mailingState,
      Mailing_Zip: mailingZip,
    });

    // Update Deal fields
    await updateDeal(dealId, {
      Coverage_Address: coverageAddress,
      Coverage_Address_City_Postcode: coverageAddressCityZip,
    });

    return NextResponse.json({ success: true });
  } catch {
    console.error("Profile update failed");
    return NextResponse.json({ error: "We couldn't update your profile." }, { status: 500 });
  }
}
