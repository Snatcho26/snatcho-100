import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snatcho India",
  description: "Join the waitlist for Snatcho – the next-gen platform 🚀",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
