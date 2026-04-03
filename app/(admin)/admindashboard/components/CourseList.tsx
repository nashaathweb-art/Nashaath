"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Course {
  id: string;
  title: string;
  level: string;
  badge: string;
  duration: string;
  lessons: number;
  color: string;
  light_bg: string;
  border_color: string;
  description: string;
  topics: string[];
  icon: string;
  is_active: boolean;
  plan_name: string;
  plan_price: number;
  plan_duration: string;
  plan_features: string[];
}

interface Props {
  onAddNew: () => void;
}

export default function CourseList({ onAddNew }: Props) {
  const [courses, setCourses]   = useState<Course[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [search, setSearch]     = useState("");

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at");
    if (!error && data) setCourses(data);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course? All lessons and enrollments will also be deleted.")) return;
    setDeleting(id);
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (!error) setCourses(prev => prev.filter(c => c.id !== id));
    setDeleting(null);
  };

  const handleToggleActive = async (course: Course) => {
    setToggling(course.id);
    const { error } = await supabase
      .from("courses")
      .update({ is_active: !course.is_active })
      .eq("id", course.id);
    if (!error) {
      setCourses(prev =>
        prev.map(c => c.id === course.id ? { ...c, is_active: !c.is_active } : c)
      );
    }
    setToggling(null);
  };

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.level?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by title or level…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-stone-200 rounded-sm px-4 py-2 text-sm font-serif text-stone-700 bg-white outline-none focus:border-amber-400 w-72"
        />
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2 bg-amber-700 text-white text-xs tracking-widest uppercase font-serif rounded-sm hover:bg-amber-800 transition-colors">
          ➕ Add Course
        </button>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-md h-48 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-md p-12 text-center text-stone-400 text-sm italic font-serif">
          {search ? "No courses match your search." : "No courses yet. Add your first course."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(course => (
            <div
              key={course.id}
              className="bg-white border border-stone-200 rounded-md overflow-hidden flex flex-col">

              {/* Color strip */}
              <div
                className="h-1"
                style={{ background: course.color }}
              />

              <div className="p-5 flex flex-col flex-1">

                {/* Top row — icon + badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg border"
                    style={{
                      background: course.light_bg,
                      borderColor: course.border_color,
                      color: course.color,
                    }}>
                    {course.icon}
                  </div>

                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggleActive(course)}
                    disabled={toggling === course.id}
                    className={`text-xs px-2.5 py-1 rounded-sm border font-serif tracking-wide transition-colors disabled:opacity-50 ${
                      course.is_active
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100"
                    }`}>
                    {toggling === course.id
                      ? "…"
                      : course.is_active ? "● Active" : "○ Hidden"}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-normal text-stone-800 font-serif mb-0.5">
                  {course.title}
                </h3>

                {/* Level */}
                <div
                  className="text-xs tracking-widest uppercase mb-3 font-serif"
                  style={{ color: course.color }}>
                  {course.level}
                </div>

                {/* Meta row */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <span className="text-xs bg-stone-50 border border-stone-200 rounded-sm px-2.5 py-1 text-stone-500 font-serif">
                    ⏱ {course.duration}
                  </span>
                  <span className="text-xs bg-stone-50 border border-stone-200 rounded-sm px-2.5 py-1 text-stone-500 font-serif">
                    📚 {course.lessons} Classes
                  </span>
                </div>

                {/* Plan info */}
                <div
                  className="rounded-sm border px-3 py-2 mb-4"
                  style={{
                    background: `${course.color}08`,
                    borderColor: `${course.color}30`,
                  }}>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-serif"
                      style={{ color: course.color }}>
                      {course.plan_name ?? "—"}
                    </span>
                    <span
                      className="text-base font-serif"
                      style={{ color: course.color }}>
                      {course.plan_price
                        ? `₹${course.plan_price.toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 italic font-serif mt-0.5">
                    {course.plan_duration ?? ""}
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="text-xs text-stone-400 italic font-serif">
                    {course.topics?.length ?? 0} topics
                  </span>
                  <button
                    onClick={() => handleDelete(course.id)}
                    disabled={deleting === course.id}
                    className="text-xs tracking-widest uppercase font-serif text-rose-400 hover:text-rose-600 transition-colors disabled:opacity-50">
                    {deleting === course.id ? "Deleting…" : "Delete"}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary bar */}
      <div className="bg-white border border-stone-200 rounded-sm px-5 py-3 flex gap-6 flex-wrap">
        <div className="text-xs font-serif text-stone-500">
          Total: <span className="text-stone-800">{courses.length}</span>
        </div>
        <div className="text-xs font-serif text-stone-500">
          Active: <span className="text-emerald-700">{courses.filter(c => c.is_active).length}</span>
        </div>
        <div className="text-xs font-serif text-stone-500">
          Hidden: <span className="text-stone-400">{courses.filter(c => !c.is_active).length}</span>
        </div>
      </div>

    </div>
  );
}