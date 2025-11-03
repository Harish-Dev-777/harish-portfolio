import React, { useState, useEffect } from "react";
import "../styles/NavBar.css";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, socialLinks } from "../constants/data"; // ✅ imported

const Navbar = () => {
  const [isActive, setActive] = useState(false);

  return (
    <>
      <div className="button" onClick={() => setActive(!isActive)}>
        <div className={`burger ${isActive ? "burgerActive" : ""}`}></div>
      </div>
      <AnimatePresence mode="wait">
        {isActive && <Nav setActive={setActive} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

// === Motion Variants ===
const menuSlide = {
  initial: { x: "calc(100% + 100px)" },
  enter: {
    x: "0%",
    transition: { duration: 0.8, ease: [0.45, 1, 0.75, 1] },
  },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.45, 1, 0.75, 1] },
  },
};

const slide = {
  initial: { x: 80, opacity: 0 },
  enter: (i) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.45, 1, 0.75, 1],
      delay: 0.1 * i,
    },
  }),
  exit: (i) => ({
    x: 80,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.45, 1, 0.75, 1],
      delay: 0.1 * i,
    },
  }),
};

// === NavLinks ===
const NavLinks = ({ item, index, activeLink, handleClick }) => (
  <motion.div
    variants={slide}
    initial="initial"
    animate="enter"
    exit="exit"
    custom={index}
    className="nav-link"
  >
    <a
      href={item.path}
      onClick={() => handleClick(item.path)}
      className={activeLink === item.path ? "active" : ""}
    >
      {item.name}
    </a>
  </motion.div>
);

// === Nav Menu ===
const Nav = ({ setActive }) => {
  const [activeLink, setActiveLink] = useState(window.location.hash || "#home");

  const handleClick = (href) => {
    setActiveLink(href);
    window.location.hash = href;
    setActive(false);
  };

  useEffect(() => {
    const onScroll = () => {
      const currentHash = window.location.hash;
      if (currentHash) setActiveLink(currentHash);
    };
    window.addEventListener("hashchange", onScroll);
    return () => window.removeEventListener("hashchange", onScroll);
  }, []);

  return (
    <motion.div
      variants={menuSlide}
      animate="enter"
      exit="exit"
      initial="initial"
      className="menu"
    >
      <div className="body">
        <div className="nav">
          <div className="header">
            <p>Navigations</p>
            {navItems.map((item, index) => (
              <NavLinks
                item={item}
                index={index}
                key={index}
                activeLink={activeLink}
                handleClick={handleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
