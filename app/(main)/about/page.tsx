// app/about/page.tsx  (or pages/about.tsx)

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "'Georgia','Times New Roman',serif", color: "#1A1208" }}>

      {/* Top colour strip */}
      <div style={{ height: "4px", background: "linear-gradient(90deg,#B45309,#6D28D9,#BE123C,#047857)" }} />

      {/* Hero */}
      <header style={{ background: "#fff", textAlign: "center", padding: "72px 24px 56px", borderBottom: "1px solid #EDE8E0" }}>
        <div style={{ display: "inline-block", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#B45309", border: "1px solid #FDE68A", background: "#FFFBF0", padding: "5px 18px", borderRadius: "2px", marginBottom: "22px" }}>
          Kondotty, Malappuram, Kerala
        </div>
        <h1 style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 16px", color: "#1A1208" }}>
          About{" "}
          <em style={{ fontStyle: "italic", color: "#B45309" }}>Nashaath</em>
          <br />Boutique
        </h1>
        <p style={{ fontSize: "16px", color: "#78716C", maxWidth: "520px", margin: "0 auto", lineHeight: 1.8, fontStyle: "italic" }}>
          Rooted in rich cultural heritage, crafting beautiful custom-made attire for women and children — one stitch at a time.
        </p>
      </header>

      {/* Our Story */}
      <section style={{ maxWidth: "840px", margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#B45309", marginBottom: "16px" }}>Our Story</div>
        <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 20px", lineHeight: 1.25 }}>
          Where every outfit<br />tells a story
        </h2>
        <p style={{ fontSize: "15px", color: "#57534E", lineHeight: 1.85, marginBottom: "16px", fontStyle: "italic" }}>
          Welcome to Nashaath Boutique. Rooted in the rich cultural heritage of Kondotty, Malappuram, Kerala, we are a passionate clothing brand dedicated to crafting beautiful, custom-made attire for women and children.
        </p>
        <p style={{ fontSize: "15px", color: "#57534E", lineHeight: 1.85, fontStyle: "italic" }}>
          We believe that finding the perfect outfit shouldn't be a compromise, no matter your age. That's why Nashaath Boutique was born out of a simple, beautiful vision: to create stunning dresses that fit perfectly — celebrating a woman's unique style and bringing comfort and joy to your little ones' wardrobes.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #EDE8E0", maxWidth: "840px", margin: "0 auto" }} />

      {/* Our Philosophy */}
      <section style={{ background: "#fff", borderTop: "1px solid #EDE8E0", borderBottom: "1px solid #EDE8E0" }}>
        <div style={{ maxWidth: "840px", margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#B45309", marginBottom: "16px" }}>Our Philosophy</div>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 20px", lineHeight: 1.25 }}>
            More than fabric —<br />it's an expression
          </h2>
          <p style={{ fontSize: "15px", color: "#57534E", lineHeight: 1.85, marginBottom: "16px", fontStyle: "italic" }}>
            We know that an outfit is more than just fabric — it's a way to express yourself and create beautiful memories. Whether you are stepping out for a festive celebration in Kerala, attending a formal gathering, or looking for perfect matching outfits for a special family milestone, our goal is to ensure you feel radiant and your children feel adorable and comfortable.
          </p>
          <p style={{ fontSize: "15px", color: "#57534E", lineHeight: 1.85, fontStyle: "italic" }}>
            We blend timeless modesty and traditional elegance with contemporary designs, ensuring every piece is crafted with love and care for both generations.
          </p>
        </div>
      </section>

      {/* Why Choose Nashaath */}
      <section style={{ maxWidth: "840px", margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#B45309", marginBottom: "16px" }}>Why Choose Nashaath?</div>
        <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 32px", lineHeight: 1.25 }}>
          Crafted with purpose,<br />worn with pride
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "16px" }}>
          {[
            { icon: "✂", title: "Custom-Tailored for All Ages", text: 'We don\'t believe in "one size fits all." From elegant silhouettes for women to playful, comfortable fits for kids — every piece is tailored to your exact measurements.' },
            { icon: "✦", title: "Uncompromising Elegance", text: "From flowing fabrics to intricate detailing, our designs are crafted to make you and your little ones stand out beautifully at every occasion." },
            { icon: "◈", title: "A Personalised Experience", text: "We work closely with our clients from the first inquiry to the final fitting, ensuring absolute perfection in every piece we create together." },
          ].map((item) => (
            <div key={item.title} style={{ border: "1.5px solid #EDE8E0", borderRadius: "6px", padding: "24px", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FFFBF0", border: "1.5px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", color: "#B45309", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 400, letterSpacing: "0.05em", color: "#1A1208", lineHeight: 1.3 }}>{item.title}</h3>
              </div>
              <p style={{ fontSize: "13px", color: "#78716C", lineHeight: 1.75, fontStyle: "italic", margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: "#fff", borderTop: "1px solid #EDE8E0", textAlign: "center", padding: "60px 24px" }}>
        <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, margin: "0 0 12px" }}>Let's Create Something Beautiful</h2>
        <p style={{ fontSize: "15px", color: "#78716C", maxWidth: "440px", margin: "0 auto 32px", lineHeight: 1.8, fontStyle: "italic" }}>
          Your family's wardrobe deserves pieces as unique as you are. Browse our collections and let us bring your dream dresses to reality.
        </p>
        <a href="/collections" style={{ display: "inline-block", padding: "13px 36px", background: "#B45309", color: "#fff", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none", fontFamily: "Georgia,serif" }}>
          Browse Collections →
        </a>
      </div>

      {/* Footer strip */}
      <footer style={{ textAlign: "center", padding: "28px 24px 40px", borderTop: "1px solid #EDE8E0", background: "#fff", color: "#C4B89A", fontSize: "12px", letterSpacing: "0.15em" }}>
        ✦ Nashaath Boutique — Kondotty, Kerala ✦
      </footer>

    </div>
  );
}