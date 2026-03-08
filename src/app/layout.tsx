import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNFS Foundation | Uncle Nephew Father Son Mentoring Program – Fredericksburg, VA",
  description: "The UNFS Foundation empowers young men through mentorship, leadership development, and brotherhood. Join our annual Father's Day weekend retreat at Wilderness Presidential Resort in Fredericksburg, VA. Register for 2026 today.",
  openGraph: {
    images: ["/social-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/social-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
