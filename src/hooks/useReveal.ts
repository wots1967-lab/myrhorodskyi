import { useEffect, useRef, useState } from 'react';

/**
 * iOS-safe reveal hook.
 * Uses IntersectionObserver + CSS class instead of framer-motion inline opacity.
 * Avoids WebKit compositing layer flicker.
 */
export function useReveal(options?: { margin?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options?.margin ?? '-80px',
        threshold: options?.amount ?? 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}
