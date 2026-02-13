import {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
  useId,
  memo,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CurvedLoop = ({
  marqueeText = "",
  speed = 2,
  className,
  curveAmount = 400,
  direction = "left",
  interactive = true,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (
      (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0"
    );
  }, [marqueeText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);
  const momentumRef = useRef(0);
  const offsetRef = useRef(0);
  const ready = spacing > 0;

  const textLength = spacing;
  const totalText = useMemo(
    () =>
      textLength
        ? Array(Math.ceil(1800 / textLength) + 2)
            .fill(text)
            .join("")
        : text,
    [textLength, text],
  );

  // Scroll-triggered reveal animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Fade in and scale up on scroll
      gsap.from(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 50,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none none",
          onEnter: () => setIsVisible(true),
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Measure text width once layout is ready
  useLayoutEffect(() => {
    if (measureRef.current)
      setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing || !ready || !textPathRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Static position for reduced motion
      textPathRef.current.setAttribute("startOffset", "0px");
      return;
    }

    let lastTime = performance.now();
    let offset = -spacing;
    offsetRef.current = offset;
    textPathRef.current.setAttribute("startOffset", offset + "px");

    // Add will-change hint
    if (textPathRef.current.parentElement) {
      textPathRef.current.parentElement.style.willChange = "transform";
    }

    const loop = (time) => {
      // Throttle to 60fps
      const deltaTime = time - lastTime;
      if (deltaTime < 16) {
        requestAnimationFrame(loop);
        return;
      }

      const normalizedDelta = deltaTime / 16.67; // normalize to ~60fps
      lastTime = time;

      if (!dragRef.current && textPathRef.current) {
        // Enhanced smooth motion with better momentum
        const baseSpeed = dirRef.current === "right" ? speed : -speed;
        momentumRef.current *= 0.92; // Slightly less friction for smoother feel
        const delta = baseSpeed + momentumRef.current * 0.6; // More momentum influence

        offset += delta * normalizedDelta;
        const wrapPoint = spacing;
        if (offset <= -wrapPoint) offset += wrapPoint;
        if (offset > 0) offset -= wrapPoint;

        textPathRef.current.setAttribute("startOffset", offset + "px");
        offsetRef.current = offset;
      }

      requestAnimationFrame(loop);
    };

    const frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      // Clean up will-change
      if (textPathRef.current?.parentElement) {
        textPathRef.current.parentElement.style.willChange = "auto";
      }
    };
  }, [spacing, speed, ready]);

  const onPointerDown = (e) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    momentumRef.current = 0;
    e.target.setPointerCapture(e.pointerId);

    // Scale down slightly on grab
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 0.98,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const onPointerMove = (e) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;

    let newOffset = offsetRef.current + dx;
    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;

    offsetRef.current = newOffset;
    textPathRef.current.setAttribute("startOffset", newOffset + "px");
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
    momentumRef.current = velRef.current * 1.5; // Enhanced momentum on release

    // Scale back to normal
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
      });
    }
  };

  const cursorStyle = interactive
    ? dragRef.current
      ? "grabbing"
      : "grab"
    : "auto";

  return (
    <div
      ref={containerRef}
      className="min-h-[40vh] flex items-center justify-center w-full"
      style={{
        visibility: ready ? "visible" : "hidden",
        cursor: cursorStyle,
        willChange: isVisible ? "transform, opacity" : "auto",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="select-none w-full overflow-visible block aspect-[100/12] text-[6rem] font-bold uppercase leading-none"
        viewBox="0 0 1440 120"
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
        >
          {text}
        </text>
        <defs>
          <path
            ref={pathRef}
            id={pathId}
            d={pathD}
            fill="none"
            stroke="transparent"
          />
        </defs>
        {ready && (
          <text xmlSpace="preserve" className={`fill-white ${className ?? ""}`}>
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={offsetRef.current + "px"}
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

// Export with memo to prevent unnecessary re-renders
export default memo(CurvedLoop);
