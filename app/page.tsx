"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const subscribe = async () => {
    setStatus("Adding you to the waitlist...");

    const { error } = await supabase
      .from("waitlist")
      .insert([{ email, name }]);

    if (!error) {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      setStatus("🎉 You're on the list! Check your inbox for a welcome email.");
      setEmail("");
      setName("");
    } else {
      setStatus("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to Snatcho 🚀</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Join our waitlist and be the first to know when we launch.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded-lg w-full mb-4"
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg w-full mb-4"
        />
        <button
          onClick={subscribe}
          className="bg-purple-600 text-white px-5 py-3 rounded-lg w-full font-semibold hover:bg-purple-700 transition"
        >
          Join Waitlist
        </button>

        {status && (
          <p className="text-center text-sm mt-4 text-gray-700">{status}</p>
        )}
      </div>
    </main>
  );
}
