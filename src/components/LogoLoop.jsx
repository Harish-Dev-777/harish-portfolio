import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// === CONFIG ===
const CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

// === HELPERS ===
const toCssLength = (v) => (typeof v === "number" ? `${v}px` : v ?? undefined);
const cx = (...p) => p.filter(Boolean).join(" ");

// === HOOKS ===
const useResizeObserver = (cb, elements, deps) => {
  useLayoutEffect(() => {
    if (!elements?.length) return;

    if (!window.ResizeObserver) {
      const onResize = () => cb();
      window.addEventListener("resize", onResize);
      cb();
      return () => window.removeEventListener("resize", onResize);
    }

    const obsList = elements
      .map((r) => {
        if (!r.current) return null;
        const obs = new ResizeObserver(cb);
        obs.observe(r.current);
        return obs;
      })
      .filter(Boolean);

    cb();
    return () => obsList.forEach((o) => o.disconnect());
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

    let remain = imgs.length;
    const done = () => {
      remain -= 1;
      if (remain === 0) onLoad();
    };

    imgs.forEach((img) => {
      if (img.complete) done();
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });

    return () =>
      imgs.forEach((img) => {
        img.removeEventListener("load", done);
        img.removeEventListener("error", done);
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
  const raf = useRef();
  const last = useRef(null);
  const offset = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      track.style.transform = "translate3d(0,0,0)";
      return;
    }

    const animate = (t) => {
      if (last.current == null) last.current = t;
      const dt = (t - last.current) / 1000;
      last.current = t;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;
      const factor = 1 - Math.exp(-dt / CONFIG.SMOOTH_TAU);
      velocity.current += (target - velocity.current) * factor;

      if (seqWidth > 0 && Math.abs(velocity.current) > 0.01) {
        offset.current =
          (((offset.current + velocity.current * dt) % seqWidth) + seqWidth) %
          seqWidth;
        track.style.transform = `translate3d(${-offset.current}px,0,0)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
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
      return mag * dir;
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

    // renderLogo is memoized; hover tooltips handled efficiently
    const renderLogo = useCallback(
      (item, key, idx) => (
        <li
          key={key}
          className="flex-none relative text-[length:var(--logoHeight)] leading-[1] mx-[calc(var(--gap)/2)]"
        >
          <div
            className="relative inline-flex items-center justify-center cursor-pointer group"
            onPointerEnter={() => setHoveredIndex(idx)}
            onPointerLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    backgroundColor: item.color || "#fff",
                    color: item.color === "#fff" ? "#000" : "#fff",
                  }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md shadow-md text-xs font-semibold whitespace-nowrap z-50"
                >
                  {item.title || "Tech"}
                </motion.div>
              )}
            </AnimatePresence>

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
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        role="region"
        aria-label={ariaLabel}
      >
        <div
          ref={trackRef}
          className="flex w-max will-change-transform select-none items-center"
        >
          {logoList}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = "LogoLoop";
export default LogoLoop;
