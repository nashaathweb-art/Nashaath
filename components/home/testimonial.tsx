const testimonials = [
  {
    name: "Fathima Rashida",
    role: "Master Tailoring Course Graduate",
    avatar: "FR",
    rating: 5,
    text: "Nashaath Boutique transformed the way I stitch. The Master Tailoring Course was so detailed and practical — I now run my own boutique in Kondotty with full confidence. Every technique I learned here is something I use daily.",
  },
  {
    name: "Mariyam Siddiqui",
    role: "Blouse Mastery Course Graduate",
    avatar: "MS",
    rating: 5,
    text: "The Blouse Mastery Course was exactly what I needed. The instructor walked us through every collar and sleeve variation with such patience. My clients now specifically request the Kerala-style blouses I learned here.",
  },
  {
    name: "Sana Beevi",
    role: "Beginner Course Graduate",
    avatar: "SB",
    rating: 5,
    text: "I had zero experience before joining. Within 6 weeks I stitched my first complete outfit for my daughter. The step-by-step guidance made everything feel achievable. I'm now enrolled in the Standard Course!",
  },
  {
    name: "Nusrath Hameed",
    role: "Churidar Course Graduate",
    avatar: "NH",
    rating: 5,
    text: "I've tried other tailoring classes before but nothing compared to the quality of teaching here. The Churidar course covered styles I'd never even seen elsewhere. Worth every moment.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-stone-50 font-serif overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-block text-[10px] uppercase tracking-[0.35em] text-amber-700 border border-amber-200 bg-amber-50 px-4 py-1.5 rounded-[2px] mb-5">
            Student Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-normal text-stone-900 tracking-tight leading-[1.1] mb-4">
            Sewn with{" "}
            <em className="italic text-amber-700">Love &amp; Trust</em>
          </h2>
          <p className="text-stone-500 text-base leading-relaxed italic">
            From complete beginners to skilled tailors — here's what our students and clients have to say.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-stone-200 rounded-[6px] p-7 relative overflow-hidden"
            >
              {/* Left accent bar */}
              <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-amber-600 opacity-40" />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-stone-600 text-sm leading-relaxed italic mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Divider */}
              <div className="border-t border-stone-100 pt-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-xs font-normal tracking-wide flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-stone-900 font-normal text-sm">{t.name}</p>
                    <p className="text-stone-400 text-[11px] tracking-wide uppercase mt-0.5">{t.role}</p>
                  </div>
                  <div className="ml-auto text-amber-200 text-2xl leading-none">&ldquo;</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}