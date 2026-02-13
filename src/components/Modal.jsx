import { useEffect, useRef, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { projects } from "../constants/data";
import "../styles/Projects.css";

const Modal = memo(({ modal }) => {
  const { active, index } = modal;
  const container = useRef(null);
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  // Position modal above the hovered card
  useEffect(() => {
    if (!active || !container.current) return;

    const updatePosition = () => {
      const cards = document.querySelectorAll(".card");
      const hoveredCard = cards[index];

      if (hoveredCard && container.current) {
        const rect = hoveredCard.getBoundingClientRect();
        const modalHeight = 400; // Approximate modal height

        // Position above the card with some offset
        const top = rect.top - modalHeight - 20;
        const left = rect.left + rect.width / 2;

        container.current.style.left = `${left}px`;
        container.current.style.top = `${Math.max(20, top)}px`; // Ensure it doesn't go off-screen
      }
    };

    updatePosition();

    // Update on scroll or resize
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [active, index]);

  // Smooth project preview change
  useGSAP(() => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        top: `${index * -100}%`,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [index]);

  // Modal scale animation - optimized
  // variants moved outside component
  return (
    <motion.div
      ref={container}
      className="modalContainer"
      variants={modalVariants}
      initial="initial"
      animate={active ? "open" : "closed"}
      style={{
        pointerEvents: active ? "auto" : "none",
        willChange: active ? "transform, opacity" : "auto",
      }}
    >
      <div ref={sliderRef} className="modalSlider">
        {projects.map((project, i) => {
          const { color, src, title, live } = project;
          return (
            <div
              key={i}
              className="modal"
              style={{
                backgroundColor: color,
                willChange: i === index ? "transform" : "auto",
              }}
            >
              {live ? (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modalImageLink"
                >
                  <img
                    src={src}
                    alt={title}
                    width={320}
                    height={240}
                    loading={i === 0 ? "eager" : "lazy"}
                    style={{
                      opacity: i === index && active ? 1 : 0.7,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                </a>
              ) : (
                <img
                  src={src}
                  alt={title}
                  width={320}
                  height={240}
                  loading={i === 0 ? "eager" : "lazy"}
                  style={{
                    opacity: i === index && active ? 1 : 0.7,
                    transition: "opacity 0.3s ease",
                  }}
                />
              )}

              {live && (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liveLinkIcon"
                  aria-label={`Visit ${title}`}
                >
                  <FiExternalLink />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});

Modal.displayName = "Modal";

export default Modal;

const modalVariants = {
  initial: {
    scale: 0,
    opacity: 0,
    x: "-50%",
    y: "0%",
  },
  open: {
    scale: 1,
    opacity: 1,
    x: "-50%",
    y: "0%",
    transition: {
      duration: 0.3,
      ease: [0.5, 1, 0.89, 1],
    },
  },
  closed: {
    scale: 0,
    opacity: 0,
    x: "-50%",
    y: "0%",
    transition: {
      duration: 0.2,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};
