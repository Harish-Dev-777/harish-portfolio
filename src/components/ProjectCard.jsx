import "../styles/Projects.css";
import { FiExternalLink } from "react-icons/fi";

const ProjectCard = ({ index, title, setModal, live }) => {
  return (
    <div
      className="card"
      onMouseEnter={() => setModal({ active: true, index })}
      onMouseLeave={() => setModal({ active: false, index })}
      onClick={() => {
        if (live) {
          window.open(live, "_blank", "noopener,noreferrer");
        }
      }}
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
