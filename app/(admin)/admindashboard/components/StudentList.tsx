"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Student {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
  enrollments: {
    courses: {
      title: string;
      color: string;
    };
  }[];
}

interface Props {
  onAddNew: () => void;
}

export default function StudentList({ onAddNew }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch]     = useState("");

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        phone,
        created_at,
        enrollments (
          courses ( title, color )
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) setStudents(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    setDeleting(id);

    // delete from auth.users via admin (cascades to profiles + enrollments)
    const { error } = await supabase.rpc("delete_user", { user_id: id });

    if (!error) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
    setDeleting(null);
  };

  const filtered = students.filter(s =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.includes(search)
  );

  return (
    <div className="space-y-6">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-stone-200 rounded-sm px-4 py-2 text-sm font-serif text-stone-700 bg-white outline-none focus:border-amber-400 w-72"
        />

        {/* Add button */}
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2 bg-amber-700 text-white text-xs tracking-widest uppercase font-serif rounded-sm hover:bg-amber-800 transition-colors">
          ➕ Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest uppercase text-amber-700 mb-0.5 font-serif">
              Manage
            </div>
            <h2 className="text-base font-normal text-stone-800 font-serif">
              All Students
            </h2>
          </div>
          <div className="text-xs text-stone-400 font-serif italic">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
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
            {search ? "No students match your search." : "No students yet. Add your first student."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-serif">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Student</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Phone</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Course</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Joined</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-400 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, i) => (
                  <tr
                    key={student.id}
                    className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-stone-50/50"}`}>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-xs text-amber-700 flex-shrink-0">
                          {student.full_name?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <span className="text-sm text-stone-700">
                          {student.full_name ?? "—"}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {student.phone ?? "—"}
                    </td>

                    {/* Course */}
                    <td className="px-6 py-4">
                      {student.enrollments?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {student.enrollments.map((e, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2.5 py-1 rounded-sm border font-serif"
                              style={{
                                color: e.courses?.color,
                                background: `${e.courses?.color}15`,
                                borderColor: `${e.courses?.color}40`,
                              }}>
                              {e.courses?.title}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400 italic">Not enrolled</span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-sm text-stone-400">
                      {new Date(student.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(student.id)}
                        disabled={deleting === student.id}
                        className="text-xs tracking-widest uppercase font-serif text-rose-400 hover:text-rose-600 transition-colors disabled:opacity-50">
                        {deleting === student.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}