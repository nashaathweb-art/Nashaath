"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];

const colorPresets = [
  { label: "Amber",  color: "#B45309", light_bg: "#FFFBF0", border_color: "#FDE68A" },
  { label: "Green",  color: "#047857", light_bg: "#F0FDF4", border_color: "#A7F3D0" },
  { label: "Violet", color: "#6D28D9", light_bg: "#F5F3FF", border_color: "#DDD6FE" },
  { label: "Rose",   color: "#BE123C", light_bg: "#FFF1F2", border_color: "#FECDD3" },
  { label: "Blue",   color: "#1D4ED8", light_bg: "#EFF6FF", border_color: "#BFDBFE" },
  { label: "Brown",  color: "#92400E", light_bg: "#FEF3C7", border_color: "#FDE68A" },
];

export default function AddCourseForm({ onSuccess, onCancel }: Props) {
  // Course fields
  const [title, setTitle]             = useState("");
  const [level, setLevel]             = useState("Beginner");
  const [badge, setBadge]             = useState("");
  const [duration, setDuration]       = useState("");
  const [lessons, setLessons]         = useState<number>(0);
  const [description, setDescription] = useState("");
  const [icon, setIcon]               = useState("✦");
  const [topicsInput, setTopicsInput] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorPresets[0]);

  // Plan fields
  const [planName, setPlanName]         = useState("");
  const [planPrice, setPlanPrice]       = useState<number | "">("");
  const [planDuration, setPlanDuration] = useState("");
  const [planFeaturesInput, setPlanFeaturesInput] = useState("");

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!title.trim())       { setError("Course title is required."); return; }
    if (!level)              { setError("Please select a level."); return; }
    if (!duration.trim())    { setError("Duration is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    if (!planName.trim())    { setError("Plan name is required."); return; }
    if (!planPrice)          { setError("Plan price is required."); return; }

    const topics = topicsInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    const planFeatures = planFeaturesInput
      .split(",")
      .map(f => f.trim())
      .filter(Boolean);

    setLoading(true);

    const { error: insertError } = await supabase
      .from("courses")
      .insert({
        title:        title.trim(),
        level,
        badge:        badge.trim() || level,
        duration:     duration.trim(),
        lessons,
        description:  description.trim(),
        icon:         icon.trim() || "✦",
        topics,
        color:        selectedColor.color,
        light_bg:     selectedColor.light_bg,
        border_color: selectedColor.border_color,
        is_active:    true,
        plan_name:    planName.trim(),
        plan_price:   planPrice,
        plan_duration: planDuration.trim() || null,
        plan_features: planFeatures,
      });

    setLoading(false);

    if (insertError) {
      setError("Failed to add course. Please try again.");
      return;
    }

    setSuccess("✦ Course added successfully!");

    // Reset
    setTitle(""); setLevel("Beginner"); setBadge(""); setDuration("");
    setLessons(0); setDescription(""); setIcon("✦"); setTopicsInput("");
    setPlanName(""); setPlanPrice(""); setPlanDuration(""); setPlanFeaturesInput("");
    setSelectedColor(colorPresets[0]);

    setTimeout(() => onSuccess(), 1500);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-stone-200 rounded-md overflow-hidden">

        {/* Top strip */}
        <div
          className="h-1 transition-colors"
          style={{ background: selectedColor.color }}
        />

        <div className="px-8 py-6">

          {/* Header */}
          <div className="mb-8">
            <div className="text-xs tracking-widest uppercase text-amber-700 mb-1 font-serif">
              New Course
            </div>
            <h2 className="text-xl font-normal text-stone-800 font-serif">
              Add Course
            </h2>
            <p className="text-sm text-stone-400 italic font-serif mt-1">
              Fill in the course details and plan information.
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

          {/* ── Section 1 — Course Info ── */}
          <div className="mb-2">
            <div className="text-xs tracking-widest uppercase text-stone-400 mb-4 font-serif flex items-center gap-3">
              <span>Course Details</span>
              <div className="flex-1 border-t border-stone-100" />
            </div>
          </div>

          <div className="space-y-5 mb-8">

            {/* Title */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Course Title
              </label>
              <input
                type="text"
                placeholder="e.g. Aari Embroidery"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Level + Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  Level
                </label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors">
                  {levels.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  Badge <span className="normal-case text-stone-400">(defaults to level)</span>
                </label>
                <input
                  type="text"
                  placeholder={level}
                  value={badge}
                  onChange={e => setBadge(e.target.value)}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Duration + Lessons + Icon */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8 Weeks"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  No. of Classes
                </label>
                <input
                  type="number"
                  min={0}
                  value={lessons}
                  onChange={e => setLessons(Number(e.target.value))}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  Icon / Emoji
                </label>
                <input
                  type="text"
                  placeholder="✦"
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Description
              </label>
              <textarea
                placeholder="Short description of what students will learn…"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors resize-none"
              />
            </div>

            {/* Topics */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Topics <span className="normal-case text-stone-400">(comma separated)</span>
              </label>
              <textarea
                placeholder="e.g. Aari needle handling, Zari work, Stone setting, Bridal patterns"
                value={topicsInput}
                onChange={e => setTopicsInput(e.target.value)}
                rows={2}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors resize-none"
              />
            </div>

            {/* Color Presets */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3 font-serif">
                Course Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map(preset => (
                  <button
                    key={preset.color}
                    onClick={() => setSelectedColor(preset)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-serif transition-all ${
                      selectedColor.color === preset.color
                        ? "border-stone-400 bg-stone-100 text-stone-700"
                        : "border-stone-200 text-stone-500 hover:border-stone-300"
                    }`}>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: preset.color }}
                    />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live preview badge */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3 font-serif">
                Preview
              </label>
              <div
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-sm border"
                style={{
                  background: selectedColor.light_bg,
                  borderColor: selectedColor.border_color,
                }}>
                <span style={{ color: selectedColor.color, fontSize: "18px" }}>
                  {icon || "✦"}
                </span>
                <div>
                  <div
                    className="text-sm font-serif"
                    style={{ color: selectedColor.color }}>
                    {title || "Course Title"}
                  </div>
                  <div
                    className="text-xs tracking-widest uppercase font-serif"
                    style={{ color: selectedColor.color, opacity: 0.7 }}>
                    {level}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Section 2 — Plan Info ── */}
          <div className="mb-2">
            <div className="text-xs tracking-widest uppercase text-stone-400 mb-4 font-serif flex items-center gap-3">
              <span>Plan Details</span>
              <div className="flex-1 border-t border-stone-100" />
            </div>
          </div>

          <div className="space-y-5">

            {/* Plan Name + Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  Plan Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standard Plan"
                  value={planName}
                  onChange={e => setPlanName(e.target.value)}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 3500"
                  value={planPrice}
                  onChange={e => setPlanPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Plan Duration */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Plan Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 2 Months"
                value={planDuration}
                onChange={e => setPlanDuration(e.target.value)}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Plan Features */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Plan Features <span className="normal-case text-stone-400">(comma separated)</span>
              </label>
              <textarea
                placeholder="e.g. 24 classes, Aari needle kit, Certificate on completion, Doubt clearing sessions"
                value={planFeaturesInput}
                onChange={e => setPlanFeaturesInput(e.target.value)}
                rows={3}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors resize-none"
              />
            </div>

            {/* Plan preview */}
            {(planName || planPrice) && (
              <div
                className="rounded-sm border px-4 py-3"
                style={{
                  background: `${selectedColor.color}08`,
                  borderColor: `${selectedColor.color}30`,
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-sm font-serif"
                    style={{ color: selectedColor.color }}>
                    {planName || "Plan Name"}
                  </span>
                  <span
                    className="text-xl font-serif"
                    style={{ color: selectedColor.color }}>
                    {planPrice ? `₹${Number(planPrice).toLocaleString("en-IN")}` : "₹0"}
                  </span>
                </div>
                <div className="text-xs text-stone-400 italic font-serif">
                  {planDuration || "Duration"}
                </div>
                {planFeaturesInput && (
                  <ul className="mt-2 space-y-1">
                    {planFeaturesInput.split(",").filter(Boolean).map((f, i) => (
                      <li
                        key={i}
                        className="text-xs text-stone-500 font-serif italic flex items-center gap-2">
                        <span style={{ color: selectedColor.color }}>◆</span>
                        {f.trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

          </div>

          {/* Divider */}
          <div className="border-t border-stone-100 my-8" />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-amber-700 text-white text-xs tracking-widest uppercase font-serif rounded-sm hover:bg-amber-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Adding Course…" : "Add Course"}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 border border-stone-200 text-stone-500 text-xs tracking-widest uppercase font-serif rounded-sm hover:border-stone-400 transition-colors disabled:opacity-50">
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}