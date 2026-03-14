import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoHover, setIsVideoHover] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOffScreen, setIsOffScreen] = useState(false);

  // Use refs for mouse coordinates to avoid React re-renders on every mouse move
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device supports hover (ignore touch devices like phones/tablets)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Hide default cursor globally
    document.body.classList.add('custom-cursor-active');
    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => {
      setIsClicking(false);
      // Trigger ripple effect
      if (rippleRef.current) {
        rippleRef.current.style.left = `${current.current.x}px`;
        rippleRef.current.style.top = `${current.current.y}px`;
        rippleRef.current.classList.remove('animate-ripple');
        void rippleRef.current.offsetWidth; // Trigger reflow to restart animation
        rippleRef.current.classList.add('animate-ripple');
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements
      const isLink = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer');
      // Check if hovering over video elements
      const isVideo = target.closest('iframe, video, .video-container, [data-video-hover="true"]');

      setIsVideoHover(!!isVideo);
      setIsHovering(!!isLink && !isVideo);
    };

    const onMouseLeave = () => setIsOffScreen(true);
    const onMouseEnter = () => setIsOffScreen(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let animationFrameId: number;

    // Render loop for smooth interpolation (lerp)
    const render = () => {
      // Direct assignment for instant movement matching the system cursor
      current.current.x = mouse.current.x;
      current.current.y = mouse.current.y;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -ml-[18px] -mt-[18px]"
        style={{ willChange: 'transform' }}
      >
        <div className={`relative flex items-center justify-center transition-all duration-300 ease-out
          ${isOffScreen ? 'opacity-0' : 'opacity-100'}
          ${isHovering ? 'scale-150 text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]' : 'scale-100 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}
          ${isVideoHover ? 'scale-125 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-pulse' : ''}
          ${isClicking ? 'scale-90' : ''}
        `}>
          {/* Geometric Triangular Arrow SVG (Based on provided image) */}
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
            {/* Outer boundary */}
            <polygon points="15,15 85,35 35,85" />
            {/* Inner lines to center to create 3D effect */}
            <line x1="15" y1="15" x2="45" y2="45" />
            <line x1="85" y1="35" x2="45" y2="45" />
            <line x1="35" y1="85" x2="45" y2="45" />
          </svg>

          {/* Video Play Icon Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isVideoHover ? 'opacity-100' : 'opacity-0'}`}>
            <Play className="w-4 h-4 text-white ml-2 mt-2" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Click Ripple Effect */}
      <div
        ref={rippleRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-sky-400 pointer-events-none z-[9998] opacity-0"
        style={{ willChange: 'transform, opacity' }}
      />
    </>
  );
}
