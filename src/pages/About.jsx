import React, { useEffect, useRef } from "react";
import "../styles/About.css";
import Paragraph from "../components/Paragraph";
import Scroller from "../components/Scroller";
import LogoLoop from "../components/LogoLoop";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiSpringboot,
  SiMongodb,
  SiMysql,
  SiFramer,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const quoteRef = useRef(null);

  useEffect(() => {
    if (!quoteRef.current) return;

    const q = quoteRef.current;

    // Smooth scroll-triggered animation for quote
    gsap.fromTo(
      q,
      {
        opacity: 0,
        y: 80,
        letterSpacing: "1px",
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        letterSpacing: "0px",
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: q,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
          toggleActions: "play none none reverse",
        },
      }
    );

    // Subtle glowing pulse on the quote
    gsap.to(q, {
      textShadow: "0 0 20px rgba(255,255,255,0.3)",
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut",
      scrollTrigger: {
        trigger: q,
        start: "top 75%",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const paragraph = `
I’m Harish, a passionate Full Stack Developer and freelance web engineer. 
I create fast, secure, and scalable web experiences using cutting-edge technologies. 
My goal is to transform ideas into functional, beautiful digital products that stand out online. 
I specialize in crafting both the front-end elegance and the back-end strength that make websites truly complete.
`;

  // 💡 tech stack logos with color for tooltip bg
  const techLogos = [
    { node: <SiHtml5 color="#E34F26" />, title: "HTML", color: "#E34F26" },
    { node: <SiCss3 color="#1572B6" />, title: "CSS", color: "#1572B6" },
    {
      node: <SiJavascript color="#F7DF1E" />,
      title: "JavaScript",
      color: "#F7DF1E",
    },
    { node: <SiReact color="#61DBFB" />, title: "React", color: "#61DBFB" },
    {
      node: <SiNextdotjs color="#ffffff" />,
      title: "Next.js",
      color: "#ffffff",
    },
    {
      node: <SiTypescript color="#3178C6" />,
      title: "TypeScript",
      color: "#3178C6",
    },
    {
      node: <SiTailwindcss color="#38BDF8" />,
      title: "Tailwind CSS",
      color: "#38BDF8",
    },
    {
      node: <SiSpringboot color="#6DB33F" />,
      title: "Spring Boot",
      color: "#6DB33F",
    },
    { node: <SiMongodb color="#47A248" />, title: "MongoDB", color: "#47A248" },
    { node: <SiMysql color="#00758F" />, title: "MySQL", color: "#00758F" },
    {
      node: <SiFramer color="#e9e9e9" />,
      title: "Framer Motion",
      color: "#e9e9e9",
    },
  ];

  return (
    <div id="about" className="about-section">
      {/* === Title === */}
      <h1 className="about-title">About Me</h1>

      {/* === Image + Paragraph === */}
      <div className="about-grid">
        <div className="about-image">
          <img src="/images/AboutMe.png" alt="about me" />
        </div>
        <div className="about-content">
          <Paragraph value={paragraph} />
        </div>
      </div>

      {/* === Tech Stack Section === */}
      <h2 className="tech-stack-title">Tech Stacks</h2>
      <div className="about-logoLoop">
        <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          logoHeight={90}
          gap={70}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#131318"
          ariaLabel="Technology partners"
        />
      </div>

      {/* === Quote Section === */}
      <div className="about-quote-container">
        <h1 ref={quoteRef} className="about-quote">
          Every pixel and line of code has purpose —{" "}
          <span>I don’t just build websites</span>, I craft experiences.
        </h1>
      </div>

      {/* === Scroller === */}
      <div className="about-scroller">
        <Scroller />
      </div>
    </div>
  );
};

export default About;
