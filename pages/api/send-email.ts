import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Missing email or name" });
    }

    await resend.emails.send({
      from: "Snatcho <hello@snatchoindia.com>",
      to: email,
      subject: "Welcome to Snatcho 🎉",
      html: `<p>Hey ${name},</p>
             <p>Thanks for joining the Snatcho waitlist! 🚀</p>
             <p>You’ll be the first to know when we launch exclusive student deals and discounts.</p>
             <p>- Team Snatcho</p>`,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Email send error:", error);
    return res.status(500).json({ message: "Failed to send email", error: error.message });
  }
}
