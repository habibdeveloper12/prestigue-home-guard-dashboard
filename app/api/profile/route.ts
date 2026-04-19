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
    dealId,
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

  if (dealId !== session.user.dealId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const deal = await getDealById(dealId);
    if (!deal?.Contact_Name?.id) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Update Contact
    const updatedContact = await updateContact(deal.Contact_Name.id, {
      Email: email,
      Phone: homePhone,
      Home_Phone: workPhone,
      Mailing_Street: mailingAddress,
      Mailing_City: mailingCity,
      Mailing_State: mailingState,
      Mailing_Zip: mailingZip,
    });

    // Update Deal fields
    const updatedDeal = await updateDeal(dealId, {
      Coverage_Address: coverageAddress,
      Coverage_Address_City_Postcode: coverageAddressCityZip,
    });

    return NextResponse.json({
      success: true,
      contact: updatedContact,
      deal: updatedDeal,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
