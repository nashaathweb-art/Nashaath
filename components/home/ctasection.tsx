import Link from "next/link";

export default function CTASection() {
  return (
    <section
      style={{
        padding: "80px 24px",
        background: "#FAFAF8",
        fontFamily: "'Georgia','Times New Roman',serif",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            background: "#FFFFFF",
            border: "1.5px solid #EDE8E0",
            borderRadius: "6px",
            padding: "64px 48px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Top accent bar */}
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
              opacity: 0.03,
              backgroundImage: `radial-gradient(#B45309 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
              pointerEvents: "none",
            }}
          />

          {/* Corner decorative stitches */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "20px",
              fontSize: "14px",
              color: "#FDE68A",
              letterSpacing: "4px",
            }}
          >
            ✦ ✦ ✦
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              right: "20px",
              fontSize: "14px",
              color: "#FDE68A",
              letterSpacing: "4px",
            }}
          >
            ✦ ✦ ✦
          </div>

          <div style={{ position: "relative" }}>
            {/* Eyebrow label */}
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
                marginBottom: "24px",
              }}
            >
              Begin Your Journey
            </div>

            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 400,
                color: "#1A1208",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "0 0 16px",
              }}
            >
              Let's Create
              <br />
              <em style={{ fontStyle: "italic", color: "#B45309" }}>
                Something Beautiful
              </em>
            </h2>

            <p
              style={{
                fontSize: "15px",
                color: "#78716C",
                maxWidth: "460px",
                margin: "0 auto 36px",
                lineHeight: 1.85,
                fontStyle: "italic",
              }}
            >
              Join 500+ students and clients who trust Nashaath Boutique for
              custom-tailored attire and professional stitching courses rooted
              in Kerala's rich heritage.
            </p>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "28px",
              }}
            >
              <Link
                href="/enroll"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 36px",
                  background: "#B45309",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  textDecoration: "none",
                  fontFamily: "Georgia,serif",
                }}
              >
                Enroll Now →
              </Link>
              <Link
                href="/courses"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 36px",
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
                Browse Courses
              </Link>
            </div>

            {/* Trust chips */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                "✦ Custom-Tailored Fit",
                "✦ Expert Instructors",
                "✦ Kerala Heritage",
              ].map((item) => (
                <span
                  key={item}
                  style={{
                    fontSize: "11px",
                    color: "#A8A29E",
                    letterSpacing: "0.1em",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}