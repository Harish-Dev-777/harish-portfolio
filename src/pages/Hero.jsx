import React, { useRef } from "react";
import "../styles/Hero.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

const Hero = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  let xPercent = 0;
  let direction = -1;

  useGSAP(() => {
    requestAnimationFrame(animation);
    const heroSplit = new SplitText("#heading", { type: "chars,words" });
    const subheadingSplit = new SplitText(".subTitle", { type: "lines" });

    gsap.from(heroSplit.chars, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
    });

    gsap.from(subheadingSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
      delay: 1.2,
    });

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        scrub: 0.1,
        onUpdate: (e) => (direction = e.direction * -1),
      },
      ease: "power1.inOut",
      x: "-=300px",
    });

    gsap.from("#heading", {
      y: 200,
      duration: 1,
      opacity: 0,
      ease: "power1.out",
    });
  }, []);

  const animation = () => {
    if (xPercent <= -100) xPercent = 0;
    if (xPercent > 0) xPercent = -100;
    gsap.set(firstText.current, { xPercent });
    gsap.set(secondText.current, { xPercent });
    xPercent += 0.1 * direction;
    requestAnimationFrame(animation);
  };

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="home">
      <h1 id="heading" className="heroTitle">
        I'm Harish.
      </h1>

      <h2 id="subHeading" className="subTitle">
        Designing modern digital experiences that connect, perform, and inspire.
      </h2>

      <div className="btns">
        <button className="work" onClick={() => scrollToSection("#projects")}>
          View My Work
        </button>

        <button
          id="hire"
          className="hireBtn group relative"
          onClick={() => scrollToSection("#contact")}
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
        {/* <spline-viewer url="https://prod.spline.design/dJp7whPNR-mnCs68/scene.splinecode"></spline-viewer> */}
      </div>
    </div>
  );
};

export default Hero;
