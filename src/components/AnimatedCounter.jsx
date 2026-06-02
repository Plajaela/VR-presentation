import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    let frameId;

    const animateCount = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setCount(end);
        return;
      }

      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          setCount(end);
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [duration, end]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{count}{suffix}
    </span>
  );
}
