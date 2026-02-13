import { memo, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Projects.css";
import { FiExternalLink } from "react-icons/fi";

const ProjectCard = memo(({ title, type, src, color, live }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleClick = () => {
    if (live) window.open(live, "_blank", "noopener,noreferrer");
  };

  // Memoize modal style to prevent unnecessary recalculations
  const modalStyle = useMemo(
    () => ({
      backgroundColor: color,
    }),
    [color],
  );

  // Memoize animation variants
  const modalVariants = useMemo(
    () => ({
      initial: { opacity: 0, x: "-50%", y: "-40%", scale: 0.9 },
      animate: { opacity: 1, x: "-50%", y: "-50%", scale: 1 },
      exit: { opacity: 0, x: "-50%", y: "-40%", scale: 0.9 },
    }),
    [],
  );

  return (
    <div className="projectCardWrapper" ref={cardRef}>
      {/* Modal that appears above the card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="cardModal"
            initial={modalVariants.initial}
            animate={modalVariants.animate}
            exit={modalVariants.exit}
            transition={{ duration: 0.3, ease: [0.5, 1, 0.89, 1] }}
            style={modalStyle}
          >
            <div className="cardModalContent">
              {live ? (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cardModalImageLink"
                >
                  <img
                    src={src}
                    alt={`${title} - ${type}`}
                    width={320}
                    height={240}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="cardModalOverlay">
                    <FiExternalLink size={24} />
                    <span>View Live</span>
                  </div>
                </a>
              ) : (
                <img
                  src={src}
                  alt={`${title} - ${type}`}
                  width={320}
                  height={240}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The actual card with full project name */}
      <div
        className="card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`View ${title} - ${type}`}
      >
        <h2>{title}</h2>
        <div className="cardBottom">
          <p>{type}</p>

          {live && (
            <div className="goLive">
              <FiExternalLink className="goLiveIcon" />
              <span>Click to Go Live</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
