import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Contact.css";
import { contactData, socialLinks } from "../constants/data";
import SEO from "../components/SEO";
import { pageMetadata } from "../utils/seo";
import EnhancedMap from "../components/EnhancedMap";

const Contact = () => {
  return (
    <section id="contact">
      <SEO
        title={pageMetadata.contact.title}
        description={pageMetadata.contact.description}
        keywords={pageMetadata.contact.keywords}
      />
      {/* === Left Section === */}
      <div className="contact-left">
        <h1 className="contact-title">Let's Connect</h1>

        <div className="contact-details">
          <p
            onClick={() => (window.location.href = `mailto:${contactData.email}`)}
            className="contact-item"
            role="button"
            tabIndex={0}
            aria-label={`Email ${contactData.email}`}
          >
            {contactData.email}
          </p>
          <p
            onClick={() => (window.location.href = `tel:${contactData.phone}`)}
            className="contact-item"
            role="button"
            tabIndex={0}
            aria-label={`Call ${contactData.phone}`}
          >
            {contactData.phone}
          </p>
        </div>
      </div>

      {/* === Right Section === */}
      <div className="contact-right">
        <ul>
          {socialLinks.map((social, index) => (
            <li key={index} className="social-link">
              <NavLink to={social.url} target="_blank" rel="noopener noreferrer">
                {social.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* === Enhanced Map Section === */}
      <EnhancedMap location={contactData.location} />
    </section>
  );
};

export default memo(Contact);
