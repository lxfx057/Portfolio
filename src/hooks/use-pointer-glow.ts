import { useEffect, useState, useRef } from "react";

/** Aggiorna --mx/--my sul documento seguendo il puntatore, sincronizzato a 60/120fps. */
export function usePointerGlow() {
  useEffect(() => {
    let ticking = false;
    let latestX = 0;
    let latestY = 0;

    const updateVars = () => {
      document.documentElement.style.setProperty("--mx", `${latestX}px`);
      document.documentElement.style.setProperty("--my", `${latestY}px`);
      ticking = false;
    };

    const onMove = (e: PointerEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;

      if (!ticking) {
        window.requestAnimationFrame(updateVars);
        ticking = true;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

/** 
 * Percentuale di scroll della pagina (0 → 1).
 * Utilizza requestAnimationFrame e aggiornamenti di stato condizionali per zero lag.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;

      // Aggiorna React SOLO se la differenza è percepibile (evita render inutili)
      if (Math.abs(nextProgress - progressRef.current) > 0.002) {
        progressRef.current = nextProgress;
        setProgress(nextProgress);
      }

      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    updateProgress();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return progress;
}
