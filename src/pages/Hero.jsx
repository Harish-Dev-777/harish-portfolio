import React, { useRef, useLayoutEffect, memo } from "react";
import "../styles/Hero.css";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(SplitText, ScrollTrigger);

const Hero = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const ctx = useRef(null);
  const direction = useRef(-1);
  const xPercent = useRef(0);
  const animFrame = useRef(null);
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const subTitleRef = useRef(null);

  useLayoutEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    ctx.current = gsap.context(() => {
      const heading = headingRef.current;
      const sub = subTitleRef.current;

      if (!heading || !sub) return;

      // Add will-change only during animation, remove after
      heading.style.willChange = 'transform, opacity';
      sub.style.willChange = 'transform, opacity';

      const heroSplit = new SplitText(heading, { type: "chars,words" });
      const subheadingSplit = new SplitText(sub, { type: "lines" });

      // Optimize: Use single timeline for better performance
      const tl = gsap.timeline({
        onComplete: () => {
          // Remove will-change after animation completes
          heading.style.willChange = 'auto';
          sub.style.willChange = 'auto';
        }
      });

      if (prefersReducedMotion) {
        // Instant appearance for reduced motion
        tl.set([heroSplit.chars, subheadingSplit.lines], { opacity: 1 });
      } else {
        // --- Optimized Entry animations ---
        // Removed redundant heading animation (was animating same element twice)
        tl.from(heroSplit.chars, {
          opacity: 0,
          yPercent: 100,
          duration: 1.8,
          ease: "expo.out",
          stagger: 0.06,
          force3D: true, // Force GPU acceleration
        })
        .from(subheadingSplit.lines, {
          opacity: 0,
          yPercent: 100,
          duration: 1.8,
          ease: "expo.out",
          stagger: 0.06,
          force3D: true,
        }, "-=1.4"); // Overlap for smoother feel
      }

      // --- Optimized Scroll direction animation ---
      if (slider.current) {
        slider.current.style.willChange = 'transform';
        
        gsap.to(slider.current, {
          scrollTrigger: {
            trigger: document.documentElement,
            start: 0,
            end: window.innerHeight,
            scrub: 0.1,
            onUpdate: (e) => (direction.current = e.direction * -1),
            onLeave: () => {
              slider.current.style.willChange = 'auto';
            },
          },
          ease: "power1.inOut",
          x: "-=300px",
          force3D: true,
        });
      }
    });

    // Optimized slider animation with better performance
    let lastTime = performance.now();
    const animateSlider = (currentTime) => {
      if (!firstText.current || !secondText.current) return;

      // Throttle to 60fps max
      const deltaTime = currentTime - lastTime;
      if (deltaTime < 16) {
        animFrame.current = requestAnimationFrame(animateSlider);
        return;
      }
      lastTime = currentTime;

      // Wrap logic
      if (xPercent.current <= -100) xPercent.current = 0;
      if (xPercent.current > 0) xPercent.current = -100;

      // Use transform3d for GPU acceleration
      const transform = `translate3d(${xPercent.current}%, 0, 0)`;
      firstText.current.style.transform = transform;
      secondText.current.style.transform = transform;

      xPercent.current += 0.25 * direction.current;
      animFrame.current = requestAnimationFrame(animateSlider);
    };

    // Add will-change for slider text
    if (firstText.current && secondText.current) {
      firstText.current.style.willChange = 'transform';
      secondText.current.style.willChange = 'transform';
    }

    if (!prefersReducedMotion) {
      animFrame.current = requestAnimationFrame(animateSlider);
    }

    // 🧹 Optimized Cleanup
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
      if (ctx.current) ctx.current.revert();
      
      // Clean up will-change
      if (firstText.current) firstText.current.style.willChange = 'auto';
      if (secondText.current) secondText.current.style.willChange = 'auto';
      if (slider.current) slider.current.style.willChange = 'auto';
      if (headingRef.current) headingRef.current.style.willChange = 'auto';
      if (subTitleRef.current) subTitleRef.current.style.willChange = 'auto';
    };
  }, []);


  // ✅ Route navigation (React Router)
  const goTo = (path) => navigate(path);

  return (
    <section id="home" className="heroSection">
      <h1 id="heading" ref={headingRef} className="heroTitle">
        I'm Harish.
      </h1>

      <h2 className="subTitle" ref={subTitleRef}>
        Designing modern digital experiences that connect, perform, and inspire.
      </h2>

      <div className="btns">
        <button className="work" onClick={() => goTo("/projects")}>
          View My Work
        </button>

        <button
          id="hire"
          className="hireBtn group relative"
          onClick={() => goTo("/contact")}
        >
          <div className="flex items-center gap-3">
            <div className="dot"></div>
            <span className="label">Hire Me</span>
          </div>

          <div className="hoverLayer">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <span className="leading-none font-medium">Hire Me</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 leading-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12h14"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 6l6 6-6 6"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <div className="sliderContainer">
        <div ref={slider} className="slider">
          <h1 ref={firstText}>Freelance web developer -</h1>
          <h1 ref={secondText}>Freelance web developer -</h1>
        </div>
      </div>

      <div className="robotModel">
        <spline-viewer 
          url="https://prod.spline.design/dJp7whPNR-mnCs68/scene.splinecode"
          loading="lazy"
        ></spline-viewer>
      </div>
    </section>
  );
};

// Export with memo to prevent unnecessary re-renders
export default memo(Hero);
