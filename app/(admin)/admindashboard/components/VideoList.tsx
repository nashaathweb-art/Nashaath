"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Course {
  title: string;
  color: string;
}

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  duration: string | null;
  order_no: number;
  created_at: string;
  courses: Course | null;
}

interface Props {
  onAddNew: () => void;
}

export default function VideoList({ onAddNew }: Props) {
  const [lessons, setLessons]   = useState<Lesson[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch]     = useState("");

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select(`
        id,
        title,
        video_url,
        duration,
        order_no,
        created_at,
        courses ( title, color )
      `)
      .order("order_no", { ascending: true });

    if (!error && data) setLessons(data as unknown as Lesson[]);
    setLoading(false);
  };

  useEffect(() => { fetchLessons(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video lesson?")) return;
    setDeleting(id);
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (!error) setLessons(prev => prev.filter(l => l.id !== id));
    setDeleting(null);
  };

  const filtered = lessons.filter(l =>
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.courses?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by lesson or course…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-stone-200 rounded-sm px-4 py-2 text-sm font-serif text-stone-700 bg-white outline-none focus:border-amber-400 w-72"
        />
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2 bg-amber-700 text-white text-xs tracking-widest uppercase font-serif rounded-sm hover:bg-amber-800 transition-colors">
          ➕ Add Video
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white border border-stone-200 rounded-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest uppercase text-amber-700 mb-0.5 font-serif">
              Manage
            </div>
            <h2 className="text-base font-normal text-stone-800 font-serif">
              All Video Lessons
            </h2>
          </div>
          <div className="text-xs text-stone-400 font-serif italic">
            {filtered.length} lesson{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-stone-50 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-sm italic font-serif">
            {search ? "No lessons match your search." : "No video lessons yet. Add your first video."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-serif">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">#</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Lesson</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Course</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Duration</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Video</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lesson, i) => (
                  <tr
                    key={lesson.id}
                    className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-stone-50/50"
                    }`}>

                    {/* Order */}
                    <td className="px-6 py-4">
                      <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-xs text-amber-700">
                        {lesson.order_no}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-stone-700">{lesson.title}</div>
                    </td>

                    {/* Course */}
                    <td className="px-6 py-4">
                      {lesson.courses ? (
                        <span
                          className="text-xs px-2.5 py-1 rounded-sm border font-serif"
                          style={{
                            color: lesson.courses.color,
                            background: `${lesson.courses.color}15`,
                            borderColor: `${lesson.courses.color}40`,
                          }}>
                          {lesson.courses.title}
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400 italic">—</span>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {lesson.duration ?? "—"}
                    </td>

                    {/* Video preview */}
                    <td className="px-6 py-4">
                      
                        <a href={lesson.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs tracking-widest uppercase font-serif text-amber-700 hover:text-amber-900 transition-colors">
                        🎬 Preview
                      </a>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        disabled={deleting === lesson.id}
                        className="text-xs tracking-widest uppercase font-serif text-rose-400 hover:text-rose-600 transition-colors disabled:opacity-50">
                        {deleting === lesson.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cloudinary info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-sm px-5 py-4">
        <div className="text-xs tracking-widest uppercase text-amber-700 mb-2 font-serif">
          ✦ Cloudinary Setup
        </div>
        <p className="text-xs text-amber-800 italic font-serif leading-relaxed">
          Upload your videos to Cloudinary → Media Library → Copy the video URL → Paste it when adding a new lesson.
          Video URLs look like:{" "}
          <span className="not-italic font-normal text-amber-900">
            https://res.cloudinary.com/yourname/video/upload/v123/lesson.mp4
          </span>
        </p>
      </div>

    </div>
  );
}