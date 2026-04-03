const stats = [
  { value: "500+", label: "Happy Clients", icon: "✦" },
  { value: "6", label: "Courses Offered", icon: "◈" },
  { value: "154", label: "Total Classes", icon: "◇" },
  { value: "100%", label: "Custom Fit", icon: "❋" },
];

export default function StatsSection() {
  return (
    <section className="bg-white border-t border-b border-stone-200 py-14 font-serif">
      <div className="max-w-3xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center py-6 px-4 ${
                i < stats.length - 1 ? "border-r border-stone-200" : ""
              }`}
            >
              <div className="text-amber-700 text-base tracking-widest mb-2">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-normal text-amber-700 tracking-tight leading-none mb-2">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}