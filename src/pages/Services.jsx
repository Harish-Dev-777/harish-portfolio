import React, { useEffect, useRef } from "react";
import { FaArrowDown } from "react-icons/fa";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";
import GlareHover from "../components/GlareHover";
import { services } from "../constants/data";
import "../styles/Services.css";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const Services = () => {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const getInTouchRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const smootherRef = useRef(null);

  // === Smooth Scrolling Setup ===
  useEffect(() => {
    if (!smootherRef.current) {
      smootherRef.current = ScrollSmoother.create({
        smooth: 1,
        effects: true,
        smoothTouch: 0.2,
      });
    }
    return () => smootherRef.current?.kill();
  }, []);

  // === Horizontal Scroll (1–8 cards) ===
  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".service-panel").slice(0, 8);
      const totalScroll = (panels.length - 1) * window.innerWidth;

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          pin: true,
          scrub: 0.45, // smoother and faster
          end: "+=" + totalScroll,
          anticipatePin: 0.3,
          inertia: false,
          fastScrollEnd: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // === Intro Title Animation ===
  useEffect(() => {
    gsap.fromTo(
      introRef.current.querySelector(".service-title"),
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: introRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  // === Transition (last horizontal → vertical card) ===
  useEffect(() => {
    const finalCard = document.querySelector(".final-card-section");
    const getInTouch = getInTouchRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: finalCard,
        start: "top bottom",
        end: "bottom center",
        scrub: 0.6,
      },
    });

    tl.to(finalCard, {
      scale: 0.95,
      opacity: 0.9,
      duration: 1,
    }).fromTo(
      getInTouch,
      { opacity: 0, yPercent: 40 },
      { opacity: 1, yPercent: 0, duration: 1.2, ease: "power3.out" },
      "-=0.3"
    );
  }, []);

 // === Get In Touch Animation (refined for smooth bottom→top motion) ===
useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: getInTouchRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        ease: "none",
      },
    });

    // Smooth parallax move + cinematic fade
    tl.fromTo(
      ".getInTouch-bg",
      {
        yPercent: 20,
        scale: 1.15,
        filter: "blur(10px) brightness(0.6)",
        opacity: 0.3,
      },
      {
        yPercent: -10,
        scale: 1,
        filter: "blur(0px) brightness(1)",
        opacity: 0.7,
        ease: "power2.out",
      }
    );

    // Text fade & slide up
    tl.fromTo(
      textRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
      "-=0.8"
    );
  }, getInTouchRef);

  return () => ctx.revert();
}, []);


  const handleScroll = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div id="services" className="w-full h-full text-white overflow-hidden">
      {/* === Intro Section === */}
      <section
        ref={introRef}
        className="ServiceIntroSection w-full h-screen flex flex-col items-center justify-center bg-[#131318] relative"
      >
        <h1 className="service-title text-[10vw] sm:text-[8vw] font-bold uppercase bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent text-center">
          Services
        </h1>

        <div className="absolute bottom-10 flex flex-col items-center">
          <p className="text-sm opacity-70 mb-2 tracking-wider">Scroll Down</p>
          <motion.div
            onClick={handleScroll}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="cursor-pointer text-gray-200 hover:text-white transition-colors"
          >
            <FaArrowDown size={26} />
          </motion.div>
        </div>
      </section>

      {/* === Horizontal Scroll (1–8 cards) === */}
      <section ref={sectionRef} className="horizontal-scroll-section">
        <div className="horizontal-scroll-container">
          {services.slice(0, 8).map((service, index) => (
            <article key={index} className="service-panel">
              <ServiceCard {...service} index={index} />
            </article>
          ))}
        </div>
      </section>

      {/* === Final Vertical Card === */}
      <section className="final-card-section w-full h-screen flex justify-center items-center bg-[#0d0d11] relative z-10">
        <ServiceCard {...services[8]} index={8} />
      </section>

      {/* === Get In Touch === */}
      <section
        ref={getInTouchRef}
        className="getInTouch relative flex flex-col justify-center items-center overflow-hidden bg-[#0b0b0d]"
      >
        <img
          ref={imgRef}
          src="../images/getInTouch.png"
          alt="get-in-touch"
          className="absolute inset-0 w-full h-full object-cover opacity-30 saturate-60 brightness-70 contrast-110 z-10"
        />
        <h1
          ref={textRef}
          className="text-[8vw] sm:text-[6vw] md:text-[5vw] font-bold capitalize text-center tracking-tight relative z-20"
        >
          Get In Touch
        </h1>
      </section>
    </div>
  );
};

export default Services;

const ServiceCard = ({ id, title, description, tools, duration }) => (
  <motion.div
    className="service-card-wrapper flex justify-center items-center w-full h-full relative"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <GlareHover
      width="70vw"
      height="70vh"
      background="#0c0c10"
      borderRadius="25px"
      borderColor="#2a2a2e"
      glareColor="#ffffff"
      glareOpacity={0.08}
      glareAngle={-25}
      glareSize={500}
      className="service-card relative shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:scale-[1.03] transition-all duration-700"
    >
      <div
        className="absolute top-0 left-0 translate-x-[-30%] translate-y-[-30%]
        bg-white text-black font-semibold border border-gray-400 
        rounded-full shadow-[0_0_25px_rgba(255,255,255,0.1)]
        flex items-center justify-center z-30
        w-[100px] h-[100px] text-3xl sm:w-[120px] sm:h-[120px] sm:text-4xl md:w-[140px] md:h-[140px]"
      >
        {id}
      </div>

      <div className="flex flex-col justify-center items-center text-center gap-8 px-10 py-8 sm:px-14 sm:py-14 md:px-20 md:py-16 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
          {title}
        </h2>
        <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {Array.isArray(tools) &&
            tools.map((tool, i) => (
              <span
                key={i}
                className="bg-[#232329] px-4 py-2 text-sm sm:text-base rounded-md border border-[#3a3a3f] text-gray-200 hover:bg-[#2f2f36] transition-all duration-300"
              >
                {tool}
              </span>
            ))}
        </div>
        <p className="text-gray-400 text-sm md:text-base mt-4">
          Duration:{" "}
          <span className="text-gray-100 font-medium">{duration}</span>
        </p>
      </div>
    </GlareHover>
  </motion.div>
);
