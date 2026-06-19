import { Briefcase, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type TimelineItem = {
  role: string;
  roleMobile?: string;
  company: string;
  companyMobile?: string;
  period: string;
  type: "exp" | "edu";
};

const experience: TimelineItem[] = [
  { 
    role: "Software Engineer", 
    company: "Intern • Skyclad Ventures", 
    period: "Dec 2025 — June 2026",
    type: "exp" 
  },
  { 
    role: "Software Engineer", 
    company: "Intern • Bloop", 
    period: "June 2025 — Aug 2025",
    type: "exp" 
  },
  { 
    role: "Frontend Developer", 
    company: "Intern • Meteorite", 
    period: "Jan 2025 — Feb 2025",
    type: "exp" 
  },
  { 
    role: "Indian Institute of Information Technology, Design and Manufacturing, Jabalpur", 
    roleMobile: "IIITDMJ",
    company: "Bachelor of Technology", 
    companyMobile: "B.Tech",
    period: "Nov 2022 — May 2026",
    type: "edu" 
  },
];

export function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const items = document.querySelectorAll('.timeline-item');
      let minDistance = Infinity;
      let closestIndex = 0;
      // Offset center slightly higher so it triggers a bit earlier when scrolling down
      const centerY = window.innerHeight * 0.4;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        // The icon is at rect.top + 34px
        const iconY = rect.top + 34;
        const distance = Math.abs(centerY - iconY);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      
      setActiveIndex(closestIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="experience" className="relative overflow-hidden px-6 pt-28 pb-16">
      {/* Left-side gradient */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full blur-3xl opacity-60 -z-10"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 45%, transparent), transparent 70%)" }} />

      <div className="relative mx-auto max-w-3xl z-10">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs tracking-widest text-muted-foreground">— EXPERIENCE & EDUCATION —</p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Places I made a stay</h2>
        </div>

        {/* Alternating timeline */}
        <div className="relative">
          <div aria-hidden className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent" />
          <div className="space-y-8">
            {experience.map((e, i) => {
              const left = i % 2 === 0;
              const Icon = e.type === "edu" ? GraduationCap : Briefcase;
              
              return (
                <div key={e.role + e.company} className="timeline-item relative grid grid-cols-2 gap-12 md:gap-16">
                  {/* Center Icon with sliding drop */}
                  <div className="absolute left-1/2 top-[34px] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background border border-border shadow-sm text-foreground transition-colors duration-500">
                    {activeIndex === i && (
                      <motion.div
                        layoutId="active-timeline-drop"
                        className="absolute inset-0 rounded-full bg-primary/20 shadow-[0_0_15px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={`h-4 w-4 relative z-10 transition-colors duration-500 ${activeIndex === i ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>

                  {left ? (
                    <>
                      <div className={`relative overflow-hidden glass rounded-2xl p-6 text-right border-[0.5px] border-border/20 shadow-none transition-all duration-500 ${activeIndex === i ? 'border-primary/30' : ''}`}>
                        <div className={`pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary/15 to-transparent transition-opacity duration-500 ${activeIndex === i ? 'opacity-100' : 'opacity-0'}`} />
                        <div className="relative z-10">
                          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${activeIndex === i ? 'max-h-10 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{e.period}</p>
                          </div>
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {e.roleMobile ? (
                              <>
                                <span className="hidden sm:inline">{e.role}</span>
                                <span className="sm:hidden">{e.roleMobile}</span>
                              </>
                            ) : e.role}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {e.companyMobile ? (
                              <>
                                <span className="hidden sm:inline">{e.company}</span>
                                <span className="sm:hidden">{e.companyMobile}</span>
                              </>
                            ) : e.company}
                          </p>
                        </div>
                      </div>
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <div className={`relative overflow-hidden glass rounded-2xl p-6 text-left border-[0.5px] border-border/20 shadow-none transition-all duration-500 ${activeIndex === i ? 'border-primary/30' : ''}`}>
                        <div className={`pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-primary/15 to-transparent transition-opacity duration-500 ${activeIndex === i ? 'opacity-100' : 'opacity-0'}`} />
                        <div className="relative z-10">
                          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${activeIndex === i ? 'max-h-10 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{e.period}</p>
                          </div>
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {e.roleMobile ? (
                              <>
                                <span className="hidden sm:inline">{e.role}</span>
                                <span className="sm:hidden">{e.roleMobile}</span>
                              </>
                            ) : e.role}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {e.companyMobile ? (
                              <>
                                <span className="hidden sm:inline">{e.company}</span>
                                <span className="sm:hidden">{e.companyMobile}</span>
                              </>
                            ) : e.company}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
