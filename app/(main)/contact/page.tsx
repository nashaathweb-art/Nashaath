"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] font-serif pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-700 mb-3">Get in Touch</p>
          <h1 className="text-3xl font-normal text-stone-900 mb-3">Contact Us</h1>
          <div className="w-12 h-[1px] bg-amber-700 mx-auto mb-4" />
          <p className="text-sm text-stone-500 italic">
            We'd love to hear from you. Reach out via any of the channels below.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="space-y-4">

          {/* Phone 1 */}
          <a
            href="tel:+919447903002"
            className="flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-[3px] hover:border-amber-300 hover:bg-amber-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18" className="text-amber-700">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.04 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-0.5">Phone</p>
              <p className="text-sm text-stone-800">+91 94479 03002</p>
            </div>
          </a>

          {/* Phone 2 */}
          <a
            href="tel:+919605664029"
            className="flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-[3px] hover:border-amber-300 hover:bg-amber-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18" className="text-amber-700">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.04 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-0.5">Alternate Phone</p>
              <p className="text-sm text-stone-800">+91 96056 64029</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919447903002"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-[3px] hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
              <svg viewBox="0 0 24 24" fill="#25D366" width="18" height="18">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.535 5.874L.057 23.882a.5.5 0 00.606.61l6.188-1.456A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.681-.498-5.224-1.369l-.374-.214-3.878.913.964-3.768-.235-.386A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-0.5">WhatsApp</p>
              <p className="text-sm text-stone-800">+91 94479 03002</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:Nashathbtq@gmail.com"
            className="flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-[3px] hover:border-amber-300 hover:bg-amber-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18" className="text-amber-700">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-0.5">Email</p>
              <p className="text-sm text-stone-800">Nashathbtq@gmail.com</p>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/nashaathboutique?igsh=YjU0bXltbTN5Ymk="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-[3px] hover:border-pink-300 hover:bg-pink-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-100 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="url(#ig)" strokeWidth="1.8" width="18" height="18">
                <defs>
                  <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433"/>
                    <stop offset="25%" stopColor="#e6683c"/>
                    <stop offset="50%" stopColor="#dc2743"/>
                    <stop offset="75%" stopColor="#cc2366"/>
                    <stop offset="100%" stopColor="#bc1888"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="17.5" cy="6.5" r="1" fill="#dc2743" stroke="none"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-0.5">Instagram</p>
              <p className="text-sm text-stone-800">@nashaathboutique</p>
            </div>
          </a>

        </div>

        {/* Location note */}
        <div className="mt-8 p-5 bg-white border border-stone-200 rounded-[3px] text-center">
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Location</p>
          <p className="text-sm text-stone-700">Kondotty, Kerala, India</p>
        </div>

        {/* Sign off */}
        <p className="mt-10 text-center text-[10px] tracking-[0.2em] text-stone-300 uppercase">
          ✦ Craft Your Future — One Stitch at a Time ✦
        </p>

      </div>
    </div>
  );
}