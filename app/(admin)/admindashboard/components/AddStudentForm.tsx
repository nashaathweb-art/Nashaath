"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Course {
  id: string;
  title: string;
  color: string;
}

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddStudentForm({ onSuccess, onCancel }: Props) {
  const [fullName, setFullName]   = useState("");
  const [phone, setPhone]         = useState("");
  const [password, setPassword]   = useState("");
  const [courseId, setCourseId]   = useState("");
  const [courses, setCourses]     = useState<Course[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title, color")
        .eq("is_active", true)
        .order("created_at");
      if (data) setCourses(data);
    };
    fetchCourses();
  }, []);

const handleSubmit = async () => {
  setError("");
  setSuccess("");

  if (!fullName.trim())               { setError("Full name is required."); return; }
  if (!/^\d{10}$/.test(phone.trim())) { setError("Enter a valid 10-digit phone number."); return; }
  if (password.length < 6)            { setError("Password must be at least 6 characters."); return; }
  if (!courseId)                      { setError("Please select a course."); return; }

  setLoading(true);

  const res = await fetch("/api/create-student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName,
      phone: phone.trim(),
      password,
      courseId,
    }),
  });

  const result = await res.json();
  setLoading(false);

  if (!res.ok) {
    setError(result.error ?? "Something went wrong.");
    return;
  }

  setSuccess(`✦ ${fullName} has been added and enrolled successfully!`);
  setFullName("");
  setPhone("");
  setPassword("");
  setCourseId("");

  setTimeout(() => onSuccess(), 1500);
};

  return (
    <div className="max-w-xl">

      {/* Card */}
      <div className="bg-white border border-stone-200 rounded-md overflow-hidden">

        {/* Top strip */}
        <div className="h-1 bg-amber-700" />

        <div className="px-8 py-6">

          {/* Header */}
          <div className="mb-8">
            <div className="text-xs tracking-widest uppercase text-amber-700 mb-1 font-serif">
              New Student
            </div>
            <h2 className="text-xl font-normal text-stone-800 font-serif">
              Add Student
            </h2>
            <p className="text-sm text-stone-400 italic font-serif mt-1">
              Fill in the details received from the student via WhatsApp.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-sm px-4 py-3 mb-6 text-sm text-rose-700 italic font-serif">
              ✦ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-sm px-4 py-3 mb-6 text-sm text-emerald-700 italic font-serif">
              {success}
            </div>
          )}

          <div className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Fathima Rashida"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Phone Number
              </label>
              <div className="flex border border-stone-200 rounded-sm overflow-hidden focus-within:border-amber-400 transition-colors">
                <span className="px-3 py-2.5 bg-stone-100 border-r border-stone-200 text-sm text-stone-500 font-serif">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  maxLength={10}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:bg-white transition-colors"
                />
              </div>
              <p className="text-xs text-stone-400 italic font-serif mt-1">
                This will be the student's login ID.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Password
              </label>
              <input
                type="text"
                placeholder="Set a password for the student"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
              />
              <p className="text-xs text-stone-400 italic font-serif mt-1">
                Minimum 6 characters. Share this with the student via WhatsApp.
              </p>
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Enroll In Course
              </label>
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors">
                <option value="">— Select a course —</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-stone-100 my-8" />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-amber-700 text-white text-xs tracking-widest uppercase font-serif rounded-sm hover:bg-amber-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Creating Student…" : "Create Student & Enroll"}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 border border-stone-200 text-stone-500 text-xs tracking-widest uppercase font-serif rounded-sm hover:border-stone-400 transition-colors disabled:opacity-50">
              Cancel
            </button>
          </div>

          {/* Info box */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
            <div className="text-xs tracking-widest uppercase text-amber-700 mb-2 font-serif">
              After Creating
            </div>
            <p className="text-xs text-amber-800 italic font-serif leading-relaxed">
              Send the student their phone number and password via WhatsApp so they can log in at your website.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}