// Server-side check of a "I'm not a robot" answer. Each answer can be used once.
export async function verifyRecaptcha(token: unknown): Promise<boolean> {
  if (typeof token !== "string" || !token) return false;
  try {
    // The secret goes in the request body, not the address.
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY ?? "",
        response: token,
      }),
    });
    const result = await response.json();
    return result?.success === true;
  } catch {
    console.error("reCAPTCHA check could not be completed");
    return false;
  }
}
