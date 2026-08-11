import { useEffect, useState } from "react";

/**
 * Anima gli elementi .reveal solo la prima volta che compaiono.
 * Una volta visibili, applica `.is-revealed` e rimuove l'osservatore per memorizzare lo stato.
 */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            // MEMORIZZAZIONE: smette di osservare l'elemento per non riattivare l'animazione
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => {
      // Se l'elemento era già stato rivelato in precedenza, non lo osserviamo nemmeno
      if (!el.classList.contains("is-revealed")) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);
}

/**
 * Traccia la sezione attiva per la navigazione.
 */
export function useScrollSpy(ids: string[], offset = 100) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      for (let i = ids.length - 1; i >= 0; i--) {
        const element = document.getElementById(ids[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(ids[i]);
          return;
        }
      }
      setActiveId("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [ids, offset]);

  return activeId;
}

/**
 * Nasconde l'header durante lo scroll verso il basso.
 */
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hidden;
}
