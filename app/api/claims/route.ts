// app/api/claims/route.ts
import { auth } from "../../auth";
import { NextRequest, NextResponse } from "next/server";
import { zohoRequest } from "@/lib/zoho/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.dealId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { system, issue, lastWorking, tenant, bestPhone, description } = body;

  try {
    const formattedLastWorking = lastWorking
      ? new Date(lastWorking).toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        })
      : "Not provided";

    const fullDescription = `
System: ${system}
Issue: ${issue}
Last Working: ${formattedLastWorking}
Tenant: ${tenant}
Best Phone: ${bestPhone}

Customer Description:
${description}
    `.trim();

    const subject = `${system} - ${issue.substring(0, 50)}`;

    const result = await zohoRequest("/Cases", {
      method: "POST",
      body: JSON.stringify({
        trigger: ["workflow", "approval", "blueprint"],
        data: [
          {
            Related_Policy: session.user.dealId,
            Subject: subject,
            Description: fullDescription,
            Claim_Type: system,
            Status: "Received",
            Case_Origin: "Web",
            Best_Phone: bestPhone,
            Tenant: tenant ? true : false,
            Date_reported: new Date().toISOString().split("T")[0],
          },
        ],
      }),
    });

    return NextResponse.json({ success: true, case: result.data[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
