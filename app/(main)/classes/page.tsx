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

  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Block right click + keyboard shortcuts ───────────────────
  useEffect(() => {
    const blockRightClick = (e: MouseEvent) => e.preventDefault();

    const blockKeys = (e: KeyboardEvent) => {
      if (e.key === "F12") { e.preventDefault(); return; }
      if (e.ctrlKey && e.shiftKey && ["I","i","J","j","C","c","K","k"].includes(e.key)) { e.preventDefault(); return; }
      if (e.ctrlKey && ["U","u","S","s","A","a","C","c","P","p","V","v"].includes(e.key)) { e.preventDefault(); return; }
      if (e.metaKey && e.shiftKey && ["I","i","J","j","C","c"].includes(e.key)) { e.preventDefault(); return; }
      if (e.metaKey && ["U","u","S","s","A","a","C","c","P","p"].includes(e.key)) { e.preventDefault(); return; }
    };

    const handleVisibility = () => {
      if (document.hidden && videoRef.current) videoRef.current.pause();
    };

    document.addEventListener("contextmenu", blockRightClick);
    document.addEventListener("keydown", blockKeys);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("contextmenu", blockRightClick);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // ── Init ────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.replace("/courses"); return; }
      setUserId(session.user.id);
      await fetchEnrolledCourses(session.user.id);
    };
    init();
  }, []);

  // ── Fetch enrolled courses ───────────────────────────────────
  const fetchEnrolledCourses = async (uid: string) => {
    setLoading(true);
    const { data: enrollments, error: enrollErr } = await supabase
      .from("enrollments").select("course_id").eq("user_id", uid);

    if (enrollErr || !enrollments || enrollments.length === 0) { setLoading(false); return; }

    const courseIds = enrollments.map((e: { course_id: string }) => e.course_id);
    const { data: coursesData, error: courseErr } = await supabase
      .from("courses")
      .select(`id, title, color, lessons ( id, title, video_url, duration, order_no )`)
      .in("id", courseIds)
      .order("created_at");

    if (courseErr || !coursesData) { setLoading(false); return; }

    const sorted = coursesData.map((c: Course) => ({
      ...c,
      lessons: [...(c.lessons ?? [])].sort((a: Lesson, b: Lesson) => a.order_no - b.order_no),
    }));

    setCourses(sorted);
    if (sorted.length > 0) {
      setActiveCourse(sorted[0]);
      if (sorted[0].lessons.length > 0) setActiveLesson(sorted[0].lessons[0]);
    }
    setLoading(false);
  };

  // ── Fetch signed URL ─────────────────────────────────────────
  const fetchSignedUrl = useCallback(async (lesson: Lesson) => {
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
      if (!res.ok) { setVideoError(data.error || "Could not load video."); setVideoLoading(false); return; }
      setSignedUrl(data.url);
    } catch {
      setVideoError("Network error. Please try again.");
    } finally {
      setVideoLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (activeLesson) fetchSignedUrl(activeLesson);
  }, [activeLesson?.id]);

  useEffect(() => {
    if (videoRef.current && signedUrl) videoRef.current.load();
  }, [signedUrl]);

  const handleCourseClick = (course: Course) => {
    setActiveCourse(course);
    setSignedUrl(null);
    setActiveLesson(course.lessons.length > 0 ? course.lessons[0] : null);
  };

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSidebarOpen(false); // close drawer on mobile after selecting
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🪡</div>
          <p style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A8A29E" }}>Loading your classes…</p>
        </div>
      </div>
    );
  }

  // ── No enrollments ───────────────────────────────────────────
  if (courses.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", flexDirection: "column", gap: "16px", padding: "24px" }}>
        <div style={{ fontSize: "40px" }}>✦</div>
        <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#1A1208", margin: 0, textAlign: "center" }}>No Classes Yet</h2>
        <p style={{ fontSize: "14px", color: "#A8A29E", fontStyle: "italic", margin: 0, textAlign: "center" }}>You are not enrolled in any course yet.</p>
        <button
          onClick={() => router.push("/courses")}
          style={{ marginTop: "8px", padding: "14px 32px", background: "#B45309", color: "#fff", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", borderRadius: "2px", border: "none", cursor: "pointer", fontFamily: "Georgia,serif" }}
        >
          Browse Courses →
        </button>
      </div>
    );
  }

  // ── Main Layout ──────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .classes-layout {
          min-height: 100vh;
          background: #FAFAF8;
          font-family: Georgia, serif;
          padding-top: 64px;
          user-select: none;
          -webkit-user-select: none;
        }

        .top-bar {
          height: 3px;
          background: linear-gradient(90deg, #B45309, #6D28D9, #BE123C);
        }

        .inner-wrap {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          min-height: calc(100vh - 67px);
        }

        /* ── Desktop sidebar ── */
        .sidebar {
          width: 300px;
          flex-shrink: 0;
          border-right: 1px solid #EDE8E0;
          background: #fff;
          overflow-y: auto;
          max-height: calc(100vh - 67px);
          position: sticky;
          top: 67px;
        }

        .sidebar-header {
          padding: 24px 20px 16px;
          border-bottom: 1px solid #EDE8E0;
        }

        .main-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          min-width: 0;
        }

        /* ── Mobile bottom drawer toggle ── */
        .mobile-bar {
          display: none;
        }

        .drawer-overlay {
          display: none;
        }

        .drawer {
          display: none;
        }

        /* ── Responsive: tablet & mobile ── */
        @media (max-width: 768px) {
          .inner-wrap {
            flex-direction: column;
          }

          .sidebar {
            display: none;
          }

          .main-content {
            padding: 16px;
          }

          /* Floating bottom bar to open drawer */
          .mobile-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background: #fff;
            border-top: 1px solid #EDE8E0;
            padding: 12px 16px;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
          }

          .mobile-bar-info {
            flex: 1;
            min-width: 0;
          }

          .mobile-bar-course {
            font-size: 9px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #A8A29E;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .mobile-bar-lesson {
            font-size: 13px;
            color: #1A1208;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .mobile-bar-btn {
            flex-shrink: 0;
            padding: 10px 18px;
            background: #1A1208;
            color: #fff;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-family: Georgia, serif;
            white-space: nowrap;
          }

          /* Overlay behind drawer */
          .drawer-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 60;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
          }

          .drawer-overlay.open {
            opacity: 1;
            pointer-events: auto;
          }

          /* Bottom sheet drawer */
          .drawer {
            display: flex;
            flex-direction: column;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 70;
            background: #fff;
            border-radius: 16px 16px 0 0;
            max-height: 80vh;
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
            overflow: hidden;
          }

          .drawer.open {
            transform: translateY(0);
          }

          .drawer-handle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px 12px;
            border-bottom: 1px solid #EDE8E0;
            flex-shrink: 0;
          }

          .drawer-handle {
            width: 36px;
            height: 4px;
            background: #D6CFC5;
            border-radius: 2px;
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
          }

          .drawer-title {
            font-size: 9px;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #B45309;
          }

          .drawer-close {
            background: none;
            border: none;
            font-size: 20px;
            color: #A8A29E;
            cursor: pointer;
            padding: 4px;
            line-height: 1;
            font-family: Georgia, serif;
          }

          .drawer-scroll {
            overflow-y: auto;
            flex: 1;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 24px;
          }

          /* Extra bottom padding so content isn't hidden behind mobile bar */
          .main-content {
            padding-bottom: 80px;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 12px 12px 80px;
          }
        }
      `}</style>

      <div className="classes-layout">
        <div className="top-bar" />

        <div className="inner-wrap">
          {/* ── Desktop Sidebar ── */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <div style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#B45309", marginBottom: "4px" }}>My Classes</div>
              <h1 style={{ fontSize: "16px", fontWeight: 400, color: "#1A1208", margin: 0 }}>Enrolled Courses</h1>
            </div>
            <SidebarContent
              courses={courses}
              activeCourse={activeCourse}
              activeLesson={activeLesson}
              onCourseClick={handleCourseClick}
              onLessonClick={handleLessonClick}
            />
          </aside>

          {/* ── Main content ── */}
          <main className="main-content">
            {activeLesson && activeCourse ? (
              <LessonView
                activeCourse={activeCourse}
                activeLesson={activeLesson}
                videoRef={videoRef}
                videoLoading={videoLoading}
                videoError={videoError}
                signedUrl={signedUrl}
                fetchSignedUrl={fetchSignedUrl}
                setActiveLesson={setActiveLesson}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "12px" }}>
                <div style={{ fontSize: "40px" }}>🪡</div>
                <p style={{ fontSize: "14px", color: "#A8A29E", fontStyle: "italic", textAlign: "center" }}>Select a lesson from the sidebar to start watching.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile: Overlay ── */}
      <div className={`drawer-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* ── Mobile: Bottom Drawer ── */}
      <div className={`drawer${sidebarOpen ? " open" : ""}`}>
        <div className="drawer-handle-row" style={{ position: "relative" }}>
          <div className="drawer-handle" />
          <span className="drawer-title">Lessons</span>
          <button className="drawer-close" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <div className="drawer-scroll">
          <SidebarContent
            courses={courses}
            activeCourse={activeCourse}
            activeLesson={activeLesson}
            onCourseClick={handleCourseClick}
            onLessonClick={handleLessonClick}
          />
        </div>
      </div>

      {/* ── Mobile: Bottom Bar ── */}
      <div className="mobile-bar">
        <div className="mobile-bar-info">
          {activeCourse && <div className="mobile-bar-course" style={{ color: activeCourse.color }}>{activeCourse.title}</div>}
          <div className="mobile-bar-lesson">{activeLesson?.title ?? "No lesson selected"}</div>
        </div>
        <button className="mobile-bar-btn" onClick={() => setSidebarOpen(true)}>
          All Lessons ≡
        </button>
      </div>
    </>
  );
}

// ── Shared sidebar content ───────────────────────────────────
function SidebarContent({
  courses,
  activeCourse,
  activeLesson,
  onCourseClick,
  onLessonClick,
}: {
  courses: Course[];
  activeCourse: Course | null;
  activeLesson: Lesson | null;
  onCourseClick: (c: Course) => void;
  onLessonClick: (l: Lesson) => void;
}) {
  return (
    <>
      {courses.map((course) => (
        <div key={course.id}>
          <button
            onClick={() => onCourseClick(course)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "14px 20px",
              background: activeCourse?.id === course.id ? "#FFFBF0" : "transparent",
              borderLeft: activeCourse?.id === course.id ? `3px solid ${course.color}` : "3px solid transparent",
              borderBottom: "1px solid #EDE8E0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.15s",
              minHeight: "52px",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: course.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "12px", color: "#1A1208", margin: 0, fontWeight: activeCourse?.id === course.id ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {course.title}
              </p>
              <p style={{ fontSize: "10px", color: "#A8A29E", margin: "2px 0 0", letterSpacing: "0.05em" }}>
                {course.lessons.length} lesson{course.lessons.length !== 1 ? "s" : ""}
              </p>
            </div>
          </button>

          {activeCourse?.id === course.id &&
            course.lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => onLessonClick(lesson)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 20px 12px 36px",
                  background: activeLesson?.id === lesson.id ? `${course.color}15` : "transparent",
                  borderLeft: activeLesson?.id === lesson.id ? `3px solid ${course.color}` : "3px solid transparent",
                  borderBottom: "1px solid #F5F0EA",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.15s",
                  minHeight: "48px",
                }}
              >
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: activeLesson?.id === lesson.id ? course.color : "#F0EAE0", color: activeLesson?.id === lesson.id ? "#fff" : "#A8A29E", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "11px", color: activeLesson?.id === lesson.id ? "#1A1208" : "#78716C", margin: 0, fontWeight: activeLesson?.id === lesson.id ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {lesson.title}
                  </p>
                  {lesson.duration && (
                    <p style={{ fontSize: "10px", color: "#A8A29E", margin: "1px 0 0" }}>{lesson.duration}</p>
                  )}
                </div>
                {activeLesson?.id === lesson.id && (
                  <span style={{ fontSize: "10px", color: course.color, flexShrink: 0 }}>▶</span>
                )}
              </button>
            ))}
        </div>
      ))}
    </>
  );
}

// ── Lesson view ──────────────────────────────────────────────
function LessonView({
  activeCourse,
  activeLesson,
  videoRef,
  videoLoading,
  videoError,
  signedUrl,
  fetchSignedUrl,
  setActiveLesson,
}: {
  activeCourse: Course;
  activeLesson: Lesson;
videoRef: React.RefObject<HTMLVideoElement | null>;
  videoLoading: boolean;
  videoError: string | null;
  signedUrl: string | null;
  fetchSignedUrl: (l: Lesson) => void;
  setActiveLesson: (l: Lesson) => void;
}) {
  const lessons = activeCourse.lessons;
  const idx = lessons.findIndex((l) => l.id === activeLesson.id);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#A8A29E", marginBottom: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <span style={{ color: activeCourse.color }}>{activeCourse.title}</span>
        <span style={{ margin: "0 8px" }}>›</span>
        <span>{activeLesson.title}</span>
      </div>

      <h2 style={{ fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 400, color: "#1A1208", margin: "0 0 6px" }}>
        {activeLesson.title}
      </h2>
      {activeLesson.duration && (
        <p style={{ fontSize: "11px", color: "#A8A29E", margin: "0 0 20px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          ⏱ {activeLesson.duration}
        </p>
      )}

      {/* ── Video Area ── */}
      <div style={{ background: "#0A0A0A", borderRadius: "6px", overflow: "hidden", border: "1.5px solid #EDE8E0", marginBottom: "20px", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "100%" }}>
        {videoLoading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid #333", borderTop: "3px solid #B45309", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#555", fontFamily: "Georgia,serif" }}>Loading video…</p>
          </div>
        )}

        {videoError && !videoLoading && (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>⚠️</div>
            <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "Georgia,serif", fontStyle: "italic", marginBottom: "16px" }}>{videoError}</p>
            <button
              onClick={() => fetchSignedUrl(activeLesson)}
              style={{ padding: "10px 24px", background: "#B45309", color: "#fff", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", border: "none", borderRadius: "2px", cursor: "pointer", fontFamily: "Georgia,serif" }}
            >
              Try Again
            </button>
          </div>
        )}

        {signedUrl && !videoLoading && (
          signedUrl.includes("youtube.com/embed") ? (
            <iframe
              src={signedUrl}
              style={{ width: "100%", height: "100%", border: "none", position: "absolute", inset: 0 }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            />
          ) : (
            <video
              ref={videoRef}
              controls
              controlsList="nodownload nofullscreen"
              onContextMenu={(e) => e.preventDefault()}
              style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }}
              playsInline
            >
              <source src={signedUrl} type="video/mp4" />
            </video>
          )
        )}
      </div>

      {/* Prev / Next */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
        <button
          disabled={!prev}
          onClick={() => prev && setActiveLesson(prev)}
          style={{ flex: 1, padding: "12px 16px", border: "1px solid #EDE8E0", background: prev ? "#fff" : "#F5F0EA", color: prev ? "#78716C" : "#C4B89A", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: "2px", cursor: prev ? "pointer" : "not-allowed", fontFamily: "Georgia,serif", minHeight: "44px" }}
        >
          ← Prev
        </button>
        <button
          disabled={!next}
          onClick={() => next && setActiveLesson(next)}
          style={{ flex: 1, padding: "12px 16px", border: "none", background: next ? activeCourse.color : "#F5F0EA", color: next ? "#fff" : "#C4B89A", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: "2px", cursor: next ? "pointer" : "not-allowed", fontFamily: "Georgia,serif", minHeight: "44px" }}
        >
          Next →
        </button>
      </div>
    </>
  );
}