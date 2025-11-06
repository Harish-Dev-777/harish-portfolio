import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stars = gsap.utils.toArray(".star");
      stars.forEach((star) => {
        gsap.to(star, {
          x: () => gsap.utils.random(-50, 50),
          y: () => gsap.utils.random(-50, 50),
          duration: gsap.utils.random(3, 6),
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="notfound-container">
      {/* Stars background */}
      <div className="stars-container">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="star" />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="notfound-content"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="notfound-title"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="notfound-subtitle"
        >
          Lost in Space
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="notfound-description"
        >
          It seems you’ve wandered off the map. Don’t worry, let’s get you back
          to civilization.
        </motion.p>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(255,255,255,0.3)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="notfound-button"
        >
          Back to Home
        </motion.button>
      </motion.div>

      {/* Floating orb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15, y: [0, 30, 0] }}
        transition={{
          opacity: { duration: 1.5 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="orb"
      />
    </div>
  );
};

export default NotFound;
