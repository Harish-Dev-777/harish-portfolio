import { useGSAP } from "@gsap/react";
import { projects } from "../constants/data";
import "../styles/Projects.css";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRef } from "react";
import { FiExternalLink } from "react-icons/fi";

const Modal = ({ modal }) => {
  const { active, index } = modal;
  const container = useRef(null);
  const sliderRef = useRef(null);

  // 🧭 Move modal with cursor
  useGSAP(() => {
    const moveContainerX = gsap.quickTo(container.current, "left", {
      duration: 0.6,
      ease: "power3.out",
    });
    const moveContainerY = gsap.quickTo(container.current, "top", {
      duration: 0.6,
      ease: "power3.out",
    });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      moveContainerX(clientX);
      moveContainerY(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🎞️ Smoothly animate between project previews
  useGSAP(() => {
    gsap.to(sliderRef.current, {
      top: `${index * -100}%`,
      duration: 0.6,
      ease: "power3.out",
    });
  }, [index]);

  // 🎬 Modal open/close animation
  const scaleAnimation = {
    initial: { scale: 0, opacity: 0, x: "-50%", y: "-50%" },
    open: {
      scale: 1,
      opacity: 1,
      x: "-50%",
      y: "-50%",
      transition: { duration: 0.4, ease: [0.5, 1, 0.89, 1] },
    },
    closed: {
      scale: 0,
      opacity: 0,
      x: "-50%",
      y: "-50%",
      transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
    },
  };

  return (
    <motion.div
      ref={container}
      variants={scaleAnimation}
      initial="initial"
      animate={active ? "open" : "closed"}
      className="modalContainer"
    >
      <div ref={sliderRef} className="modalSlider">
        {projects.map((project, i) => {
          const { color, src, title, live } = project;
          return (
            <div
              key={`modal_${i}`}
              className="modal"
              style={{ backgroundColor: color }}
            >
              {/* 🖼️ Clickable project preview */}
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

              {/* External link icon */}
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
