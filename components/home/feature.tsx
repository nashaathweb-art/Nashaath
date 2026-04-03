const features = [
  {
    icon: "✂",
    title: "Custom-Tailored Fitting",
    description:
      "Every garment is stitched to your exact measurements. No compromises, no alterations needed — just a perfect fit from the very first wear.",
    color: "#B45309",
    lightBg: "#FFFBF0",
    borderColor: "#FDE68A",
  },
  {
    icon: "✦",
    title: "Expert-Led Courses",
    description:
      "Learn directly from seasoned tailors with decades of experience in Kerala's rich textile tradition. Hands-on, practical, and deeply personal.",
    color: "#1D4ED8",
    lightBg: "#F0F5FF",
    borderColor: "#BFDBFE",
  },
  {
    icon: "🏅",
    title: "Certified on Completion",
    description:
      "Earn a recognised certificate upon finishing your course — a testament to your craft and a credential you can proudly carry forward.",
    color: "#047857",
    lightBg: "#F0FDF8",
    borderColor: "#A7F3D0",
  },
  {
    icon: "◈",
    title: "Traditional & Modern Designs",
    description:
      "We blend timeless Kerala modesty with contemporary silhouettes — from festive blouses to everyday churidars and matching kids' wear.",
    color: "#6D28D9",
    lightBg: "#F8F5FF",
    borderColor: "#DDD6FE",
  },
  {
    icon: "❋",
    title: "Personal Design Consultation",
    description:
      "Work one-on-one with our designers from first inquiry to final fitting. Your vision, your fabric, your story — we bring it all together.",
    color: "#BE123C",
    lightBg: "#FFF5F7",
    borderColor: "#FECDD3",
  },
  {
    icon: "◇",
    title: "For All Ages & Occasions",
    description:
      "From elegant women's wear to adorable children's outfits — we craft for every age, every celebration, and every cherished milestone.",
    color: "#92400E",
    lightBg: "#FFFBF0",
    borderColor: "#FDE68A",
  },
];

export default function Features() {
  return (
    <section
      style={{
        padding: "80px 24px",
        background: "#FFFFFF",
        fontFamily: "'Georgia','Times New Roman',serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 56px" }}>
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
            Why Nashaath
          </div>
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 42px)",
              fontWeight: 400,
              color: "#1A1208",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 16px",
            }}
          >
            Crafted with Care,
            <br />
            <em style={{ fontStyle: "italic", color: "#B45309" }}>
              Worn with Pride
            </em>
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#78716C",
              lineHeight: 1.85,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            Everything we do — from stitching to teaching — is built around one
            belief: that every person deserves clothing made just for them.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "#FAFAF8",
                border: "1.5px solid #EDE8E0",
                borderRadius: "6px",
                padding: "28px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Left accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "3px",
                  background: f.color,
                  opacity: 0.5,
                }}
              />

              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: f.lightBg,
                  border: `1.5px solid ${f.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: f.color,
                  marginBottom: "16px",
                }}
              >
                {f.icon}
              </div>

              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#1A1208",
                  letterSpacing: "-0.01em",
                  margin: "0 0 10px",
                  lineHeight: 1.3,
                }}
              >
                {f.title}
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "#78716C",
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}