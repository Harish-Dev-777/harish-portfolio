import "../styles/Projects.css";
import { FiExternalLink } from "react-icons/fi";

const ProjectCard = ({ index, title, setModal, live }) => {
  const handleMouseEnter = () => setModal({ active: true, index });
  const handleMouseLeave = () => setModal({ active: false, index });
  const handleClick = () => {
    if (live) window.open(live, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <h2>{title}</h2>
      <div className="cardBottom">
        <p>Design & Development</p>

        {live && (
          <div className="goLive">
            <FiExternalLink className="goLiveIcon" />
            <span>Click to Go Live</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
