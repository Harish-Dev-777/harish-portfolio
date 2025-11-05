import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileCard.css";

const ProfileCard = ({
  avatarUrl = "/images/avatar.png",
  miniAvatarUrl,
  name = "Harish",
  title = "Web Developer",
  handle = "harish",
  status = "Online",
  contactText = "Contact Me",
  showUserInfo = true,
  enableTilt = true,
}) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const navigate = useNavigate(); // 👈 navigation hook

  useEffect(() => {
    if (!enableTilt) return;

    const wrap = wrapRef.current;
    const card = cardRef.current;

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = x - rect.width / 2;
      const centerY = y - rect.height / 2;

      const rotateX = centerY / 25;
      const rotateY = -centerX / 25;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      wrap.style.setProperty("--x", `${x}px`);
      wrap.style.setProperty("--y", `${y}px`);
    };

    const resetTransform = () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", resetTransform);

    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", resetTransform);
    };
  }, [enableTilt]);

  return (
    <div ref={wrapRef} className="profile-card-wrapper">
      <div ref={cardRef} className="profile-card">
        <div className="card-glow"></div>
        <div className="card-inner">
          <img
            src={avatarUrl}
            alt={name}
            className="profile-avatar"
            loading="lazy"
          />
          <div className="profile-info">
            <h3>{name}</h3>
            <p>{title}</p>
          </div>
          {showUserInfo && (
            <div className="profile-footer">
              <div className="profile-user">
                <img
                  src={miniAvatarUrl || avatarUrl}
                  alt={name}
                  className="mini-avatar"
                />
                <div>
                  <span className="handle">@{handle}</span>
                  <span className="status">{status}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/contact")}
                className="contact-btn"
                type="button"
              >
                {contactText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileCard);
