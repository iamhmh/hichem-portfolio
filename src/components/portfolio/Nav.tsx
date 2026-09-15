import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "À propos" },
  { id: "experience", label: "Expérience" },
  { id: "interests", label: "Intérêts" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState<string>("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card text-xs font-semibold">HG</span>
          <span className="hidden sm:inline text-foreground/90">Hichem Gouia</span>
        </a>
        <nav
          className={`hidden rounded-full border border-border bg-card/90 px-2 py-1.5 backdrop-blur md:flex ${
            scrolled ? "shadow-sm" : ""
          }`}
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active === s.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium transition hover:border-foreground/40 md:inline-block"
        >
          Me contacter
        </a>
      </div>
    </header>
  );
}