import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import { findDealsByEmail, updateDeal } from "@/lib/zoho/deals";
import { cleanEmail } from "@/lib/validate";
import { verifyRecaptcha } from "@/lib/recaptcha";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const recaptchaToken = body?.recaptchaToken;
    const email = cleanEmail(body?.email);

    if (!body?.email || !recaptchaToken) {
      return NextResponse.json(
        { error: "Email and reCAPTCHA are required." },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // 1. Verify reCAPTCHA
    if (!(await verifyRecaptcha(recaptchaToken))) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 },
      );
    }

    // 2. Look up and send after replying, so the answer is the same (and as fast)
    //    whether or not the email address has a policy.
    after(() => sendPolicyNumbers(email));

    return NextResponse.json({ success: true });
  } catch {
    console.error("Retrieve policy request failed");
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

async function sendPolicyNumbers(email: string) {
  try {
    const deals = await findDealsByEmail(email);
    const policies = deals
      .map((deal) => deal.Policy_Number)
      .filter(Boolean)
      .join(", ");
    if (!policies) return;

    const { error } = await resend.emails.send({
      from: "Prestige Home Guard <noreply@prestigehomeguard.com>",
      to: [email],
      subject: "Your Policy Number",
      html: buildEmailTemplate(email, policies),
    });
    if (error) console.error("Policy number email was not sent");

    // Bump the Forget_Id_Req_Count counter on each matching deal
    await Promise.all(
      deals.map((deal) =>
        updateDeal(deal.id, {
          Forget_Id_Req_Count: (Number(deal.Forget_Id_Req_Count) || 0) + 1,
        }),
      ),
    );
  } catch {
    console.error("Policy number lookup failed");
  }
}

// Professional HTML email template
function buildEmailTemplate(
  customerEmail: string,
  policyNumbers: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Policy Number</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <!-- Header with Logo -->
        <tr>
          <td class="" style="margin: 5px 0 0 0; padding: 20px 20px; text-align: center;">
            <img src="https://prestigehomeguard.com/wp-content/uploads/2025/01/BHG-Logo.png" alt="Prestige Home Guard" style="height: 60px; width: auto; display: block; margin: 0 auto;" />
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h1 style="color: #0A2D53; font-size: 24px; margin-top: 0;">Hello,</h1>
            <p style="color: #333333; font-size: 16px; line-height: 1.5;">
              You recently requested your policy number from the Prestige Home Guard Customer Portal.
            </p>

            <!-- Policy Number Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #F0F4F8; border-left: 4px solid #0A2D53;">
              <tr>
                <td style="padding: 20px;">
                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #555555;">YOUR POLICY NUMBER</p>
                  <p style="margin: 0; font-size: 28px; font-weight: bold; color: #0A2D53; letter-spacing: 1px;">${policyNumbers}</p>
                </td>
              </tr>
            </table>

            <p style="color: #333333; font-size: 16px; line-height: 1.5;">
              Use this policy number to sign in to your account at<br>
              <a href="https://my.prestigehomeguard.com/login" style="color: #0A2D53; text-decoration: underline; font-weight: bold;">my.prestigehomeguard.com</a>
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5;">
              If you did not request this information, please disregard this email or contact our support team.
            </p>
          </td>
        </tr>

   
        <tr>
          <td style="border-top: 1px solid #E0E0E0;"></td>
        </tr>

        <!-- Footer with Contact Details -->
        <tr>
          <td style="padding: 30px 20px; background-color: #FAFAFA;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #777777; text-align: center;">
              Need help? Contact us
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
              <tr>
                <td style="text-align: center; padding-bottom: 10px;">
                  <a href="tel:+18889706181" style="color: #0A2D53; text-decoration: none; font-size: 18px; font-weight: bold;">(888) 970-6181</a>
                </td>
              </tr>
              <tr>
                <td style="text-align: center;">
                  <a href="mailto:info@prestigehomeguard.com" style="color: #0A2D53; text-decoration: none; font-size: 14px;">info@prestigehomeguard.com</a>
                </td>
              </tr>
            </table>
            <p style="margin: 0; font-size: 12px; color: #999999; text-align: center;">
              Prestige Home Guard<br />
              2035 Lincoln Hwy, Edison, NJ 08817<br />
              © ${new Date().getFullYear()} Prestige Home Guard. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
