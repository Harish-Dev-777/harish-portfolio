import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import "../styles/Footer.css";
import { socialLinks, navLinks } from "../constants/data";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-grid > div",
        { y: 60, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.3,
          ease: "power4.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="footer" ref={footerRef}>
      <div className="footer-grid">
        {/* === Brand / Name === */}
        <div className="footer-brand">
          <h1>Harish</h1>
          <p>Building digital experiences that feel alive.</p>
        </div>

        {/* === Navigation Links === */}
        <div className="footer-nav">
          <h3>Navigation</h3>
          <ul>
            {navLinks.map((navLink, index) => {
              return (
                <li key={index}>
                  <a href={navLink.path}>{navLink.name}</a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* === Social Links === */}
        <div className="footer-social">
          <h3>Social</h3>
          <ul>
            {socialLinks.map((social, index) => (
              <li key={index}>
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* === Contact Info === */}
        <div className="footer-contact">
          <h3>Get in Touch</h3>
          <p>
            <a href="mailto:harish@example.com">harish@example.com</a>
          </p>
          <p>
            <a href="tel:+919876543210">+91 98765 43210</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Harish. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
