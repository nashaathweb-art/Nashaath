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
  plan_name: string;
  plan_price: number;
  plan_duration: string;
  plan_features: string[];
}

const filters = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

export default function Courses() {

  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCourse, setModalCourse] = useState<Course | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState<"ok" | "already" | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      if (!error && data) setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

 const handleEnrollClick = (e: React.MouseEvent, course: Course) => {
  e.stopPropagation();
  setModalCourse(course);
  setModalOpen(true);
  setEnrolled(null);
};

 const handleEnroll = () => {
  if (!modalCourse) return;
  const message = `Hi, I would like to enroll in the *${modalCourse.title}* course (${modalCourse.plan_name} - ₹${modalCourse.plan_price?.toLocaleString("en-IN")}). Please guide me with the next steps.`;
  const url = `https://wa.me/+919605664029?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

  const closeModal = () => {
    setModalOpen(false);
    setModalCourse(null);
    setEnrolled(null);
  };

  const filtered =
    filter === "All" ? courses : courses.filter((c) => c.level === filter);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#FAFAF8",
          fontFamily: "Georgia, serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "24px", color: "#B45309", marginBottom: "12px" }}
          >
            ✦
          </div>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#A8A29E",
            }}
          >
            Loading Courses…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFAF8",
        fontFamily: "'Georgia','Times New Roman',serif",
        color: "#1A1208",
      }}
    >
      <div
        style={{
          height: "4px",
          background:
            "linear-gradient(90deg,#B45309,#6D28D9,#1D4ED8,#047857,#BE123C,#92400E)",
        }}
      />

      <header
        style={{
          textAlign: "center",
          padding: "60px 24px 36px",
          borderBottom: "1px solid #E8E0D0",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "10px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#B45309",
            border: "1px solid #FDE68A",
            background: "#FFFBF0",
            padding: "5px 18px",
            borderRadius: "2px",
            marginBottom: "20px",
          }}
        >
          Stitching Excellence
        </div>
        <h1
          style={{
            fontSize: "clamp(32px,5vw,60px)",
            fontWeight: 400,
            margin: "0 0 14px",
            color: "#1A1208",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Our Courses
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#78716C",
            maxWidth: "460px",
            margin: "0 auto",
            lineHeight: 1.75,
            fontStyle: "italic",
          }}
        >
          From your very first stitch to master-level craftsmanship — find the
          course that fits your journey.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            marginTop: "36px",
            paddingTop: "28px",
            borderTop: "1px solid #F0EAE0",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: String(courses.length), label: "Courses" },
            {
              value: String(courses.reduce((a, c) => a + c.lessons, 0)),
              label: "Total Classes",
            },
            { value: "500+", label: "Students" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 400,
                  color: "#B45309",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#A8A29E",
                  marginTop: "2px",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          padding: "28px 24px",
          background: "#FFFFFF",
          borderBottom: "1px solid #F0EAE0",
          flexWrap: "wrap",
        }}
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 22px",
              borderRadius: "2px",
              border: filter === f ? "1px solid #B45309" : "1px solid #E8E0D0",
              background: filter === f ? "#B45309" : "#FFFFFF",
              color: filter === f ? "#FFFFFF" : "#78716C",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "Georgia,serif",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <main
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "40px 24px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
          gap: "20px",
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "60px 0",
              color: "#A8A29E",
              fontSize: "13px",
              fontStyle: "italic",
            }}
          >
            No courses found for this level.
          </div>
        ) : (
          filtered.map((course) => (
            <div
              key={course.id}
              onClick={() =>
                setSelected(selected === course.id ? null : course.id)
              }
              style={{
                background:
                  selected === course.id ? course.light_bg : "#FFFFFF",
                border:
                  selected === course.id
                    ? `1.5px solid ${course.color}`
                    : "1.5px solid #EDE8E0",
                borderRadius: "6px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow:
                  selected === course.id
                    ? `0 4px 24px ${course.color}22`
                    : "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  height: "4px",
                  background: course.color,
                  opacity: selected === course.id ? 1 : 0.2,
                  transition: "opacity 0.25s",
                }}
              />

              <div style={{ padding: "28px 28px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "50%",
                      background: course.light_bg,
                      border: `1.5px solid ${course.border_color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      color: course.color,
                    }}
                  >
                    {course.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: course.color,
                      background: course.light_bg,
                      border: `1px solid ${course.border_color}`,
                      padding: "4px 12px",
                      borderRadius: "2px",
                    }}
                  >
                    {course.badge}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 400,
                    margin: "0 0 6px",
                    color: "#1A1208",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {course.title}
                </h2>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: course.color,
                    marginBottom: "14px",
                  }}
                >
                  {course.level}
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#78716C",
                    lineHeight: 1.75,
                    margin: "0 0 18px",
                    fontStyle: "italic",
                  }}
                >
                  {course.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                  }}
                >
                  {[
                    { icon: "⏱", text: course.duration },
                    { icon: "📚", text: `${course.lessons} Classes` },
                  ].map((m) => (
                    <span
                      key={m.text}
                      style={{
                        fontSize: "12px",
                        color: "#57534E",
                        background: "#F5F0E8",
                        border: "1px solid #E8E0D0",
                        borderRadius: "2px",
                        padding: "4px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {m.icon} {m.text}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    overflow: "hidden",
                    maxHeight: selected === course.id ? "220px" : "0px",
                    transition: "max-height 0.4s ease",
                  }}
                >
                  <div
                    style={{
                      borderTop: `1px solid ${course.border_color}`,
                      paddingTop: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: course.color,
                        marginBottom: "10px",
                      }}
                    >
                      What You'll Learn
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {course.topics?.map((t) => (
                        <li
                          key={t}
                          style={{
                            fontSize: "13px",
                            color: "#57534E",
                            padding: "6px 0",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            borderBottom: "1px dashed #EDE8E0",
                          }}
                        >
                          <span
                            style={{ color: course.color, fontSize: "8px" }}
                          >
                            ◆
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid #F0EAE0",
                    paddingTop: "18px",
                  }}
                >
                  <button
                    onClick={(e) => handleEnrollClick(e, course)}
                    style={{
                      padding: "10px 24px",
                      background: course.color,
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontFamily: "Georgia,serif",
                    }}
                  >
                    Enroll Now
                  </button>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#A8A29E",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {selected === course.id ? "▲ Less" : "▼ Details"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "28px 24px 40px",
          borderTop: "1px solid #EDE8E0",
          background: "#FFFFFF",
          color: "#C4B89A",
          fontSize: "12px",
          letterSpacing: "0.15em",
        }}
      >
        ✦ Craft Your Future — One Stitch at a Time ✦
      </footer>

      {/* Modal */}
      {modalOpen && modalCourse && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,18,8,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: "6px",
              maxWidth: "420px",
              width: "100%",
              fontFamily: "Georgia,serif",
              overflow: "hidden",
            }}
          >
            <div style={{ height: "4px", background: modalCourse.color }} />

            <div style={{ padding: "32px" }}>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: modalCourse.color,
                      marginBottom: "6px",
                    }}
                  >
                    Enrollment
                  </div>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: 400,
                      color: "#1A1208",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {modalCourse.title}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    background: "none",
                    border: "1px solid #EDE8E0",
                    borderRadius: "2px",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#A8A29E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Notices */}
              {enrolled === "already" && (
                <div
                  style={{
                    background: "#FFFBF0",
                    border: "1px solid #FDE68A",
                    borderRadius: "4px",
                    padding: "12px 16px",
                    marginBottom: "20px",
                    fontSize: "13px",
                    color: "#92400E",
                    fontStyle: "italic",
                  }}
                >
                  ✦ You are already enrolled in this course.
                </div>
              )}
              {enrolled === "ok" && (
                <div
                  style={{
                    background: "#F0FDF8",
                    border: "1px solid #A7F3D0",
                    borderRadius: "4px",
                    padding: "12px 16px",
                    marginBottom: "20px",
                    fontSize: "13px",
                    color: "#047857",
                    fontStyle: "italic",
                  }}
                >
                  ✦ Enrolled successfully! We'll be in touch soon.
                </div>
              )}

              {/* Plan name + price */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    color: "#1A1208",
                    letterSpacing: "0.04em",
                  }}
                >
                  {modalCourse.plan_name}
                </span>
                <span
                  style={{
                    fontSize: "26px",
                    color: modalCourse.color,
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹{modalCourse.plan_price?.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Duration */}
              <div
                style={{
                  fontSize: "11px",
                  color: "#A8A29E",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                {modalCourse.plan_duration}
              </div>

              <div
                style={{ borderTop: "1px solid #F0EAE0", marginBottom: "16px" }}
              />

              {/* Features */}
              <ul style={{ margin: "0 0 24px", padding: 0, listStyle: "none" }}>
                {modalCourse.plan_features?.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: "13px",
                      color: "#57534E",
                      padding: "7px 0",
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      borderBottom: "1px dashed #EDE8E0",
                      fontStyle: "italic",
                    }}
                  >
                    <span
                      style={{
                        color: modalCourse.color,
                        fontSize: "8px",
                        marginTop: "5px",
                        flexShrink: 0,
                      }}
                    >
                      ◆
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Enroll button */}
              <button
                onClick={handleEnroll}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: modalCourse.color,
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontFamily: "Georgia,serif",
                }}
              >
                Enroll via WhatsApp
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#A8A29E",
                  marginTop: "20px",
                  fontStyle: "italic",
                  margin: "20px 0 0",
                }}
              >
                Need help? &nbsp;
                <a
                  href="/#contact"
                  style={{ color: "#B45309", textDecoration: "none" }}
                >
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
