import { useEffect, useMemo, useRef, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// === CONFIG ===
const CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

// === HELPERS ===
const toCssLength = (value) =>
  typeof value === "number" ? `${value}px` : value ?? undefined;

const cx = (...parts) => parts.filter(Boolean).join(" ");

// === HOOKS ===
const useResizeObserver = (callback, elements, deps) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const resizeHandler = () => callback();
      window.addEventListener("resize", resizeHandler);
      callback();
      return () => window.removeEventListener("resize", resizeHandler);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const obs = new ResizeObserver(callback);
      obs.observe(ref.current);
      return obs;
    });

    callback();
    return () => observers.forEach((obs) => obs?.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

const useImageLoader = (seqRef, onLoad, deps) => {
  useEffect(() => {
    const imgs = seqRef.current?.querySelectorAll("img") ?? [];
    if (imgs.length === 0) {
      onLoad();
      return;
    }

    let remaining = imgs.length;
    const handleLoad = () => {
      remaining -= 1;
      if (remaining === 0) onLoad();
    };

    imgs.forEach((img) => {
      if (img.complete) handleLoad();
      else {
        img.addEventListener("load", handleLoad, { once: true });
        img.addEventListener("error", handleLoad, { once: true });
      }
    });

    return () =>
      imgs.forEach((img) => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleLoad);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

const useAnimationLoop = (
  trackRef,
  targetVelocity,
  seqWidth,
  isHovered,
  pauseOnHover
) => {
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seqWidth > 0) {
      offsetRef.current =
        ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
    }

    if (prefersReduced) {
      track.style.transform = "translate3d(0,0,0)";
      return () => (lastTimeRef.current = null);
    }

    const animate = (t) => {
      if (lastTimeRef.current === null) lastTimeRef.current = t;
      const dt = (t - lastTimeRef.current) / 1000;
      lastTimeRef.current = t;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;
      const factor = 1 - Math.exp(-dt / CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * factor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * dt;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;
        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover]);
};

// === MAIN COMPONENT ===
export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = "left",
    width = "100%",
    logoHeight = 60,
    gap = 60,
    pauseOnHover = true,
    scaleOnHover = true,
    ariaLabel = "Tech logos",
    className,
    style,
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const targetVelocity = useMemo(() => {
      const mag = Math.abs(speed);
      const dir = direction === "left" ? 1 : -1;
      const mul = speed < 0 ? -1 : 1;
      return mag * dir * mul;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerW = containerRef.current?.clientWidth ?? 0;
      const seqW = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;
      if (seqW > 0) {
        setSeqWidth(Math.ceil(seqW));
        const needed = Math.ceil(containerW / seqW) + CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(CONFIG.MIN_COPIES, needed));
      }
    }, []);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap]);
    useImageLoader(seqRef, updateDimensions, [logos, gap]);
    useAnimationLoop(
      trackRef,
      targetVelocity,
      seqWidth,
      isHovered,
      pauseOnHover
    );

    const cssVars = useMemo(
      () => ({
        "--gap": `${gap}px`,
        "--logoHeight": `${logoHeight}px`,
      }),
      [gap, logoHeight]
    );

    const renderLogo = useCallback(
      (item, key, idx) => (
        <li
          key={key}
          className="flex-none mr-[calc(var(--gap)+10px)] relative text-[length:var(--logoHeight)] leading-[1]"
        >
          <div
            className="relative inline-flex items-center justify-center cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* === Tooltip Popup === */}
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    backgroundColor: item.color || "#ffffff",
                    color: item.color === "#ffffff" ? "#000" : "#fff",
                  }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md shadow-md text-xs font-semibold whitespace-nowrap z-50"
                >
                  {item.title || "Tech"}
                </motion.div>
              )}
            </AnimatePresence>

            {/* === Logo (supports react-icons or img) === */}
            <div
              className={cx(
                "transition-transform duration-300 ease-out",
                scaleOnHover && "group-hover:scale-110"
              )}
            >
              {item.node ? (
                <span className="text-[var(--logoHeight)]">{item.node}</span>
              ) : (
                <img
                  src={item.src}
                  alt={item.alt ?? ""}
                  title={item.title}
                  className="h-[var(--logoHeight)] w-auto object-contain select-none"
                  draggable={false}
                />
              )}
            </div>
          </div>
        </li>
      ),
      [hoveredIndex, scaleOnHover]
    );

    const logoList = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, i) => (
          <ul
            className="flex items-center"
            key={`copy-${i}`}
            aria-hidden={i > 0}
            ref={i === 0 ? seqRef : undefined}
          >
            {logos.map((item, j) => renderLogo(item, `${i}-${j}`, j))}
          </ul>
        )),
      [copyCount, logos, renderLogo]
    );

    return (
      <div
        ref={containerRef}
        className={cx("relative overflow-hidden", className)}
        style={{ width: toCssLength(width), ...cssVars, ...style }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="region"
        aria-label={ariaLabel}
      >
        <div
          className="flex w-max will-change-transform select-none items-center"
          ref={trackRef}
        >
          {logoList}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = "LogoLoop";
export default LogoLoop;
