const education = [
  { college: "Indian Institute of Information Technology, Design and Manufacturing, Jabalpur", degree: "B.Tech", period: "2022 — 2026", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80" },
];

export function Education() {
  return (
    <section className="relative px-6 pt-24 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs tracking-widest text-muted-foreground">— EDUCATION —</p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Where I studied</h2>
        </div>

        <div className="space-y-3">
          {education.map((e) => (
            <div key={e.college} className="glass grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl p-3">
              <img src={e.image} alt={e.college} className="h-16 w-24 shrink-0 rounded-xl object-cover sm:h-20 sm:w-32" loading="lazy" />
              <div className="min-w-0 pr-3">
                <p className="text-[10px] uppercase tracking-widest text-primary">{e.period}</p>
                <h3 className="truncate font-display text-base font-semibold">{e.college}</h3>
                <p className="truncate text-xs text-muted-foreground">{e.degree}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
