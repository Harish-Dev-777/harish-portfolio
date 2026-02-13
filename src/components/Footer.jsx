import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Footer.css";
import { socialLinks, navItems, contactData } from "../constants/data";

const Footer = () => {
  return (
    <footer id="footer">
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
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => window.scrollTo(0, 0)} // optional scroll to top
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
                <a href={social.url} target="_blank" rel="noopener noreferrer">
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
            <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
          </p>
          <p>
            <a href={`tel:${contactData.phone}`}>{contactData.phone}</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Harish. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
