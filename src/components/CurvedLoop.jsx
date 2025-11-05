import {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
  useId,
} from "react";

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
  const [spacing, setSpacing] = useState(0);
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
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join("")
    : text;

  // Measure text width once layout is ready
  useLayoutEffect(() => {
    if (measureRef.current)
      setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing || !ready || !textPathRef.current) return;

    let lastTime = performance.now();
    let offset = -spacing;
    offsetRef.current = offset;
    textPathRef.current.setAttribute("startOffset", offset + "px");

    const loop = (time) => {
      const deltaTime = (time - lastTime) / 16.67; // normalize to ~60fps
      lastTime = time;

      if (!dragRef.current && textPathRef.current) {
        // smooth motion with momentum
        const baseSpeed = dirRef.current === "right" ? speed : -speed;
        momentumRef.current *= 0.95; // slow down gradually
        const delta = baseSpeed + momentumRef.current * 0.5;

        offset += delta * deltaTime;
        const wrapPoint = spacing;
        if (offset <= -wrapPoint) offset += wrapPoint;
        if (offset > 0) offset -= wrapPoint;

        textPathRef.current.setAttribute("startOffset", offset + "px");
        offsetRef.current = offset;
      }

      requestAnimationFrame(loop);
    };

    const frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (e) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    momentumRef.current = 0;
    e.target.setPointerCapture(e.pointerId);
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
    momentumRef.current = velRef.current; // give smooth inertia after release
  };

  const cursorStyle = interactive
    ? dragRef.current
      ? "grabbing"
      : "grab"
    : "auto";

  return (
    <div
      className="min-h-screen flex items-center justify-center w-full"
      style={{ visibility: ready ? "visible" : "hidden", cursor: cursorStyle }}
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

export default CurvedLoop;
