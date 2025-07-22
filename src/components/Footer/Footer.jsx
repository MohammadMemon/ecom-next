"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useState } from "react";

const footerLinks = [
  {
    title: "Customer Support",
    links: [
      { text: "Privacy Policy", href: "/privacy-policy" },
      { text: "Terms & Conditions", href: "/terms-and-conditions" },
      {
        text: "Shipping & Returns Policy",
        href: "/shipping-and-returns-policy",
      },
      { text: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { text: "Home", href: "/" },
      { text: "Orders", href: "/account/orders" },
      { text: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "About Us", href: "/about-us" },
      { text: "Contact Us", href: "/contact-us" },
      { text: "Categories", href: "/category" },
    ],
  },
];

export default function Footer() {
  const [question, setQuestion] = useState("");

  return (
    <footer className="py-8 text-[#10c0c] border mx-6 my-4 rounded-lg shadow-lg backdrop-blur-md bg-white/30">
      <div className="container max-w-6xl px-4 mx-auto">
        {/* Top section with logo and social icons */}
        <div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">CycleDaddy</span>
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/cycledaddy.in/"
              aria-label="Visit our Instagram page"
              target="_blank"
              className="p-2 border border-black rounded-full bg-primary hover:bg-white hover:border-[#02D866] group"
            >
              <Instagram className="w-5 h-5 text-primary-foreground group-hover:text-[#02D866]" />
            </a>
            <a
              href="https://www.youtube.com/@cycledaddy6477"
              aria-label="Visit our Youtube page"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-black rounded-full bg-primary hover:bg-white hover:border-[#02D866] group"
            >
              <Youtube className="w-5 h-5 text-primary-foreground group-hover:text-[#02D866]" />
            </a>
            <a
              href="https://www.facebook.com/share/16jStX9Bu8/?mibextid=qi2Omg"
              aria-label="Visit our Facebook page"
              target="_blank"
              className="p-2 border border-black rounded-full bg-primary hover:bg-white hover:border-[#02D866] group"
            >
              <Facebook className="w-5 h-5 text-primary-foreground group-hover:text-[#02D866]" />
            </a>
            <a
              href="https://www.linkedin.com/company/cycle-daddy"
              aria-label="Visit our LinkedIn page"
              target="_blank"
              className="p-2 border border-black rounded-full bg-primary hover:bg-white hover:border-[#02D866] group"
            >
              <Linkedin className="w-5 h-5 text-primary-foreground group-hover:text-[#02D866]" />
            </a>
          </div>
        </div>

        <hr className="mb-8 border-gray-800" />

        <div className="grid items-start grid-cols-1 gap-8 mx-auto mb-8 md:grid-cols-[2fr_1fr]">
          <div className="grid grid-cols-1 gap-8 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 md:mx-0">
            {footerLinks.map((section) => (
              <div key={section.title} className="text-center sm:text-left">
                <h3 className="mb-4 text-lg font-semibold sm:text-xl text-[#10c0c]">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.text}>
                      <Link
                        href={link.href}
                        className="text-gray-700 hover:text-[#02D866] text-base sm:text-lg"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center md:pl-8 sm:text-left">
            <h3 className="mb-4 text-lg font-semibold sm:text-xl text-[#10c0c]">
              Newsletter
            </h3>
            <div className="p-4 space-y-4 border rounded-lg bg-primary">
              <div>
                <label className="text-lg text-primary-foreground">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  className="w-full mt-1 text-white border-[#02D866] placeholder:text-gray-500"
                />
              </div>
              <div className="flex items-start gap-2">
                <label htmlFor="email" className="text-sm text-white">
                  By submitting, I agree with{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[#02D866] hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-[#02D866] hover:underline"
                  >
                    Terms of Condition
                  </Link>
                </label>
                <Button className="w-24 bg-[#02D866] text-black border hover:text-white hover:border-white">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>

        <hr className="mb-6 border-gray-800" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-black">
            @CycleDaddy 2021-2025, All rights reserved.
          </p>
          <div className="flex w-full gap-2 md:w-auto">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Have a question? Ask us"
              className="text-black border-[#02D866] placeholder:text-gray-500 w-full md:w-[300px]"
            />
            <Button
              className="bg-[#02D866] text-black border hover:text-white hover:border-white px-6"
              onClick={() => {
                window.open(
                  `https://wa.me/+917977509402?text=${encodeURIComponent(
                    `I have a question about: ${question}`
                  )}`,
                  "_blank"
                );
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
