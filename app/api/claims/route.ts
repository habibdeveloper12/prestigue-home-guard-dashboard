import { auth } from "../../auth";
import { NextRequest, NextResponse } from "next/server";
import { zohoRequest } from "@/lib/zoho/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.dealId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const result = await zohoRequest("/Cases", {
      method: "POST",
      body: JSON.stringify({
        data: [
          {
            Deal_Name: session.user.dealId, // link to the deal
            Subject: body.system, // or body.issue
            Description: body.description,
            Status: "Pending",
            // Map other fields as needed
          },
        ],
      }),
    });

    return NextResponse.json({ success: true, case: result.data[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
