// components/CoursesSection.tsx
import Link from "next/link";

const previewCourses = [
  { id: 1, title: "Master Tailoring Course", level: "Expert", badge: "Flagship", duration: "6 Months", lessons: 48, color: "#B45309", lightBg: "#FFFBF0", borderColor: "#FDE68A", icon: "✦" },
  { id: 2, title: "Standard Tailoring Course", level: "Intermediate", badge: "Popular", duration: "3 Months", lessons: 28, color: "#1D4ED8", lightBg: "#F0F5FF", borderColor: "#BFDBFE", icon: "◈" },
  { id: 3, title: "Beginner-Friendly Course", level: "Beginner", badge: "Start Here", duration: "6 Weeks", lessons: 16, color: "#047857", lightBg: "#F0FDF8", borderColor: "#A7F3D0", icon: "◇" },
];

export default function CoursesSection() {
  return (
    <section style={{ padding: "64px 24px", background: "#FAFAF8", textAlign: "center", fontFamily: "Georgia, serif" }}>

      <div style={{ display: "inline-block", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#B45309", border: "1px solid #FDE68A", background: "#FFFBF0", padding: "5px 18px", borderRadius: "2px", marginBottom: "20px" }}>
        Stitching Excellence
      </div>

      <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, color: "#1A1208", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
        Explore Our Courses
      </h2>

      <p style={{ fontSize: "15px", color: "#78716C", maxWidth: "420px", margin: "0 auto 40px", lineHeight: 1.75, fontStyle: "italic" }}>
        From your first stitch to master-level craftsmanship — find the course that fits your journey.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", maxWidth: "960px", margin: "0 auto 40px", textAlign: "left" }}>
        {previewCourses.map((course) => (
          <div key={course.id} style={{ background: "#FFFFFF", border: "1.5px solid #EDE8E0", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ height: "3px", background: course.color }} />
            <div style={{ padding: "20px" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: course.lightBg, border: `1.5px solid ${course.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: course.color }}>
                  {course.icon}
                </div>
                <span style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: course.color, background: course.lightBg, border: `1px solid ${course.borderColor}`, padding: "3px 10px", borderRadius: "2px" }}>
                  {course.badge}
                </span>
              </div>

              <div style={{ fontSize: "17px", fontWeight: 400, color: "#1A1208", marginBottom: "4px" }}>
                {course.title}
              </div>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: course.color, marginBottom: "10px" }}>
                {course.level}
              </div>

              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", color: "#57534E", background: "#F5F0E8", border: "1px solid #E8E0D0", borderRadius: "2px", padding: "3px 10px" }}>
                  ⏱ {course.duration}
                </span>
                <span style={{ fontSize: "11px", color: "#57534E", background: "#F5F0E8", border: "1px solid #E8E0D0", borderRadius: "2px", padding: "3px 10px" }}>
                  📚 {course.lessons} Classes
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

      <Link
        href="/courses"
        style={{ display: "inline-block", padding: "12px 36px", background: "#B45309", color: "#FFFFFF", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none", fontFamily: "Georgia, serif" }}
      >
        Explore More Courses →
      </Link>

    </section>
  );
}