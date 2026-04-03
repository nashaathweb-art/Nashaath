"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  duration: string | null;
  order_no: number;
}

interface Course {
  id: string;
  title: string;
  color: string;
  lessons: Lesson[];
}

export default function ClassesPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [courses, setCourses]           = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading]           = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [signedUrl, setSignedUrl]       = useState<string | null>(null);
  const [videoError, setVideoError]     = useState<string | null>(null);
  const [userId, setUserId]             = useState<string | null>(null);

  // ── Init ────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/courses");
        return;
      }

      setUserId(session.user.id);
      await fetchEnrolledCourses(session.user.id);
    };

    init();
  }, []);

  // ── Fetch enrolled courses ───────────────────────────────────
  const fetchEnrolledCourses = async (uid: string) => {
    setLoading(true);

    const { data: enrollments, error: enrollErr } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", uid);

    if (enrollErr || !enrollments || enrollments.length === 0) {
      setLoading(false);
      return;
    }

    const courseIds = enrollments.map((e: { course_id: string }) => e.course_id);

    const { data: coursesData, error: courseErr } = await supabase
      .from("courses")
      .select(`
        id, title, color,
        lessons ( id, title, video_url, duration, order_no )
      `)
      .in("id", courseIds)
      .order("created_at");

    if (courseErr || !coursesData) {
      setLoading(false);
      return;
    }

    const sorted = coursesData.map((c: Course) => ({
      ...c,
      lessons: [...(c.lessons ?? [])].sort(
        (a: Lesson, b: Lesson) => a.order_no - b.order_no
      ),
    }));

    setCourses(sorted);

    if (sorted.length > 0) {
      setActiveCourse(sorted[0]);
      if (sorted[0].lessons.length > 0) {
        setActiveLesson(sorted[0].lessons[0]);
      }
    }

    setLoading(false);
  };

  // ── Fetch signed URL whenever lesson changes ─────────────────
  const fetchSignedUrl = useCallback(
    async (lesson: Lesson) => {
      if (!userId) return;

      setSignedUrl(null);
      setVideoError(null);
      setVideoLoading(true);

      try {
        const res = await fetch("/api/get-video-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id, userId }),
        });

        const data = await res.json();

        if (!res.ok) {
          setVideoError(data.error || "Could not load video.");
          setVideoLoading(false);
          return;
        }

        setSignedUrl(data.url);
      } catch {
        setVideoError("Network error. Please try again.");
      } finally {
        setVideoLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (activeLesson) {
      fetchSignedUrl(activeLesson);
    }
  }, [activeLesson?.id]);

  // Reload video element when signed URL changes
  useEffect(() => {
    if (videoRef.current && signedUrl) {
      videoRef.current.load();
    }
  }, [signedUrl]);

  const handleCourseClick = (course: Course) => {
    setActiveCourse(course);
    setSignedUrl(null);
    if (course.lessons.length > 0) {
      setActiveLesson(course.lessons[0]);
    } else {
      setActiveLesson(null);
    }
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🪡</div>
          <p style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A8A29E" }}>
            Loading your classes…
          </p>
        </div>
      </div>
    );
  }

  // ── No enrollments ───────────────────────────────────────────
  if (courses.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "40px" }}>✦</div>
        <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#1A1208", margin: 0 }}>No Classes Yet</h2>
        <p style={{ fontSize: "14px", color: "#A8A29E", fontStyle: "italic", margin: 0 }}>
          You are not enrolled in any course yet.
        </p>
        <button
          onClick={() => router.push("/courses")}
          style={{ marginTop: "8px", padding: "12px 32px", background: "#B45309", color: "#fff", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", borderRadius: "2px", border: "none", cursor: "pointer", fontFamily: "Georgia,serif" }}
        >
          Browse Courses →
        </button>
      </div>
    );
  }

  // ── Main Layout ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "Georgia,serif", paddingTop: "64px" }}>
      <div style={{ height: "3px", background: "linear-gradient(90deg,#B45309,#6D28D9,#BE123C)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", minHeight: "calc(100vh - 67px)" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: "300px", flexShrink: 0, borderRight: "1px solid #EDE8E0", background: "#fff", overflowY: "auto", maxHeight: "calc(100vh - 67px)", position: "sticky", top: "67px" }}>
          <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #EDE8E0" }}>
            <div style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#B45309", marginBottom: "4px" }}>
              My Classes
            </div>
            <h1 style={{ fontSize: "16px", fontWeight: 400, color: "#1A1208", margin: 0 }}>
              Enrolled Courses
            </h1>
          </div>

          {courses.map((course) => (
            <div key={course.id}>
              <button
                onClick={() => handleCourseClick(course)}
                style={{ width: "100%", textAlign: "left", padding: "14px 20px", background: activeCourse?.id === course.id ? "#FFFBF0" : "transparent", borderLeft: activeCourse?.id === course.id ? `3px solid ${course.color}` : "3px solid transparent", borderBottom: "1px solid #EDE8E0", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s" }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: course.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "12px", color: "#1A1208", margin: 0, fontWeight: activeCourse?.id === course.id ? 600 : 400 }}>
                    {course.title}
                  </p>
                  <p style={{ fontSize: "10px", color: "#A8A29E", margin: "2px 0 0", letterSpacing: "0.05em" }}>
                    {course.lessons.length} lesson{course.lessons.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </button>

              {activeCourse?.id === course.id && course.lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  style={{ width: "100%", textAlign: "left", padding: "11px 20px 11px 36px", background: activeLesson?.id === lesson.id ? `${course.color}15` : "transparent", borderLeft: activeLesson?.id === lesson.id ? `3px solid ${course.color}` : "3px solid transparent", borderBottom: "1px solid #F5F0EA", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s" }}
                >
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: activeLesson?.id === lesson.id ? course.color : "#F0EAE0", color: activeLesson?.id === lesson.id ? "#fff" : "#A8A29E", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "11px", color: activeLesson?.id === lesson.id ? "#1A1208" : "#78716C", margin: 0, fontWeight: activeLesson?.id === lesson.id ? 500 : 400 }}>
                      {lesson.title}
                    </p>
                    {lesson.duration && (
                      <p style={{ fontSize: "10px", color: "#A8A29E", margin: "1px 0 0" }}>{lesson.duration}</p>
                    )}
                  </div>
                  {activeLesson?.id === lesson.id && (
                    <span style={{ fontSize: "10px", color: course.color }}>▶</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {activeLesson && activeCourse ? (
            <>
              {/* Breadcrumb */}
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#A8A29E", marginBottom: "16px" }}>
                <span style={{ color: activeCourse.color }}>{activeCourse.title}</span>
                <span style={{ margin: "0 8px" }}>›</span>
                <span>{activeLesson.title}</span>
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: 400, color: "#1A1208", margin: "0 0 6px" }}>
                {activeLesson.title}
              </h2>
              {activeLesson.duration && (
                <p style={{ fontSize: "11px", color: "#A8A29E", margin: "0 0 24px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  ⏱ {activeLesson.duration}
                </p>
              )}

              {/* ── Video Area ── */}
              <div style={{ background: "#0A0A0A", borderRadius: "6px", overflow: "hidden", border: "1.5px solid #EDE8E0", marginBottom: "24px", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>

                {/* Loading spinner */}
                {videoLoading && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", border: "3px solid #333", borderTop: "3px solid #B45309", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#555", fontFamily: "Georgia,serif" }}>
                      Loading video…
                    </p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                )}

                {/* Error state */}
                {videoError && !videoLoading && (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
                    <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "Georgia,serif", fontStyle: "italic", marginBottom: "16px" }}>
                      {videoError}
                    </p>
                    <button
                      onClick={() => fetchSignedUrl(activeLesson)}
                      style={{ padding: "8px 24px", background: "#B45309", color: "#fff", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: "pointer", fontFamily: "Georgia,serif" }}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Video player — only shown when signed URL is ready */}
                {signedUrl && !videoLoading && (
                  <video
                    ref={videoRef}
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ width: "100%", display: "block", maxHeight: "520px" }}
                  >
                    <source src={signedUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Prev / Next */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
                {(() => {
                  const lessons = activeCourse.lessons;
                  const idx  = lessons.findIndex(l => l.id === activeLesson.id);
                  const prev = lessons[idx - 1];
                  const next = lessons[idx + 1];
                  return (
                    <>
                      <button
                        disabled={!prev}
                        onClick={() => prev && setActiveLesson(prev)}
                        style={{ padding: "10px 24px", border: "1px solid #EDE8E0", background: prev ? "#fff" : "#F5F0EA", color: prev ? "#78716C" : "#C4B89A", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: "2px", cursor: prev ? "pointer" : "not-allowed", fontFamily: "Georgia,serif" }}
                      >
                        ← Previous
                      </button>
                      <button
                        disabled={!next}
                        onClick={() => next && setActiveLesson(next)}
                        style={{ padding: "10px 24px", border: "none", background: next ? activeCourse.color : "#F5F0EA", color: next ? "#fff" : "#C4B89A", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: "2px", cursor: next ? "pointer" : "not-allowed", fontFamily: "Georgia,serif" }}
                      >
                        Next →
                      </button>
                    </>
                  );
                })()}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "12px" }}>
              <div style={{ fontSize: "40px" }}>🪡</div>
              <p style={{ fontSize: "14px", color: "#A8A29E", fontStyle: "italic" }}>
                Select a lesson from the sidebar to start watching.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}