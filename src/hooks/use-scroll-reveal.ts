import { useEffect, useState, useRef } from "react";

/** Rivela gli elementi con classe "reveal" in modo fluido e performante. */
export function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Una volta visibile, smetti di osservarlo per evitare ricalcoli inutili
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Nasconde l'header quando si scende e lo mostra quando si sale, sincronizzato con i frame del display. */
export function useHideOnScroll(threshold = 90) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const updateScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > threshold);
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}

/** Sincronizza la voce attiva del menu senza forzare reflow continui nel DOM. */
export function useScrollSpy(ids: string[], offset = 80) {
  const [active, setActive] = useState(ids[0] ?? "");
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Cache dei riferimenti DOM per non fare document.getElementById ad ogni frame
  useEffect(() => {
    const map = new Map<string, HTMLElement>();
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) map.set(id, el);
    });
    elementsRef.current = map;
  }, [ids]);

  useEffect(() => {
    let ticking = false;

    const checkActive = () => {
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = elementsRef.current.get(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) {
          current = id;
        }
      }
      setActive((prev) => (prev !== current ? current : prev));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkActive);
        ticking = true;
      }
    };

    checkActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);

  return active;
}
