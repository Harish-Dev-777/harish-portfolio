// GlareHover.jsx
import React, { useRef, useEffect } from "react";

const GlareHover = ({
  width = "500px",
  height = "500px",
  background = "#000",
  borderRadius = "10px",
  borderColor = "#333",
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = "",
  style = {},
}) => {
  const overlayRef = useRef(null);

  // compute rgba from hex or passed string
  const toRgba = (c, a = glareOpacity) => {
    if (!c) return `rgba(255,255,255,${a})`;
    if (c.startsWith("rgba") || c.startsWith("rgb")) return c;
    const hex = c.replace("#", "");
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return `rgba(${r},${g},${b},${a})`;
    } else if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return `rgba(255,255,255,${a})`;
  };

  const overlayColor = toRgba(glareColor, glareOpacity);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    // ensure initial placement off-screen
    el.style.transform =
      "translate3d(-120%, -120%, 0) rotate(" + glareAngle + "deg)";
    el.style.transition = `transform ${transitionDuration}ms cubic-bezier(.22,.9,.35,1)`;
    el.style.willChange = "transform, opacity";
    // ensure pointer events none
    el.style.pointerEvents = "none";
  }, [glareAngle, transitionDuration]);

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;
    // move overlay across; use translate3d for GPU acceleration
    el.style.transform =
      "translate3d(20%, 20%, 0) rotate(" + glareAngle + "deg)";
    el.style.opacity = "1";
  };

  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;
    if (playOnce) {
      el.style.transform =
        "translate3d(-120%, -120%, 0) rotate(" + glareAngle + "deg)";
      el.style.opacity = "0";
      // leave at start
    } else {
      el.style.transform =
        "translate3d(-120%, -120%, 0) rotate(" + glareAngle + "deg)";
      el.style.opacity = "0";
    }
  };

  // overlay style uses a rotated rectangle that fades in/out
  const overlayStyle = {
    position: "absolute",
    left: "-40%",
    top: "-40%",
    width: `${glareSize}%`,
    height: `${glareSize}%`,
    background: `linear-gradient(0deg, transparent 0%, ${overlayColor} 40%, ${overlayColor} 60%, transparent 100%)`,
    transform: `translate3d(-120%,-120%,0) rotate(${glareAngle}deg)`,
    opacity: 0,
    borderRadius: "30%",
    pointerEvents: "none",
    mixBlendMode: "screen",
  };

  return (
    <div
      className={`relative grid place-items-center overflow-hidden border ${className}`}
      style={{
        width,
        height,
        background,
        borderRadius,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor,
        ...style,
      }}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      onFocus={animateIn}
      onBlur={animateOut}
    >
      <div ref={overlayRef} style={overlayStyle} aria-hidden />
      {children}
    </div>
  );
};

export default GlareHover;
