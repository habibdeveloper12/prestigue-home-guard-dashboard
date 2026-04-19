import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, recaptchaToken } = await request.json();

  // Verify reCAPTCHA token with Google
  const verificationRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    },
  );

  const verificationData = await verificationRes.json();

  if (!verificationData.success) {
    return NextResponse.json(
      { error: "reCAPTCHA verification failed" },
      { status: 400 },
    );
  }

  // TODO: Look up policy by email and send it via email service
  // (e.g., Resend, SendGrid, Nodemailer)

  return NextResponse.json({ success: true });
}
