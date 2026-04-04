"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.535 5.874L.057 23.882a.5.5 0 00.606.61l6.188-1.456A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.681-.498-5.224-1.369l-.374-.214-3.878.913.964-3.768-.235-.386A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

const socials = [
  { label: "Facebook",  href: "#", icon: <FacebookIcon /> },
  { label: "Instagram", href: "#", icon: <InstagramIcon /> },
  { label: "WhatsApp",  href: "#", icon: <WhatsAppIcon /> },
  { label: "YouTube",   href: "#", icon: <YoutubeIcon /> },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-stone-200 font-serif">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 hover:opacity-80 transition-opacity">
              <Image src="/images/logo.png" alt="Nashaath Boutique" width={200} height={200} className="rounded-sm object-contain" />
            </Link>
            <p className="text-xs italic text-stone-500 leading-relaxed mb-5">
              Rooted in the heritage of Kondotty, Kerala — crafting custom-made attire for women and children with love and precision.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-[2px] bg-stone-100 text-stone-500 hover:bg-amber-50 hover:text-amber-700 border border-stone-200 hover:border-amber-200 transition-colors"
                >
                  {icon}
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
                { label: "About Us",     href: "/about"       },
                { label: "Our Story",    href: "/about"       },
                { label: "Collections",  href: "/collections" },
                { label: "Testimonials", href: "#"            },
                { label: "Careers",      href: "#"            },
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

        {/* Divider */}
        <div className="mt-12 mb-6 h-[1px] bg-stone-200" />

        {/* Bottom row */}
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
            <a href="tel:+919876543210" className="text-[11px] font-normal text-amber-700 hover:text-amber-800 transition-colors tracking-wide">
              +91 98765 43210
            </a>
          </div>
        </div>

        {/* Sign-off */}
        <p className="mt-6 text-center text-[11px] tracking-[0.2em] text-stone-300 uppercase">
          ✦ Craft Your Future — One Stitch at a Time ✦
        </p>

        {/* Powered by Kalkus */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-stone-300">Powered by</span>
          <Link href="https://kalkus.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
            <Image
              src="/images/kalkus_logo.png"
              alt="Kalkus"
              width={80}
              height={20}
              className="object-contain"
            />
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;