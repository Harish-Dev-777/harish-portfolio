import React, { useRef, useEffect, useState, memo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function FlowingMenu({ items = [] }) {
  const activeItem = useRef(null);
  const containerRef = useRef(null);

  const handleItemHover = useCallback((id) => {
    if (activeItem.current && activeItem.current !== id) {
      // Stop previous marquee
      activeItem.current.stopMarquee();
    }
    activeItem.current = id;
  }, []);

  // Scroll-triggered stagger animation for menu items
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current.querySelectorAll('.menu-item');
      
      // Use from() to animate FROM invisible TO visible (default state)
      // This is safer than set() + to()
      gsap.from(menuItems, {
        opacity: 0,
        y: 100,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all", // Clear props after animation to prevent conflicts
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom-=50", // Trigger when top of menu enters bottom of viewport
          end: "bottom top",
          toggleActions: "play none none none", // Play once and stay
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden bg-[#060010] text-white">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            onHoverStart={(refObj) => handleItemHover(refObj)}
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
  const itemRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  // Start marquee scrolling with improved speed
  const startMarquee = useCallback(() => {
    stopMarquee();
    marqueeTl.current = gsap.to(marqueeInnerRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 15, // Faster marquee
      ease: "none",
      // Removed force3D: true to avoid potential WebGL context errors
    });
  }, []);

  // Stop marquee
  const stopMarquee = useCallback(() => {
    if (marqueeTl.current) marqueeTl.current.kill();
    marqueeTl.current = null;
    gsap.set(marqueeInnerRef.current, { xPercent: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsActive(true);
    onHoverStart({ stopMarquee });
    if (!marqueeRef.current || !marqueeInnerRef.current) return;

    enterTl.current = gsap.timeline({
      defaults: { duration: 0.6, ease: "expo.out" }, // Ultra smooth premium ease
    });
    
    enterTl.current
      .set(marqueeRef.current, { y: "101%", willChange: "transform" })
      .to(marqueeRef.current, { y: "0%" })
      .call(startMarquee, [], "-=0.4"); // Start marquee slightly before reveal finishes

    // Smooth scale effect
    if (itemRef.current) {
      gsap.to(itemRef.current, {
        scale: 1.02,
        duration: 0.6,
        ease: "expo.out",
      });
    }
  }, [onHoverStart, startMarquee, stopMarquee]);

  const handleMouseLeave = useCallback(() => {
    setIsActive(false);
    if (!marqueeRef.current) return;

    gsap.to(marqueeRef.current, {
      y: "101%",
      duration: 0.5,
      ease: "power3.inOut", // Smooth exit
      onStart: stopMarquee,
      onComplete: () => {
        if (marqueeRef.current) {
          marqueeRef.current.style.willChange = 'auto';
        }
      },
    });

    // Scale back smoothly
    if (itemRef.current) {
      gsap.to(itemRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "expo.out",
      });
    }
  }, [stopMarquee]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (marqueeTl.current) marqueeTl.current.kill();
      if (enterTl.current) enterTl.current.kill();
    };
  }, []);

  // Repeat content for seamless loop
  const repeatedMarqueeContent = Array.from({ length: 8 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <span className="uppercase font-semibold text-[3.5vh] px-[2vw] whitespace-nowrap text-[#060010]">
        {text}
      </span>
      <div
        className="w-[180px] h-[7vh] mx-[2vw] rounded-[40px] bg-cover bg-center flex-shrink-0 shadow-lg"
        style={{ backgroundImage: `url(${image})` }}
      />
    </React.Fragment>
  ));

  return (
    <div
      ref={itemRef}
      className="menu-item relative overflow-hidden text-center border-t border-white/20 last:border-b border-b-white/20 transition-all duration-300"
    >
      {/* Main link */}
      <a
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center justify-center h-[20vh] relative cursor-pointer uppercase no-underline font-semibold text-white text-[4vh] transition-all duration-500 ${
          isActive ? "text-[#060010]" : "hover:text-[#060010]"
        }`}
        style={{
          textShadow: isActive ? "0 0 20px rgba(255, 255, 255, 0.3)" : "none",
        }}
      >
        {text}
      </a>

      {/* Hover marquee reveal */}
      <div
        ref={marqueeRef}
        className="absolute top-0 left-0 w-full h-full bg-white text-[#060010] overflow-hidden pointer-events-none translate-y-[101%] shadow-2xl"
      >
        <div
          ref={marqueeInnerRef}
          className="flex items-center h-full w-[400%] whitespace-nowrap will-change-transform"
        >
          {repeatedMarqueeContent}
          {repeatedMarqueeContent}
        </div>
      </div>
    </div>
  );
});

MenuItem.displayName = "MenuItem";

export default memo(FlowingMenu);
