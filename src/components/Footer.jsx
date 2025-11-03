import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import "../styles/Footer.css";
import { socialLinks, navItems, contactData } from "../constants/data";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-section",
        { y: 50, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.06,
          ease: "power3.out",
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
        {/* === Brand === */}
        <div className="footer-section footer-brand">
          <h1>Harish</h1>
          <p>Building digital experiences that feel alive.</p>
        </div>

        {/* === Navigation === */}
        <div className="footer-section footer-nav">
          <h3>Navigation</h3>
          <ul>
            {navItems.map((link, i) => (
              <li key={i}>
                <NavLink
                  to={link.path}
                  smooth="true"
                  spy="true"
                  offset={-70}
                  duration={600}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* === Social === */}
        <div className="footer-section footer-social">
          <h3>Social</h3>
          <ul>
            {socialLinks.map((social, i) => (
              <li key={i}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* === Contact === */}
        <div className="footer-section footer-contact">
          <h3>Get in Touch</h3>
          <p>
            <a href="mailto:harish@example.com">{contactData.email}</a>
          </p>
          <p>
            <a href="tel:+919876543210">{contactData.phone}</a>
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
