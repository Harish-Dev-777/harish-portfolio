import React, {
  useRef,
  useEffect,
  useState,
  memo,
  useCallback,
  useMemo,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function FlowingMenu({ items = [] }) {
  const containerRef = useRef(null);
  // Track active marquee reference to stop it from other items
  const activeMarqueeRef = useRef(null);

  // Stable callback for hover start
  const handleItemHover = useCallback((stopMarqueeFn) => {
    if (
      activeMarqueeRef.current &&
      activeMarqueeRef.current !== stopMarqueeFn
    ) {
      activeMarqueeRef.current(); // Stop the previous marquee
    }
    activeMarqueeRef.current = stopMarqueeFn;
  }, []);

  // Scroll-triggered stagger animation for menu items
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current.querySelectorAll(".menu-item");

      gsap.from(menuItems, {
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Trigger earlier for smoother entry
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden bg-[#060010] text-white"
    >
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            link={item.link}
            text={item.text}
            image={item.image}
            onHoverStart={handleItemHover}
          />
        ))}
      </nav>
    </div>
  );
}

const MenuItem = memo(({ link, text, image, onHoverStart }) => {
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const marqueeTl = useRef(null);
  const enterTl = useRef(null);
  const leaveTl = useRef(null);
  const itemRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  // Start marquee scrolling
  const startMarquee = useCallback(() => {
    if (marqueeTl.current) marqueeTl.current.kill();

    // Reset to 0 if needed or ensure seamless loop
    // Using xPercent: -50 means we need to ensure content is wide enough
    marqueeTl.current = gsap.to(marqueeInnerRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 20, // Slightly slower for smoothness
      ease: "none",
      force3D: true, // Hardware acceleration
    });
  }, []);

  // Stop marquee
  const stopMarquee = useCallback(() => {
    if (marqueeTl.current) {
      marqueeTl.current.pause();
    }
    // We don't kill it immediately to avoid jumps if we resume,
    // but here we want to reset for the next reveal usually.
    // Optimized: pause first.
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsActive(true);
    // Notify parent to stop others, passing our stop function
    onHoverStart(stopMarquee);

    // Ensure we are ready to animate
    if (!marqueeRef.current || !marqueeInnerRef.current) return;

    // Kill any leaving animation
    if (leaveTl.current) leaveTl.current.kill();

    enterTl.current = gsap.timeline({
      defaults: { duration: 0.6, ease: "expo.out" },
    });

    // Make sure marquee container is visible and ready
    enterTl.current
      .set(marqueeRef.current, {
        yPercent: 101,
        autoAlpha: 1,
      })
      .to(marqueeRef.current, {
        yPercent: 0,
        force3D: true,
      })
      .call(startMarquee, [], "<"); // Start marquee immediately

    // Scale main item
    if (itemRef.current) {
      gsap.to(itemRef.current, {
        scale: 1.02,
        duration: 0.6,
        ease: "expo.out",
        zIndex: 10,
        overwrite: "auto",
      });
    }
  }, [onHoverStart, startMarquee, stopMarquee]);

  const handleMouseLeave = useCallback(() => {
    setIsActive(false);
    if (!marqueeRef.current) return;

    if (enterTl.current) enterTl.current.kill();

    leaveTl.current = gsap.timeline({
      onComplete: () => {
        stopMarquee();
        if (marqueeRef.current) {
          gsap.set(marqueeRef.current, { autoAlpha: 0 }); // Hide completely after exit
          gsap.set(marqueeInnerRef.current, { xPercent: 0 }); // Reset position
        }
      },
    });

    leaveTl.current.to(marqueeRef.current, {
      yPercent: 101,
      duration: 0.5,
      ease: "power3.inOut",
      force3D: true,
    });

    // Scale back
    if (itemRef.current) {
      gsap.to(itemRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "expo.out",
        zIndex: 1,
        overwrite: "auto",
      });
    }
  }, [stopMarquee]);

  useEffect(() => {
    return () => {
      if (marqueeTl.current) marqueeTl.current.kill();
      if (enterTl.current) enterTl.current.kill();
      if (leaveTl.current) leaveTl.current.kill();
    };
  }, []);

  // Optimize marquee content rendering
  const repeatedMarqueeContent = useMemo(() => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <React.Fragment key={idx}>
        <span className="uppercase font-semibold text-[clamp(2rem,4vh,4rem)] px-[2vw] whitespace-nowrap text-[#060010]">
          {text}
        </span>
        <div className="w-[clamp(120px,12vw,200px)] h-[clamp(40px,6vh,80px)] mx-[2vw] rounded-full overflow-hidden flex-shrink-0 shadow-lg relative">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </React.Fragment>
    ));
  }, [text, image]);

  return (
    <div
      ref={itemRef}
      className="menu-item relative overflow-hidden text-center border-t border-white/20 last:border-b border-b-white/20 transition-colors duration-300"
    >
      <a
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // Responsive height and sizing
        className={`flex items-center justify-center h-[clamp(80px,20vh,160px)] w-full relative cursor-pointer uppercase no-underline font-semibold text-white text-[clamp(2rem,5vh,5rem)] transition-all duration-500 z-10 ${
          isActive ? "opacity-0" : "opacity-100"
        }`}
        style={{
          // Only apply text shadow if needed, can be expensive on mobile
          textShadow: isActive ? "none" : "0 0 20px rgba(255, 255, 255, 0.4)",
        }}
        aria-label={text}
      >
        <span className="relative z-10">{text}</span>
      </a>

      {/* Marquee Container */}
      <div
        ref={marqueeRef}
        className="absolute inset-0 w-full h-full bg-white text-[#060010] pointer-events-none opacity-0"
        style={{ willChange: "transform, opacity" }}
        aria-hidden="true"
      >
        <div
          ref={marqueeInnerRef}
          className="flex items-center h-full w-max"
          style={{ willChange: "transform" }}
        >
          {/* Loop content enough times to fill screen + buffer */}
          {repeatedMarqueeContent}
          {repeatedMarqueeContent}
          {repeatedMarqueeContent}
        </div>
      </div>
    </div>
  );
});

MenuItem.displayName = "MenuItem";

export default memo(FlowingMenu);
