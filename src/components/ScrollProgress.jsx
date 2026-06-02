import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import '../styles/components/ScrollProgress.css';

/**
 * Global scroll affordances:
 *  - A thin reading-progress bar pinned to the top (only shown when the page
 *    is actually scrollable — e.g. the long project portfolio).
 *  - A "back to top" button that fades in after scrolling down.
 *  - Resets scroll to the top on route change so every section starts at the
 *    top instead of inheriting the previous page's scroll position.
 */
export default function ScrollProgress() {
  const { pathname } = useLocation();
  const [progress, setProgress] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const recompute = useCallback(() => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const y = window.scrollY || doc.scrollTop || 0;
    setScrollable(max > 120);
    setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);
    setShowTop(y > 400);
  }, []);

  useEffect(() => {
    let frame = null;
    const onScroll = () => {
      if (frame === null) {
        frame = requestAnimationFrame(() => {
          frame = null;
          recompute();
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [recompute]);

  // New page → jump to the top, then recompute once the layout has settled.
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(recompute);
    return () => cancelAnimationFrame(id);
  }, [pathname, recompute]);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <>
      {scrollable && (
        <div className="scroll-progress-track" aria-hidden="true">
          <div
            className="scroll-progress-bar"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      )}

      <button
        type="button"
        className={`scroll-to-top-btn ${showTop ? 'is-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        tabIndex={showTop ? 0 : -1}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}
