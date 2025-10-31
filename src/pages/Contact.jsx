import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import "../styles/Contact.css";
import { contactData } from "../constants/data";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const contactRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 85%", // triggers as soon as title enters
          toggleActions: "play none none reverse",
          once: true,
        },
      });

      // All main elements animate together
      tl.fromTo(
        [
          ".contact-title",
          ".contact-details p",
          ".social-link",
          ".contact-map",
        ],
        {
          y: 80,
          opacity: 0,
          rotateX: -15,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power4.out",
          stagger: {
            each: 0.08,
            from: "start",
          },
        }
      );

      // Soft breathing neon glow effect
      gsap.to(".map-glow", {
        opacity: 0.8,
        scale: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut",
      });

      // Subtle floating parallax for the map background
      gsap.to(".contact-map", {
        y: -20,
        scrollTrigger: {
          trigger: ".contact-map",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
        ease: "none",
      });
    }, contactRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={contactRef}>
      <div className="contact-container">
        <div className="contact-left">
          <h1 className="contact-title">Let’s Connect</h1>

          <div className="contact-details">
            <p
              onClick={() =>
                (window.location.href = `mailto:${contactData.email}`)
              }
            >
              {contactData.email}
            </p>
            <p
              onClick={() =>
                (window.location.href = `tel:${contactData.phone}`)
              }
            >
              {contactData.phone}
            </p>
          </div>
          <div className="contact-map">
            <div className="map-overlay"></div>
            <div className="map-glow"></div>
            <iframe
              title="Location Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                contactData.location
              )}&output=embed`}
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="contact-right">
          <ul>
            {contactData.socials.map((social, index) => (
              <li
                key={index}
                className="social-link"
                onClick={() => window.open(social.url, "_blank")}
              >
                {social.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Contact;
