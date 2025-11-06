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
  const getInTouchRef = useRef(null);
  const textRef = useRef(null);
  const smootherRef = useRef(null);

  // === Smooth Scroll ===
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

 
  // === Get In Touch Animation ===
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: getInTouchRef.current,
          start: "top 80%",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      tl.fromTo(
        ".getInTouch-bg",
        { yPercent: 20, scale: 1.15, opacity: 0.3 },
        { yPercent: -10, scale: 1, opacity: 0.9, ease: "power2.out" }
      ).fromTo(
        textRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=0.8"
      );
    });
    return () => ctx.revert();
  }, []);

  const handleScroll = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div id="services" className="services-wrapper">
      {/* === Intro Section === */}
      <section className="intro-section">
        <h1 className="service-title">Services</h1>
        <div className="scroll-down">
          <p>Scroll Down</p>
          <motion.div
            onClick={handleScroll}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="arrow-icon"
          >
            <FaArrowDown size={26} />
          </motion.div>
        </div>
      </section>

      {/* === Services Grid === */}
      <section className="services-list">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </section>

      {/* === Get In Touch === */}
      <section ref={getInTouchRef} className="getInTouch">
        <img
          src="/images/getInTouch.png"
          alt="get-in-touch"
          className="getInTouch-bg"
        />
        <h1 ref={textRef} className="getInTouch-text">
          Get In Touch
        </h1>
      </section>
    </div>
  );
};

export default Services;

// === Service Card ===
const ServiceCard = ({ title, description, tools, duration }) => (
  <motion.div
    className="service-card-wrapper"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <GlareHover
      width="100%"
      height="100%"
      background="#0c0c10"
      borderRadius="25px"
      borderColor="#2a2a2e"
      glareColor="#ffffff"
      glareOpacity={0.08}
      glareAngle={-25}
      glareSize={500}
      className="service-card"
    >
      <div className="service-card-content">
        <div className="service-card-header">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="service-tools">
          {tools?.map((tool, i) => (
            <span key={i}>{tool}</span>
          ))}
        </div>

        <p className="service-duration">
          Duration: <span>{duration}</span>
        </p>
      </div>
    </GlareHover>
  </motion.div>
);
