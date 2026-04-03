"use client";

import { useState, useEffect, useRef } from "react";
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

export default function AddVideoForm({ onSuccess, onCancel }: Props) {
  const [title, setTitle]             = useState("");
  const [videoUrl, setVideoUrl]       = useState("");
  const [duration, setDuration]       = useState("");
  const [orderNo, setOrderNo]         = useState<number>(1);
  const [courseId, setCourseId]       = useState("");
  const [courses, setCourses]         = useState<Course[]>([]);
  const [loading, setLoading]         = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [uploadMode, setUploadMode]   = useState<"upload" | "url">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!courseId) return;
    const fetchNextOrder = async () => {
      const { data } = await supabase
        .from("lessons")
        .select("order_no")
        .eq("course_id", courseId)
        .order("order_no", { ascending: false })
        .limit(1)
        .single();
      setOrderNo(data ? data.order_no + 1 : 1);
    };
    fetchNextOrder();
  }, [courseId]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please drop a valid video file.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVideoUrl("");
      setError("");
    }
  };

  const handleUploadToCloudinary = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Simulate progress while uploading
    const interval = setInterval(() => {
      setUploadProgress(prev => (prev < 85 ? prev + 5 : prev));
    }, 500);

    try {
      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      setUploadProgress(100);

      // Auto-fill duration if Cloudinary returned it
      if (data.duration && !duration) {
        setDuration(data.duration);
      }

      return data.url;
    } catch (err) {
      clearInterval(interval);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!courseId)     { setError("Please select a course."); return; }
    if (!title.trim()) { setError("Lesson title is required."); return; }

    if (uploadMode === "upload" && !selectedFile && !videoUrl) {
      setError("Please select a video file to upload.");
      return;
    }
    if (uploadMode === "url" && !videoUrl.trim()) {
      setError("Please enter a video URL.");
      return;
    }

    setLoading(true);

    try {
      let finalUrl = videoUrl;

      // If file selected, upload to Cloudinary first
      if (uploadMode === "upload" && selectedFile) {
        const uploadedUrl = await handleUploadToCloudinary();
        if (!uploadedUrl) {
          setError("Upload failed. Please try again.");
          setLoading(false);
          return;
        }
        finalUrl = uploadedUrl;
      }

      // Save to Supabase
      const { error: insertError } = await supabase
        .from("lessons")
        .insert({
          course_id: courseId,
          title:     title.trim(),
          video_url: finalUrl,
          duration:  duration.trim() || null,
          order_no:  orderNo,
        });

      if (insertError) {
        setError("Failed to save lesson. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("✦ Video lesson added successfully!");
      setTitle("");
      setVideoUrl("");
      setDuration("");
      setOrderNo(1);
      setCourseId("");
      setSelectedFile(null);
      setUploadProgress(0);

      setTimeout(() => onSuccess(), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find(c => c.id === courseId);
  const isProcessing   = loading || uploading;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-xl">
      <div className="bg-white border border-stone-200 rounded-md overflow-hidden">

        {/* Top colour strip */}
        <div
          className="h-1 transition-colors duration-500"
          style={{ background: selectedCourse?.color ?? "#B45309" }}
        />

        <div className="px-8 py-6">

          {/* Header */}
          <div className="mb-8">
            <div className="text-xs tracking-widest uppercase text-amber-700 mb-1 font-serif">
              New Lesson
            </div>
            <h2 className="text-xl font-normal text-stone-800 font-serif">
              Add Video Lesson
            </h2>
            <p className="text-sm text-stone-400 italic font-serif mt-1">
              Upload a video directly or paste a Cloudinary URL.
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

            {/* Course */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Course
              </label>
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors">
                <option value="">— Select a course —</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Lesson Title */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Lesson Title
              </label>
              <input
                type="text"
                placeholder="e.g. Introduction to Aari Embroidery"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Upload Mode Toggle */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                Video Source
              </label>
              <div className="flex rounded-sm border border-stone-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => { setUploadMode("upload"); setVideoUrl(""); }}
                  className={`flex-1 py-2 text-xs tracking-widest uppercase font-serif transition-colors ${
                    uploadMode === "upload"
                      ? "bg-amber-700 text-white"
                      : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                  }`}>
                  ↑ Upload File
                </button>
                <button
                  type="button"
                  onClick={() => { setUploadMode("url"); setSelectedFile(null); }}
                  className={`flex-1 py-2 text-xs tracking-widest uppercase font-serif transition-colors border-l border-stone-200 ${
                    uploadMode === "url"
                      ? "bg-amber-700 text-white"
                      : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                  }`}>
                  ⊕ Paste URL
                </button>
              </div>
            </div>

            {/* Upload File Area */}
            {uploadMode === "upload" && (
              <div>
                {!selectedFile ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-sm px-6 py-10 text-center cursor-pointer transition-colors ${
                      dragOver
                        ? "border-amber-400 bg-amber-50"
                        : "border-stone-200 bg-stone-50 hover:border-amber-300 hover:bg-amber-50/30"
                    }`}>
                    <div className="text-3xl mb-3">🎬</div>
                    <p className="text-sm font-serif text-stone-500 italic">
                      Drag & drop your video here
                    </p>
                    <p className="text-xs font-serif text-stone-400 mt-1">
                      or click to browse — MP4, MOV, AVI
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                ) : (
                  <div className="border border-stone-200 rounded-sm bg-stone-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 border border-amber-200 rounded-sm flex items-center justify-center text-amber-700 text-lg flex-shrink-0">
                          🎬
                        </div>
                        <div>
                          <p className="text-sm font-serif text-stone-700 font-medium truncate max-w-[220px]">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs font-serif text-stone-400 italic mt-0.5">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSelectedFile(null); setUploadProgress(0); }}
                        className="text-stone-400 hover:text-rose-500 text-lg leading-none transition-colors flex-shrink-0"
                        disabled={isProcessing}>
                        ×
                      </button>
                    </div>

                    {/* Upload Progress Bar */}
                    {uploadProgress > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-serif text-stone-400 mb-1">
                          <span className="italic">
                            {uploadProgress < 100 ? "Uploading to Cloudinary…" : "Upload complete ✦"}
                          </span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Paste URL Area */}
            {uploadMode === "url" && (
              <div>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/dvuo5v4d2/video/upload/…"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
                <p className="text-xs text-stone-400 italic font-serif mt-1">
                  Cloudinary → Media Library → Click video → Copy URL
                </p>
              </div>
            )}

            {/* Video preview for URL mode */}
            {uploadMode === "url" && videoUrl.startsWith("http") && (
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  Preview
                </label>
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-sm border border-stone-200 bg-stone-900"
                  style={{ maxHeight: "200px" }}>
                  Your browser does not support video.
                </video>
              </div>
            )}

            {/* Duration + Order */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12 mins"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2 font-serif">
                  Lesson Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={orderNo}
                  onChange={e => setOrderNo(Number(e.target.value))}
                  className="w-full border border-stone-200 rounded-sm px-4 py-2.5 text-sm font-serif text-stone-700 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                />
                <p className="text-xs text-stone-400 italic font-serif mt-1">
                  Auto-suggested from existing lessons.
                </p>
              </div>
            </div>

          </div>

          <div className="border-t border-stone-100 my-8" />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="flex-1 py-3 bg-amber-700 text-white text-xs tracking-widest uppercase font-serif rounded-sm hover:bg-amber-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {uploading
                ? "Uploading Video…"
                : loading
                ? "Saving Lesson…"
                : "Add Video Lesson"}
            </button>
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="px-6 py-3 border border-stone-200 text-stone-500 text-xs tracking-widest uppercase font-serif rounded-sm hover:border-stone-400 transition-colors disabled:opacity-50">
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}