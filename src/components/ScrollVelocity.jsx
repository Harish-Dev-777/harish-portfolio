import { useRef, useLayoutEffect, useState, memo, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "motion/react";

function useElementWidth(ref) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

const VelocityText = memo(
  ({
    children,
    baseVelocity = 100,
    scrollContainerRef,
    className = "",
    damping,
    stiffness,
    numCopies,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
  }) => {
    const baseX = useMotionValue(0);
    const scrollOptions = scrollContainerRef
      ? { container: scrollContainerRef }
      : {};
    const { scrollY } = useScroll(scrollOptions);
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: damping ?? 50,
      stiffness: stiffness ?? 400,
    });
    const velocityFactor = useTransform(
      smoothVelocity,
      velocityMapping?.input || [0, 1000],
      velocityMapping?.output || [0, 5],
      { clamp: false },
    );

    const copyRef = useRef(null);
    const copyWidth = useElementWidth(copyRef);

    // wrapping function
    const wrap = useCallback((min, max, v) => {
      const range = max - min;
      const mod = (((v - min) % range) + range) % range;
      return mod + min;
    }, []);

    const x = useTransform(baseX, (v) => {
      if (copyWidth === 0) return "0px";
      return `${wrap(-copyWidth, 0, v)}px`;
    });

    const directionFactor = useRef(1);

    // Check for reduced motion
    const prefersReducedMotion = useRef(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    useAnimationFrame((t, delta) => {
      if (prefersReducedMotion.current) return;

      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();
      baseX.set(baseX.get() + moveBy);
    });

    const spans = [];
    for (let i = 0; i < (numCopies ?? 1); i++) {
      spans.push(
        <span
          className={`flex-shrink-0 ${className}`}
          key={i}
          ref={i === 0 ? copyRef : null}
        >
          {children}
        </span>,
      );
    }

    // Optimized center fade highlight logic with throttling
    const scrollerRef = useRef(null);
    const lastOpacityUpdate = useRef(0);
    const spansRef = useRef([]); // Cache spans

    // Update spans cache when children/copies change
    useLayoutEffect(() => {
      if (scrollerRef.current) {
        spansRef.current = Array.from(
          scrollerRef.current.querySelectorAll("span"),
        );
      }
    }, [numCopies, children]);

    useAnimationFrame((time) => {
      if (!scrollerRef.current || prefersReducedMotion.current) return;

      // Throttle opacity updates to every 32ms (~30fps) for better performance
      if (time - lastOpacityUpdate.current < 32) return;
      lastOpacityUpdate.current = time;

      const centerX = window.innerWidth / 2;
      const threshold = window.innerWidth / 4;

      spansRef.current.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const spanCenter = rect.left + rect.width / 2;
        const distance = Math.abs(centerX - spanCenter);

        // Adjust opacity based on distance from center
        const opacity = Math.max(0.3, 1 - distance / threshold);
        span.style.opacity = opacity;
      });
    });

    return (
      <div
        className={`${parallaxClassName} relative overflow-hidden`}
        style={parallaxStyle}
      >
        <motion.div
          ref={scrollerRef}
          className={`${scrollerClassName} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-[5rem]`}
          style={{
            x: prefersReducedMotion.current ? 0 : x,
            willChange: prefersReducedMotion.current ? "auto" : "transform",
            ...scrollerStyle,
          }}
        >
          {spans}
        </motion.div>
      </div>
    );
  },
);

VelocityText.displayName = "VelocityText";

export const ScrollVelocity = memo(
  ({
    scrollContainerRef,
    texts = [],
    velocity = 100,
    className = "",
    damping = 50,
    stiffness = 400,
    numCopies = 6,
    velocityMapping = { input: [0, 1000], output: [0, 5] },
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
  }) => {
    return (
      <section>
        {texts.map((text, index) => (
          <VelocityText
            key={index}
            className={className}
            baseVelocity={index % 2 !== 0 ? -velocity : velocity}
            scrollContainerRef={scrollContainerRef}
            damping={damping}
            stiffness={stiffness}
            numCopies={numCopies}
            velocityMapping={velocityMapping}
            parallaxClassName={parallaxClassName}
            scrollerClassName={scrollerClassName}
            parallaxStyle={parallaxStyle}
            scrollerStyle={scrollerStyle}
          >
            {text}&nbsp;
          </VelocityText>
        ))}
      </section>
    );
  },
);

ScrollVelocity.displayName = "ScrollVelocity";

export default ScrollVelocity;
