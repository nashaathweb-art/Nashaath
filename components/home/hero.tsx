"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface EnrolledCourse {
  id: string;
  title: string;
  color: string;
  level: string;
}

export default function Hero() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          id,
          courses!enrollments_course_id_fkey (
            id,
            title,
            color,
            level
          )
        `)
        .eq("user_id", session.user.id)
        .order("enrolled_at", { ascending: false });

      if (!error && data) {
        const courses = data
          .map((e: any) => e.courses)
          .filter(Boolean);
        setEnrolledCourses(courses);
      }

      setLoading(false);
    };

    fetchEnrollments();
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#FAFAF8",
        fontFamily: "'Georgia','Times New Roman',serif",
      }}
    >
      {/* Top colour strip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg,#B45309,#6D28D9,#BE123C,#047857)",
        }}
      />

      {/* Subtle dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          backgroundImage: `radial-gradient(#B45309 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "120px 24px 80px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "64px",
          flexWrap: "wrap",
        }}
      >
        {/* Left content */}
        <div style={{ flex: 1, minWidth: "300px" }}>
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
              marginBottom: "28px",
            }}
          >
            ✦ Kondotty, Malappuram, Kerala
          </div>

          <h1
            style={{
              fontSize: "clamp(38px,5.5vw,72px)",
              fontWeight: 400,
              color: "#1A1208",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              margin: "0 0 20px",
            }}
          >
            Dressed in
            <br />
            <em style={{ fontStyle: "italic", color: "#B45309" }}>
              Tradition &amp;
            </em>
            <br />
            Grace
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#78716C",
              lineHeight: 1.85,
              maxWidth: "460px",
              margin: "0 0 36px",
              fontStyle: "italic",
            }}
          >
            Custom-made attire for women and children, rooted in the rich
            cultural heritage of Kerala. Every stitch crafted with love, every
            fit tailored to perfection.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/collections"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 32px",
                background: "#B45309",
                color: "#fff",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                borderRadius: "2px",
                textDecoration: "none",
                fontFamily: "Georgia,serif",
                border: "none",
              }}
            >
              Browse Collections →
            </Link>
            <Link
              href="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 32px",
                background: "transparent",
                color: "#B45309",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                borderRadius: "2px",
                textDecoration: "none",
                fontFamily: "Georgia,serif",
                border: "1px solid #FDE68A",
              }}
            >
              Our Story
            </Link>
          </div>

          {/* Trust stats */}
          <div
            style={{
              marginTop: "48px",
              paddingTop: "32px",
              borderTop: "1px solid #EDE8E0",
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "500+", label: "Happy Clients" },
              { value: "6",    label: "Courses Offered" },
              { value: "100%", label: "Custom Fit" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 400,
                    color: "#B45309",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.18em",
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
        </div>

        {/* Right: feature card */}
        <div style={{ flex: 1, minWidth: "300px", maxWidth: "440px" }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #EDE8E0",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {/* Card top accent */}
            <div style={{ height: "4px", background: "#B45309" }} />

            <div style={{ padding: "28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "#FFFBF0",
                      border: "1.5px solid #FDE68A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    ✦
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 400, color: "#1A1208", margin: 0 }}>
                      {isLoggedIn
                        ? enrolledCourses.length > 0
                          ? "My Enrolled Courses"
                          : "No Courses Yet"
                        : "Master Tailoring Course"}
                    </p>
                    <p style={{ fontSize: "11px", color: "#A8A29E", margin: 0, letterSpacing: "0.05em" }}>
                      by Nashaath Boutique
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#047857",
                    background: "#F0FDF8",
                    border: "1px solid #A7F3D0",
                    padding: "3px 10px",
                    borderRadius: "2px",
                  }}
                >
                  {isLoggedIn ? `${enrolledCourses.length} course${enrolledCourses.length !== 1 ? "s" : ""}` : "Enrolling"}
                </span>
              </div>

              {/* Course list or placeholder */}
              <div
                style={{
                  background: "#FFFBF0",
                  border: "1px solid #FDE68A",
                  borderRadius: "4px",
                  marginBottom: "20px",
                  minHeight: "80px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <div style={{ padding: "20px", textAlign: "center" }}>
                    {[1, 2].map(i => (
                      <div key={i} style={{
                        height: "12px",
                        background: "#FDE68A",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        opacity: 0.5,
                        width: i === 1 ? "80%" : "60%",
                      }} />
                    ))}
                  </div>
                ) : isLoggedIn && enrolledCourses.length > 0 ? (
                  <div style={{ padding: "12px" }}>
                    {enrolledCourses.map((course) => (
                      <div
                        key={course.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 10px",
                          marginBottom: "6px",
                          background: "#fff",
                          borderRadius: "4px",
                          border: `1px solid ${course.color}30`,
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: course.color || "#B45309",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "12px", color: "#1A1208", margin: 0 }}>
                            {course.title}
                          </p>
                          {course.level && (
                            <p style={{ fontSize: "10px", color: "#A8A29E", margin: 0 }}>
                              {course.level}
                            </p>
                          )}
                        </div>
                        <Link
                          href="/classes"
                          style={{
                            fontSize: "9px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: course.color || "#B45309",
                            textDecoration: "none",
                          }}
                        >
                          View →
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", fontSize: "36px" }}>
                    🪡
                  </div>
                )}
              </div>

              {/* CTA */}
              {isLoggedIn ? (
                enrolledCourses.length === 0 && (
                  <Link
                    href="/courses"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "10px",
                      background: "#B45309",
                      color: "#fff",
                      fontSize: "10px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      borderRadius: "2px",
                      textDecoration: "none",
                    }}
                  >
                    Browse Courses →
                  </Link>
                )
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#A8A29E" }}>
                      Course Progress
                    </span>
                    <span style={{ fontSize: "12px", color: "#B45309" }}>60%</span>
                  </div>
                  <div style={{ height: "3px", background: "#F0EAE0", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: "60%", height: "100%", background: "#B45309", borderRadius: "2px" }} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Floating badge 1 */}
          <div
            style={{
              marginTop: "12px",
              marginLeft: "-12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#FFFFFF",
              border: "1.5px solid #FDE68A",
              borderRadius: "4px",
              padding: "10px 16px",
            }}
          >
            <span style={{ fontSize: "18px" }}>🏅</span>
            <div>
              <p style={{ fontSize: "12px", color: "#1A1208", margin: 0 }}>Certificate Awarded</p>
              <p style={{ fontSize: "10px", color: "#A8A29E", margin: 0 }}>Upon completion</p>
            </div>
          </div>

          {/* Floating badge 2 */}
          <div
            style={{
              marginTop: "8px",
              marginLeft: "auto",
              marginRight: "-12px",
              display: "flex",
              width: "fit-content",
              alignItems: "center",
              gap: "10px",
              background: "#FFFFFF",
              border: "1.5px solid #A7F3D0",
              borderRadius: "4px",
              padding: "10px 16px",
            }}
          >
            <span style={{ fontSize: "18px" }}>✂️</span>
            <div>
              <p style={{ fontSize: "12px", color: "#1A1208", margin: 0 }}>12 new students</p>
              <p style={{ fontSize: "10px", color: "#A8A29E", margin: 0 }}>joined this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "16px",
          fontSize: "12px",
          letterSpacing: "0.2em",
          color: "#C4B89A",
          borderTop: "1px solid #EDE8E0",
        }}
      >
        ✦ &nbsp; Craft Your Future — One Stitch at a Time &nbsp; ✦
      </div>
    </section>
  );
}