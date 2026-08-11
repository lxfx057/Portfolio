import { useRef, useState, memo, useCallback, type MouseEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useScrollReveal, useScrollSpy, useHideOnScroll } from "@/hooks/use-scroll-reveal";
import { usePointerGlow, useScrollProgress } from "@/hooks/use-pointer-glow";

const TITLE = "Luca Finaldi — UI/UX Designer & Web App Developer";
const DESCRIPTION =
  "Portfolio di Luca Finaldi, UI/UX designer e web app developer italiano: siti sicuri e responsive per desktop e smartphone, machine learning e full stack.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const expert = [
  "Python",
  "React",
  "PHP",
  "Go",
  "Scala",
  "HTML",
  "CSS",
  "JavaScript",
  "Bash",
  "Next.js",
  "Vite",
  "Vim",
];

const skilled = [
  "Assembly",
  "C",
  "Tailwind CSS",
  "Java",
  "Kotlin",
  "Django",
  "MongoDB",
  "Docker",
  "Arch Linux",
  "NixOS",
  "Red Hat",
  "FreeBSD",
];

const now = [
  {
    icon: "🔭",
    title: "Su cosa lavoro",
    text: "Offline Automation: flussi automatizzati che funzionano anche senza connessione.",
  },
  {
    icon: "🌱",
    title: "Cosa sto imparando",
    text: "Assembly e C, per capire davvero cosa succede sotto il cofano.",
  },
  {
    icon: "🤝",
    title: "Cerco confronto su",
    text: "Come migliorare i workflow senza aggiungere complessità superflua.",
  },
  {
    icon: "💬",
    title: "Chiedimi di",
    text: "Python, React, PHP, Go e Scala.",
  },
  {
    icon: "⚡",
    title: "Fun fact",
    text: "Consumo più acqua al giorno di ChatGPT.",
  },
];

const nav = [
  { label: "Chi sono", id: "about" },
  { label: "Servizi", id: "services" },
  { label: "Competenze", id: "skills" },
  { label: "Adesso", id: "learning" },
  { label: "Contatti", id: "contact" },
];

const services = [
  {
    title: "UI/UX Design",
    text: "Wireframe, design system e prototipi ad alta fedeltà pensati per la chiarezza e la conversione.",
  },
  {
    title: "Web app responsive",
    text: "Interfacce fluide da desktop a smartphone, ottimizzate per performance e accessibilità.",
  },
  {
    title: "Sviluppo full stack",
    text: "Dal front-end al server: API, database e deploy con architetture semplici e mantenibili.",
  },
  {
    title: "Sicurezza & performance",
    text: "Best practice di sicurezza, audit delle dipendenze e ottimizzazione dei tempi di caricamento.",
  },
];

const sectionIds = nav.map((n) => n.id);

const process = [
  {
    step: "01",
    title: "Ascolto & analisi",
    text: "Capisco obiettivi, utenti e vincoli prima di disegnare qualsiasi schermata.",
  },
  {
    step: "02",
    title: "Design & prototipo",
    text: "Wireframe rapidi, poi UI ad alta fedeltà testabile su desktop e mobile.",
  },
  {
    step: "03",
    title: "Sviluppo",
    text: "Codice pulito, componenti riutilizzabili, attenzione a performance e sicurezza.",
  },
  {
    step: "04",
    title: "Rilascio & cura",
    text: "Deploy, misurazione e iterazioni continue sui dettagli che contano.",
  },
];

const aboutStats = [
  ["5", "Linguaggi principali"],
  ["UI/UX", "Design end-to-end"],
  ["Web+Mobile", "Responsive"],
  ["Offline", "Automation"],
];

const contactLinks = [
  { label: "Email", value: "lucafinaldi3@gmail.com", href: "mailto:lucafinaldi3@gmail.com" },
  {
    label: "LinkedIn",
    value: "Luca Finaldi",
    href: "https://www.linkedin.com/in/luca-finaldi-840a44309/",
  },
  { label: "Instagram", value: "@lukefinaldi_", href: "https://instagram.com/lukefinaldi_" },
  { label: "WhatsApp", value: "+39 392 4484032", href: "https://wa.me/393924484032" },
];

/** Etichetta numerata sopra ai titoli di sezione. */
const Eyebrow = memo(function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <p className="reveal mb-4 flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-primary uppercase">
      <span className="tabular-nums opacity-60">{index}</span>
      <span className="h-px w-8 bg-primary/40" />
      {label}
    </p>
  );
});

/** Titolo con animazione lettera per lettera alleggerita. */
const SplitText = memo(function SplitText({ text, delay = 0 }: { text: string; delay?: number }) {
  let globalIdx = 0;
  return (
    <>
      {text.split(" ").map((word, w) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
          {word.split("").map((ch) => {
            const d = (delay + globalIdx * 0.025).toFixed(3);
            globalIdx++;
            return (
              <span
                key={`${ch}-${globalIdx}`}
                className="char-in"
                style={{ animationDelay: `${d}s` }}
              >
                {ch}
              </span>
            );
          })}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </>
  );
});

/** Card con glow e tilt 3D leggero e zero impatto sullo scroll. */
const GlowCard = memo(function GlowCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const w = el.offsetWidth || 1;
    const h = el.offsetHeight || 1;

    el.style.setProperty("--px", `${x}px`);
    el.style.setProperty("--py", `${y}px`);
    el.style.transform = `perspective(900px) rotateX(${(((y / h) - 0.5) * -4).toFixed(1)}deg) rotateY(${(((x / w) - 0.5) * 4).toFixed(1)}deg) translateY(-2px)`;
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "";
    }
  }, []);

  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`card-glow transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
});

const Marquee = memo(function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden py-1">
      <div
        className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}
        style={{ ["--dur" as string]: `${items.length * 3.2}s` }}
      >
        {loop.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium whitespace-nowrap backdrop-blur transition-colors hover:border-primary hover:text-primary"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
});

const ContactForm = memo(function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const text = `Ciao Luca, sono ${name || "..."}. ${message}`.trim();

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="reveal mx-auto mt-10 max-w-xl space-y-3 text-left"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Il tuo nome"
        aria-label="Il tuo nome"
        className="w-full rounded-2xl border border-surface-dark-foreground/15 bg-surface-dark-foreground/5 px-4 py-3 text-sm outline-none transition-all placeholder:text-surface-dark-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Scrivi il tuo messaggio…"
        aria-label="Messaggio"
        className="w-full resize-none rounded-2xl border border-surface-dark-foreground/15 bg-surface-dark-foreground/5 px-4 py-3 text-sm outline-none transition-all placeholder:text-surface-dark-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <div className="flex flex-col gap-3 pt-1 sm:flex-row">
        <a
          href={`https://wa.me/393924484032?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03] active:scale-95"
        >
          Invia su WhatsApp
        </a>
        <a
          href={`mailto:lucafinaldi3@gmail.com?subject=${encodeURIComponent(
            `Contatto dal portfolio — ${name || "Nuovo messaggio"}`,
          )}&body=${encodeURIComponent(text)}`}
          className="flex-1 rounded-full border border-surface-dark-foreground/25 px-6 py-3 text-center text-sm font-medium transition-all duration-300 hover:scale-[1.03] hover:bg-surface-dark-foreground/10 active:scale-95"
        >
          Invia via Email
        </a>
      </div>
    </form>
  );
});

function Index() {
  useScrollReveal();
  usePointerGlow();
  const progress = useScrollProgress();
  const active = useScrollSpy(sectionIds, 120);
  const hidden = useHideOnScroll();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="aurora" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="glow-cursor hidden md:block" aria-hidden="true" />
      <div
        className="scroll-progress w-full"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl transition-all duration-500 ease-out ${
          hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <nav className="mx-auto flex h-11 max-w-5xl items-center justify-between px-5 text-[12px]">
          <a href="#top" className="font-medium tracking-tight">
            Luca Finaldi
          </a>
          <ul className="hidden gap-7 text-muted-foreground sm:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`relative py-3 transition-colors hover:text-foreground ${
                    active === item.id ? "text-foreground" : ""
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-px h-px origin-left bg-primary transition-transform duration-500 ${
                      active === item.id ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="https://github.com/lxfx057"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </header>

      {/* Pill nav mobile */}
      <nav
        className={`fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 transition-all duration-500 ease-out sm:hidden ${
          hidden ? "translate-y-24 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <ul className="flex gap-1 rounded-full border border-border/70 bg-background/80 p-1 text-[11px] shadow-lg backdrop-blur-xl">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block rounded-full px-3 py-2 transition-all duration-300 ${
                  active === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main id="top" className="pt-11">
        <section className="relative overflow-hidden bg-surface-dark text-surface-dark-foreground">
          <div className="grid-lines" aria-hidden="true" />
          <div className="float-slow pointer-events-none absolute -top-24 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" aria-hidden="true" />
          <div className="relative mx-auto max-w-5xl px-5 py-28 text-center sm:py-40">
            <p className="reveal inline-flex items-center gap-2 rounded-full border border-surface-dark-foreground/15 px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              UI/UX Designer · Web App Developer · Italia
            </p>
            <h1 className="mt-5 text-[clamp(2.75rem,9vw,5.75rem)] leading-[1.03] font-semibold">
              <span className="reveal block text-shine">Luca Finaldi.</span>
              <span className="block">
                <SplitText text="Esperienze digitali" delay={0.45} />
              </span>
              <span className="block text-surface-dark-foreground/45">
                <SplitText text="ad alte prestazioni." delay={0.9} />
              </span>
            </h1>
            <p className="reveal mx-auto mt-7 max-w-xl text-lg text-surface-dark-foreground/60">
              Progetto e sviluppo interfacce responsive per desktop e smartphone, con attenzione
              alla sicurezza e alle prestazioni. In questo periodo lavoro su Offline Automation e
              studio Assembly e C.
            </p>
            <div className="reveal mt-9 flex items-center justify-center gap-5 text-[15px]">
              <a
                href="#contact"
                className="group relative overflow-hidden rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-[0_0_30px_-6px] shadow-primary/60 transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Contattami</span>
                <span className="absolute inset-0 -translate-x-full bg-surface-dark-foreground/25 transition-transform duration-700 group-hover:translate-x-full" />
              </a>
              <a
                href="#skills"
                className="group font-medium text-primary transition-opacity hover:opacity-75"
              >
                Scopri di più{" "}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  ›
                </span>
              </a>
            </div>
            <div className="reveal mt-16 space-y-3">
              <Marquee items={expert} />
              <Marquee items={skilled} reverse />
            </div>
          </div>
        </section>

        <section id="about" className="relative mx-auto max-w-3xl px-5 py-24 sm:py-32">
          <Eyebrow index="01" label="Chi sono" />
          <h2 className="reveal text-[clamp(1.9rem,5vw,3rem)] leading-tight font-semibold">
            UI/UX designer e sviluppatore italiano: interfacce chiare, veloci e sicure.
          </h2>
          <p className="reveal mt-6 text-lg text-muted-foreground">
            Disegno e realizzo esperienze pensate sia per desktop che per smartphone, con
            architetture solide dal front-end al server e buone pratiche di sicurezza. Lavoro
            soprattutto con Python, React, PHP, Go e Scala, e scrivo articoli sul mio portfolio.
          </p>
          <dl className="reveal mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-4">
            {aboutStats.map(([value, label]) => (
              <GlowCard key={label} className="bg-card px-4 py-7 text-center">
                <dt className="text-xl font-semibold sm:text-2xl">{value}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
              </GlowCard>
            ))}
          </dl>
        </section>

        <section id="services" className="mx-auto max-w-5xl px-5 pb-8 sm:pb-12">
          <Eyebrow index="02" label="Servizi" />
          <h2 className="reveal text-[clamp(1.9rem,5vw,3rem)] font-semibold">Cosa faccio.</h2>
          <p className="reveal mt-4 max-w-xl text-lg text-muted-foreground">
            Un unico interlocutore dal design all'ultima riga di codice.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {services.map((s, i) => (
              <GlowCard
                key={s.title}
                style={{ ["--d" as string]: `${i * 0.09}s` }}
                className="reveal lift rounded-3xl bg-card p-8 ring-1 ring-border"
              >
                <span className="text-xs font-medium tracking-widest text-primary uppercase">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-muted-foreground">{s.text}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-24 sm:py-28">
          <Eyebrow index="03" label="Metodo" />
          <h2 className="reveal text-[clamp(1.9rem,5vw,3rem)] font-semibold">Come lavoro.</h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.step}>
                <GlowCard
                  style={{ ["--d" as string]: `${i * 0.08}s` }}
                  className="reveal h-full bg-card p-7"
                >
                  <span className="text-xs font-semibold tracking-widest text-primary tabular-nums">
                    {p.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                </GlowCard>
              </li>
            ))}
          </ol>
        </section>

        <section id="skills" className="mt-16 bg-secondary/70 py-24 backdrop-blur-sm sm:py-32">
          <div className="mx-auto max-w-5xl px-5">
            <Eyebrow index="04" label="Stack" />
            <h2 className="reveal text-[clamp(1.9rem,5vw,3rem)] font-semibold">Competenze.</h2>
            <div className="mt-12 space-y-8">
              <div className="reveal">
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Expert in
                </h3>
                <Marquee items={expert} />
              </div>
              <div className="reveal">
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Skilled in
                </h3>
                <Marquee items={skilled} reverse />
              </div>
            </div>
          </div>
        </section>

        <section id="learning" className="mx-auto max-w-5xl px-5 py-24 sm:py-32">
          <Eyebrow index="05" label="Adesso" />
          <h2 className="reveal text-[clamp(1.9rem,5vw,3rem)] font-semibold">
            Adesso.
          </h2>
          <p className="reveal mt-4 max-w-xl text-lg text-muted-foreground">
            A cosa sto lavorando e cosa sto studiando in questo periodo.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {now.map((item, i) => (
              <GlowCard
                key={item.title}
                style={{ ["--d" as string]: `${i * 0.07}s` }}
                className="reveal lift rounded-3xl bg-card p-8 ring-1 ring-border"
              >
                <span className="text-2xl" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.text}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="relative overflow-hidden bg-surface-dark py-24 pb-32 text-surface-dark-foreground sm:py-32"
        >
          <div className="grid-lines" aria-hidden="true" />
          <div className="float-slow pointer-events-none absolute -bottom-32 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl px-5 text-center">
            <p className="reveal mb-4 text-xs font-medium tracking-[0.2em] text-primary uppercase">
              06 — Contatti
            </p>
            <h2 className="reveal text-[clamp(1.9rem,5vw,3rem)] font-semibold">Parliamone.</h2>
            <p className="reveal mx-auto mt-4 max-w-lg text-lg text-surface-dark-foreground/60">
              Progetti, collaborazioni o semplice curiosità: scrivimi dove preferisci.
            </p>
            <ContactForm />
            <div className="reveal mt-10 grid gap-px overflow-hidden rounded-3xl bg-surface-dark-foreground/10 sm:grid-cols-2">
              {contactLinks.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-surface-dark px-5 py-8 transition-colors hover:bg-surface-dark-foreground/5"
                >
                  <span className="block text-xs tracking-wide text-surface-dark-foreground/50 uppercase">
                    {c.label}
                  </span>
                  <span className="mt-2 block text-sm font-medium break-words">{c.value}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Luca Finaldi. Tutti i diritti riservati.
      </footer>

      <a
        href="#top"
        aria-label="Torna su"
        className={`glass fixed right-5 bottom-5 z-50 hidden size-11 place-items-center rounded-full text-sm transition-all duration-500 sm:grid ${
          progress > 0.15 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        } hover:scale-110 active:scale-95`}
      >
        ↑
      </a>
    </div>
  );
}
