"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Section } from "../page";

interface Props {
  active: Section;
  onNavigate: (section: Section) => void;
}

const navItems = [
  {
    group: "Main",
    items: [
      { id: "overview", label: "Overview", icon: "📊" },
    ],
  },
  {
    group: "Students",
    items: [
      { id: "students",    label: "All Students", icon: "👥" },
      { id: "add-student", label: "Add Student",  icon: "➕" },
    ],
  },
  {
    group: "Videos",
    items: [
      { id: "videos",    label: "All Videos", icon: "🎬" },
      { id: "add-video", label: "Add Video",  icon: "➕" },
    ],
  },
  {
    group: "Courses",
    items: [
      { id: "courses",    label: "All Courses", icon: "📚" },
      { id: "add-course", label: "Add Course",  icon: "➕" },
    ],
  },
];

export default function AdminSidebar({ active, onNavigate }: Props) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  return (
    <div className="w-60 min-h-screen bg-stone-950 flex flex-col flex-shrink-0 font-serif">

      {/* Top strip */}

      {/* Logo */}
      <div className="px-6 pt-7 pb-6 border-b border-stone-900">
        <div className="text-xl text-amber-700 mb-1">✦</div>
        <div className="text-xs tracking-widest uppercase text-amber-700">
          Admin Panel
        </div>
        <div className="text-sm text-stone-500 mt-1 italic">
          Stitching Excellence
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(group => (
          <div key={group.group} className="mb-2">

            {/* Group label */}
            <div className="text-xs tracking-widest uppercase text-stone-700 px-6 py-2">
              {group.group}
            </div>

            {/* Items */}
            {group.items.map(item => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as Section)}
                  className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-serif text-left transition-all border-l-4 
                    ${isActive
                      ? "bg-stone-900 border-amber-700 text-amber-700"
                      : "border-transparent text-stone-500 hover:bg-stone-900 hover:text-stone-300"
                    }`}>
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-stone-900">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent border border-stone-800 rounded-sm text-stone-500 text-xs tracking-widest uppercase font-serif hover:border-stone-600 hover:text-stone-300 transition-all">
          🚪 Sign Out
        </button>
      </div>

    </div>
  );
}