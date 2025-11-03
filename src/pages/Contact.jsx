import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Contact.css";
import { contactData, socialLinks } from "../constants/data";

const Contact = () => {
  // Use a key to force iframe reload on small devices
  const mapKey = `${contactData.location}-${window.innerWidth < 768 ? "mobile" : "desktop"}`;

  return (
    <section id="contact">
      <div className="contact-container">
        {/* === Left Section === */}
        <div className="contact-left">
          <h1 className="contact-title">Let’s Connect</h1>

          <div className="contact-details">
            <p
              onClick={() => (window.location.href = `mailto:${contactData.email}`)}
              className="contact-item"
            >
              {contactData.email}
            </p>
            <p
              onClick={() => (window.location.href = `tel:${contactData.phone}`)}
              className="contact-item"
            >
              {contactData.phone}
            </p>
          </div>

          {/* === Google Map with better mobile fallback === */}
          <div className="contact-map">
            <iframe
              key={mapKey}
              title="Location Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                contactData.location
              )}&output=embed`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={(e) => e.target.classList.add("map-loaded")}
            ></iframe>
            <div className="map-fallback">Loading map...</div>
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
      </div>
    </section>
  );
};

export default Contact;
