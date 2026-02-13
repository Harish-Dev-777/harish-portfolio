import React, { useEffect, useRef } from "react";
import { FaArrowDown } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import GlareHover from "../components/GlareHover";
import { services } from "../constants/data";
import SEO from "../components/SEO";
import { pageMetadata } from "../utils/seo";
import "../styles/Services.css";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const containerRef = useRef(null);
  const getInTouchRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
      );

      // Staggered Cards Animation
      gsap.fromTo(
        ".service-card-wrapper",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-list",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Get In Touch Animation (Parallax/Reveal)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: getInTouchRef.current,
          start: "top 90%",
          end: "bottom top",
          scrub: 1,
        },
      });

      tl.fromTo(
        ".getInTouch-bg",
        { yPercent: 20, scale: 1.1, opacity: 0.3 },
        { yPercent: -10, scale: 1, opacity: 0.8, ease: "none" },
      ).fromTo(
        ".getInTouch-text",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "<30%",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScroll = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} id="services" className="services-wrapper">
      <SEO
        title={pageMetadata.services.title}
        description={pageMetadata.services.description}
        keywords={pageMetadata.services.keywords}
      />
      {/* Intro Section */}
      <section className="intro-section">
        <h1 ref={titleRef} className="service-title">
          Services
        </h1>
        <div className="scroll-down">
          <p>Scroll Down</p>
          <div onClick={handleScroll} className="arrow-icon animate-bounce">
            <FaArrowDown size={26} />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-list">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </section>

      {/* Get In Touch */}
      <section ref={getInTouchRef} className="getInTouch">
        <img
          src="/images/getInTouch.png"
          alt="get-in-touch"
          className="getInTouch-bg"
        />
        <h1 className="getInTouch-text">Get In Touch</h1>
      </section>

      <style>{`
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
      `}</style>
    </div>
  );
};

export default Services;

const ServiceCard = ({ title, description, tools, duration }) => (
  <div className="service-card-wrapper">
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
  </div>
);
