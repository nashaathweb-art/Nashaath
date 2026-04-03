"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Enrollment {
  id: string;
  enrolled_at: string;
  profiles: {
    full_name: string;
    phone: string;
  };
  courses: {
    title: string;
    color: string;
    level: string;
  };
}

export default function RecentEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          id,
          enrolled_at,
          profiles ( full_name, phone ),
          courses  ( title, color, level )
        `)
        .order("enrolled_at", { ascending: false })
        .limit(8);

      if (!error && data) setEnrollments(data as any);
      setLoading(false);
    };
    fetchEnrollments();
  }, []);

  return (
    <div className="bg-white border border-stone-200 rounded-md overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <div className="text-xs tracking-widest uppercase text-amber-700 mb-0.5 font-serif">
            Recent Activity
          </div>
          <h2 className="text-base font-normal text-stone-800 font-serif">
            Recent Enrollments
          </h2>
        </div>
        <div className="text-xl text-amber-700">✦</div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-stone-50 rounded animate-pulse" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="p-12 text-center text-stone-400 text-sm italic font-serif">
          No enrollments yet.
        </div>
      ) : (

        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full font-serif">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">
                  Student
                </th>
                <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">
                  Phone
                </th>
                <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">
                  Course
                </th>
                <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">
                  Level
                </th>
                <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">
                  Enrolled
                </th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e, i) => (
                <tr
                  key={e.id}
                  className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-stone-50/50"}`}>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-xs text-amber-700">
                        {e.profiles?.full_name?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                      <span className="text-sm text-stone-700">
                        {e.profiles?.full_name ?? "—"}
                      </span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {e.profiles?.phone ?? "—"}
                  </td>

                  {/* Course */}
                  <td className="px-6 py-4">
                    <span
                      className="text-xs tracking-wide px-2.5 py-1 rounded-sm border font-serif"
                      style={{ color: e.courses?.color, background: `${e.courses?.color}15`, borderColor: `${e.courses?.color}40` }}>
                      {e.courses?.title ?? "—"}
                    </span>
                  </td>

                  {/* Level */}
                  <td className="px-6 py-4 text-sm text-stone-500 italic">
                    {e.courses?.level ?? "—"}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-stone-400">
                    {new Date(e.enrolled_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}