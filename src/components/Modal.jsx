import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { projects } from "../constants/data";
import "../styles/Projects.css";

const Modal = ({ modal }) => {
  const { active, index } = modal;
  const container = useRef(null);
  const sliderRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  // 🧠 Optimized mouse tracking
  useEffect(() => {
    const moveContainer = gsap.quickSetter(container.current, "css");
    const updatePosition = () => {
      moveContainer({
        left: `${mousePos.current.x}px`,
        top: `${mousePos.current.y}px`,
      });
      rafId.current = requestAnimationFrame(updatePosition);
    };
    updatePosition();

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 🎞 Smooth project preview change
  useGSAP(() => {
    gsap.to(sliderRef.current, {
      top: `${index * -100}%`,
      duration: 0.5,
      ease: "power3.out",
    });
  }, [index]);

  // 💫 Modal scale animation
  const variants = {
    initial: { scale: 0, opacity: 0, x: "-50%", y: "-50%" },
    open: {
      scale: 1,
      opacity: 1,
      x: "-50%",
      y: "-50%",
      transition: { duration: 0.35, ease: [0.5, 1, 0.89, 1] },
    },
    closed: {
      scale: 0,
      opacity: 0,
      x: "-50%",
      y: "-50%",
      transition: { duration: 0.25, ease: [0.33, 1, 0.68, 1] },
    },
  };

  return (
    <motion.div
      ref={container}
      className="modalContainer"
      variants={variants}
      initial="initial"
      animate={active ? "open" : "closed"}
    >
      <div ref={sliderRef} className="modalSlider">
        {projects.map((project, i) => {
          const { color, src, title, live } = project;
          return (
            <div key={i} className="modal" style={{ backgroundColor: color }}>
              {live ? (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modalImageLink"
                >
                  <motion.img
                    src={src}
                    alt={title}
                    width={320}
                    height={0}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </a>
              ) : (
                <motion.img
                  src={src}
                  alt={title}
                  width={320}
                  height={0}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {live && (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liveLinkIcon"
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
};

export default Modal;
