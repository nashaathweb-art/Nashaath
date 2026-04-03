"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalVideos: number;
}

export default function OverviewCards() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalVideos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [students, courses, enrollments, videos] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalStudents:    students.count    ?? 0,
        totalCourses:     courses.count     ?? 0,
        totalEnrollments: enrollments.count ?? 0,
        totalVideos:      videos.count      ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: "👥",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: "📚",
      color: "text-violet-700",
      bg: "bg-violet-50",
      border: "border-violet-200",
    },
    {
      label: "Total Enrollments",
      value: stats.totalEnrollments,
      icon: "📋",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      label: "Total Videos",
      value: stats.totalVideos,
      icon: "🎬",
      color: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-stone-200 rounded-md p-6 animate-pulse">
            <div className="h-4 bg-stone-100 rounded mb-4 w-24" />
            <div className="h-8 bg-stone-100 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map(card => (
        <div
          key={card.label}
          className={`bg-white border ${card.border} rounded-md overflow-hidden`}>

          {/* Top color strip */}
          <div className={`h-1 ${card.bg}`} />

          <div className="p-6">
            {/* Icon + label */}
            <div className="flex items-center justify-between mb-4">
              <div className={`text-xs tracking-widest uppercase ${card.color} font-serif`}>
                {card.label}
              </div>
              <div className={`w-9 h-9 rounded-full ${card.bg} border ${card.border} flex items-center justify-center text-base`}>
                {card.icon}
              </div>
            </div>

            {/* Value */}
            <div className={`text-4xl font-normal ${card.color} tracking-tight font-serif`}>
              {card.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}