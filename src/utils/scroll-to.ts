// src/utils/scroll-to.ts
// A robust smooth-scrolling helper for window or a scrollable element.

export type ScrollContainer = Window | Document | HTMLElement | null | undefined;

/**
 * Smoothly scrolls window or a container to a vertical position.
 * @param to        Target scrollTop (px)
 * @param duration  Duration (ms), default 500
 * @param container Window | Document | HTMLElement (default: window)
 * @returns Promise<void> resolves when animation completes
 */
export function scrollTo(
  to: number,
  duration = 500,
  container?: ScrollContainer
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve(); // SSR no-op

  const target = normalizeContainer(container);

  const start = getScrollTop(target);
  const change = to - start;
  const startTime = now();

  // classic easeInOutQuad
  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  return new Promise<void>((resolve) => {
    const step = () => {
      const elapsed = Math.min(now() - startTime, duration);
      const next = easeInOutQuad(elapsed, start, change, duration);
      setScrollTop(target, next);

      if (elapsed < duration) {
        raf(step);
      } else {
        // 確保最後落點精準
        setScrollTop(target, to);
        resolve();
      }
    };
    raf(step);
  });
}

// -------- helpers --------
function normalizeContainer(
  container?: ScrollContainer
): Window | HTMLElement {
  if (!container || container === window || container === document) return window;
  const el =
    (container as any) === document.documentElement
      ? (document.scrollingElement as HTMLElement) || document.documentElement
      : (container as HTMLElement);
  return el;
}

function getScrollTop(target: Window | HTMLElement): number {
  return target === window
    ? window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
    : (target as HTMLElement).scrollTop;
}

function setScrollTop(target: Window | HTMLElement, value: number) {
  if (target === window) {
    window.scrollTo(0, value);
  } else {
    (target as HTMLElement).scrollTop = value;
  }
}

const raf =
  typeof window !== 'undefined' && window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : (cb: FrameRequestCallback) => setTimeout(() => cb(now()), 1000 / 60);

const now =
  (typeof performance !== 'undefined' && performance.now.bind(performance)) ||
  Date.now;

export default scrollTo;
