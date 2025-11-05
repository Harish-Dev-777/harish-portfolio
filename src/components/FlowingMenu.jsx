import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

function FlowingMenu({ items = [] }) {
  const activeItem = useRef(null);

  const handleItemHover = (id) => {
    if (activeItem.current && activeItem.current !== id) {
      // Stop previous marquee
      activeItem.current.stopMarquee();
    }
    activeItem.current = id;
  };

  return (
    <div className="w-full h-full overflow-hidden bg-[#060010] text-white">
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

function MenuItem({ link, text, image, onHoverStart }) {
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const marqueeTl = useRef(null);
  const enterTl = useRef(null);
  const [isActive, setIsActive] = useState(false);

  // Start marquee scrolling
  const startMarquee = () => {
    stopMarquee();
    marqueeTl.current = gsap.to(marqueeInnerRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: "none",
      force3D: true,
    });
  };

  // Stop marquee
  const stopMarquee = () => {
    if (marqueeTl.current) marqueeTl.current.kill();
    marqueeTl.current = null;
    gsap.set(marqueeInnerRef.current, { xPercent: 0 });
  };

  const handleMouseEnter = () => {
    setIsActive(true);
    onHoverStart({ stopMarquee });
    if (!marqueeRef.current || !marqueeInnerRef.current) return;

    enterTl.current = gsap.timeline({
      defaults: { duration: 0.6, ease: "power3.out" },
    });
    enterTl.current
      .set(marqueeRef.current, { y: "101%", willChange: "transform" })
      .to(marqueeRef.current, { y: "0%" })
      .call(startMarquee, [], "+=0.05");
  };

  const handleMouseLeave = () => {
    setIsActive(false);
    if (!marqueeRef.current) return;

    gsap.to(marqueeRef.current, {
      y: "101%",
      duration: 0.5,
      ease: "power2.inOut",
      onStart: stopMarquee,
    });
  };

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
        className="w-[180px] h-[7vh] mx-[2vw] rounded-[40px] bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url(${image})` }}
      />
    </React.Fragment>
  ));

  return (
    <div
      className="relative overflow-hidden text-center border-t border-white/20 last:border-b border-b-white/20"
    >
      {/* Main link */}
      <a
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center justify-center h-[20vh] relative cursor-pointer uppercase no-underline font-semibold text-white text-[4vh] transition-all duration-500 ${
          isActive ? "text-[#060010]" : "hover:text-[#060010]"
        }`}
      >
        {text}
      </a>

      {/* Hover marquee reveal */}
      <div
        ref={marqueeRef}
        className="absolute top-0 left-0 w-full h-full bg-white text-[#060010] overflow-hidden pointer-events-none translate-y-[101%]"
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
}

export default FlowingMenu;
