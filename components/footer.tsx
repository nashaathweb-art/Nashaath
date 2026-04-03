"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-stone-200 font-serif">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="Nashaath Boutique" width={34} height={34} className="rounded-sm object-contain" />
              <div>
                <span className="text-base font-normal tracking-wide text-stone-900">Nashaath</span>
                <span className="block text-[9px] uppercase tracking-[0.25em] text-amber-700 leading-none">Boutique</span>
              </div>
            </Link>
            <p className="text-xs italic text-stone-500 leading-relaxed mb-5">
              Rooted in the heritage of Kondotty, Kerala — crafting custom-made attire for women and children with love and precision.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Facebook", "Instagram", "WhatsApp", "YouTube"].map((s) => (
                <Link key={s} href="#"
                  className="px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-[2px] bg-stone-100 text-stone-500 hover:bg-amber-50 hover:text-amber-700 border border-stone-200 hover:border-amber-200 transition-colors">
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-5">Courses</h3>
            <ul className="space-y-3">
              {[
                { label: "Master Tailoring",   href: "/courses" },
                { label: "Standard Tailoring", href: "/courses" },
                { label: "Beginner Course",    href: "/courses" },
                { label: "Blouse Mastery",     href: "/courses" },
                { label: "Churidar Styles",    href: "/courses" },
                { label: "View All Courses",   href: "/courses" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-stone-500 hover:text-amber-700 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-5">Support</h3>
            <ul className="space-y-3">
              {[
                { label: "How It Works",    href: "#" },
                { label: "Enrolment Guide", href: "#" },
                { label: "Fitting Process", href: "#" },
                { label: "Contact Us",      href: "/#contact" },
                { label: "WhatsApp Us",     href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-stone-500 hover:text-amber-700 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-5">Boutique</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us",      href: "/about"   },
                { label: "Our Story",     href: "/about"   },
                { label: "Collections",   href: "/collections" },
                { label: "Testimonials",  href: "#"        },
                { label: "Careers",       href: "#"        },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-stone-500 hover:text-amber-700 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider strip */}
        <div className="mt-12 mb-6 h-[1px] bg-stone-200" />

        {/* Bottom */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span className="text-[11px] text-stone-400">© 2025 Nashaath Boutique, Kondotty. All rights reserved.</span>
            <div className="flex gap-4">
              {["Privacy Policy", "Terms of Use"].map((link) => (
                <Link key={link} href="#" className="text-[11px] text-stone-400 hover:text-amber-700 transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-stone-400">✦ 24×7 Support</span>
            <a href="tel:+919876543210"
              className="text-[11px] font-normal text-amber-700 hover:text-amber-800 transition-colors tracking-wide">
              +91 98765 43210
            </a>
          </div>
        </div>

        {/* Sign-off */}
        <p className="mt-6 text-center text-[11px] tracking-[0.2em] text-stone-300 uppercase">
          ✦ Craft Your Future — One Stitch at a Time ✦
        </p>

      </div>
    </footer>
  );
};

export default Footer;