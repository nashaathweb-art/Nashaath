"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, User, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface UserData {
  id: string;
  email: string | undefined;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn]             = useState(false);
  const [isDropdownOpen, setIsDropdownOpen]     = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser]                         = useState<UserData | null>(null);
  const [scrolled, setScrolled]                 = useState(false);
  const dropdownRef                             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getDisplayName = (u: any) =>
    u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "User";

  const getAvatarUrl = (u: any) =>
    u.user_metadata?.avatar_url || u.user_metadata?.picture || null;

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();
    return data?.full_name ?? null;
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const full_name = await fetchProfile(session.user.id);
        setIsLoggedIn(true);
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: getDisplayName(session.user),
          full_name,
          avatar_url: getAvatarUrl(session.user),
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (!mounted) return;
      if (session?.user) {
        const full_name = await fetchProfile(session.user.id);
        setIsLoggedIn(true);
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: getDisplayName(session.user),
          full_name,
          avatar_url: getAvatarUrl(session.user),
        });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
  setIsLoggedIn(false);
  setUser(null);
  setIsDropdownOpen(false);
  setIsMobileMenuOpen(false);
  
  await supabase.auth.signOut(); // remove scope: "local"
  
  // clear all supabase keys from localStorage
  Object.keys(localStorage)
    .filter(k => k.startsWith("sb-"))
    .forEach(k => localStorage.removeItem(k));

  window.location.href = "/";
};

  const navLinks = [
    { href: "/",         label: "Home"    },
    { href: "/courses",  label: "Courses" },
    { href: "/about",    label: "About"   },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className={`p-5 fixed top-0 left-0 right-0 w-full bg-[#FAFAF8] z-50 font-serif transition-all duration-300 ${scrolled ? "shadow-sm border-b border-stone-200" : "border-b border-transparent"}`}>

      {/* Top colour strip */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="Nashaath Boutique"
              width={106}
              height={106}
              className="rounded-sm object-contain"
            />
            {/* <div>
              <span className="text-base font-normal tracking-wide text-stone-900">Nashaath</span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-amber-700 leading-none">Boutique</span>
            </div> */}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-[11px] uppercase tracking-[0.18em] text-stone-500 hover:text-amber-700 transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-[4px] hover:border-amber-300 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center overflow-hidden">
                    {user.avatar_url
                      ? <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                      : <User className="h-3.5 w-3.5 text-amber-700" />}
                  </div>
                  <span className="text-[11px] tracking-wide text-stone-700 uppercase">
                    {user.full_name || user.username}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-stone-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-stone-200 rounded-[4px] shadow-md py-1 z-50">
                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-wide text-stone-600 hover:bg-stone-50 uppercase">
                      <User className="h-3.5 w-3.5" /> Profile
                    </Link>
                    <Link href="/classes" onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-wide text-stone-600 hover:bg-stone-50 uppercase">
                      ◈ My Courses
                    </Link>
                    <hr className="my-1 border-stone-100" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-wide text-red-600 hover:bg-red-50 uppercase">
                      <X className="h-3.5 w-3.5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/sign-in"
                  className="text-[11px] uppercase tracking-[0.18em] text-stone-600 hover:text-amber-700 px-4 py-2 transition-colors">
                  Sign In
                </Link>
                <Link href="/courses"
                  className="text-[11px] uppercase tracking-[0.18em] text-white bg-amber-700 hover:bg-amber-800 px-5 py-2.5 rounded-[2px] transition-colors">
                  Enroll Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-amber-700 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAFAF8] border-t border-stone-200">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-[2px] transition-colors">
                {label}
              </Link>
            ))}

            <div className="border-t border-stone-200 pt-4 mt-2">
              {isLoggedIn && user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-[4px] mb-3">
                    <div className="h-9 w-9 rounded-full bg-white border border-amber-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user.avatar_url
                        ? <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        : <User className="h-4 w-4 text-amber-700" />}
                    </div>
                    <div>
                      <p className="text-xs font-normal text-stone-800 tracking-wide">
                        {user.full_name || user.username}
                      </p>
                      <p className="text-[10px] text-stone-400">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-[11px] uppercase tracking-wide text-stone-600 hover:bg-stone-50 rounded-[2px]">
                    <User className="h-3.5 w-3.5" /> Profile
                  </Link>
                  <Link href="/classes" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-[11px] uppercase tracking-wide text-stone-600 hover:bg-stone-50 rounded-[2px]">
                    ◈ My Courses
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[11px] uppercase tracking-wide text-red-600 hover:bg-red-50 rounded-[2px]">
                    <X className="h-3.5 w-3.5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center text-[11px] uppercase tracking-[0.18em] text-amber-700 border border-amber-300 px-4 py-3 rounded-[2px] hover:bg-amber-50 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center text-[11px] uppercase tracking-[0.18em] text-white bg-amber-700 hover:bg-amber-800 px-4 py-3 rounded-[2px] transition-colors">
                    Enroll Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}