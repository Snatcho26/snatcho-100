import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// connect to supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // we can use anon since inserts are client-allowed
);

// connect to resend
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

    // 1️⃣ Save to Supabase waitlist
    const { error } = await supabase.from("waitlist").insert({
      email,
      name,
      source: "landing_v1",
      consent: true,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return res.status(500).json({ message: "Database save failed", error: error.message });
    }

    // 2️⃣ Send welcome email
    await resend.emails.send({
      from: "Snatcho <hello@snatchoindia.com>", // ✅ verified domain
      to: email, // ✅ goes to the person signing up
      subject: "Welcome to Snatcho 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px; background:#f9f9f9;">
          <h2 style="color:#333;">Hey ${name},</h2>
          <p>Thanks for joining the <b>Snatcho waitlist</b> 🚀</p>
          <p>You’ll be the first to know when we launch exclusive student deals & discounts.</p>
          <br/>
          <p style="color:#555;">— Team Snatcho</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "User saved + email sent ✅" });
  } catch (error: any) {
    console.error("Send-email error:", error);
    return res.status(500).json({ message: "Failed to process", error: error.message });
  }
}
