import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cycledaddy",
  description: "Website description",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/icon-light.png",
        href: "/icon-light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/icon.png",
        href: "/icon-dark.png",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primary-foreground`}
      >
        <div className="layout-container">
          <Navbar />
          <main className="flex-1 pt-[80px]">
            <Suspense fallback={<div className="min-h-[100vh]" />}>
              {children}
            </Suspense>
          </main>
          <Footer />
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
