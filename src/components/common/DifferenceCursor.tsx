import React, { useEffect, useRef, useState } from 'react';

export const DifferenceCursor: React.FC = () => {
  const posRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateEnabled = () => {
      const active = media.matches;
      setEnabled(active);
      if (active) {
        document.documentElement.classList.add('has-difference-cursor');
      } else {
        document.documentElement.classList.remove('has-difference-cursor');
      }
    };

    updateEnabled();
    media.addEventListener('change', updateEnabled);

    return () => {
      media.removeEventListener('change', updateEnabled);
      document.documentElement.classList.remove('has-difference-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, [data-cursor="expand"]'
      );
      setIsHovering(Boolean(interactive));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const tick = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.16);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.16);

      if (posRef.current) {
        posRef.current.style.transform = `translate3d(${currentPos.current.x - 16}px, ${
          currentPos.current.y - 16
        }px, 0)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={posRef}
      aria-hidden="true"
      style={{
        mixBlendMode: 'difference',
        opacity: visible ? 1 : 0,
        transition: 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform'
      }}
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999]"
    >
      <div
        style={{
          transform: isHovering ? 'scale(2.5)' : 'scale(1)',
          transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="w-full h-full rounded-full bg-white border border-black"
      />
    </div>
  );
};
