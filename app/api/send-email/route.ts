import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_FROM, name: "Snatcho" },
        to: [{ email, name }],
        subject: "Welcome to Snatcho 🎉",
        htmlContent: `
          <h2>Hey ${name || "there"} 👋</h2>
          <p>Thanks for joining the Snatcho waitlist! 🚀</p>
          <p>You’ll be the first to know when we launch.</p>
          <p>– Team Snatcho ⚡</p>
        `,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
