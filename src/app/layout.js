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
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({ params }) {
  return {
    title: {
      default: "CycleDaddy - Premium Bicycles & Accessories",
      template: "%s | CycleDaddy",
    },
    description:
      "India's top bicycle store offering premium bikes, cycling gear, and accessories. Free shipping above ₹5000 across India. 100% genuine products.",
    metadataBase: new URL("https://cycledaddy.in"),
    keywords: [
      "premium bicycles",
      "cycling accessories",
      "mountain bikes India",
      "road bikes online",
      "bicycle delivery India",
      "cycling gear",
      "best bicycles online",
      "bike shop near me",
      "cycle store India",
    ],

    openGraph: {
      title: "CycleDaddy - Premium Bicycles & Accessories",
      description:
        "India's #1 online bicycle store with 100+ premium brands. Free shipping above ₹5000 & easy returns on defective products.",
      url: "https://cycledaddy.in",
      siteName: "CycleDaddy",
      images: [
        {
          url: "/banner.jpg",
          width: 1200,
          height: 630,
          alt: "CycleDaddy - Premium Bicycles & Accessories Collection",
        },
        {
          url: "/social-banner.jpg",
          width: 800,
          height: 600,
          alt: "CycleDaddy - Cycling Accessories",
        },
      ],
      type: "website",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title: "CycleDaddy - Premium Bicycles & Accessories",
      description:
        "Shop top-quality cycling accessories & premium bicycles online — free shipping over ₹5000 across India.",
      images: ["/social-banner.jpg"],
      site: "@CycleDaddy_IN",
      creator: "@CycleDaddy_IN",
    },

    alternates: {
      canonical: "/",
    },

    icons: {
      icon: [
        { url: "/icon-light.png", media: "(prefers-color-scheme: light)" },
        { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
      ],
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    verification: {
      google: process.env.GOOGLE_SEARCH_CONSOLE_KEY,
    },
  };
}

// Organization Schema for Rich Snippets
const OrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "SportsStore",
  name: "CycleDaddy",
  url: "https://cycledaddy.in",
  logo: "https://cycledaddy.in/logo.png",
  description: "India's premium online bicycle and cycling accessories store",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Malad",
    addressLocality: "Mumbai",
    postalCode: "400064",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-7977509402",
    contactType: "Customer service",
  },
  sameAs: [
    "https://www.facebook.com/share/16jStX9Bu8/?mibextid=qi2Omg",
    "https://www.youtube.com/@cycledaddy6477",
    "https://www.instagram.com/cycledaddy.in/",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className="h-full">
      <head>
        <link rel="preload" href="/1.webp" as="image" fetchPriority="high" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(OrganizationSchema),
          }}
        />
      </head>
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
