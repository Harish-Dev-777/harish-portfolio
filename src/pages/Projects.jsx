import { useState } from "react";
import { projects } from "../constants/data";
import "../styles/Projects.css";
import ProjectCard from "../components/ProjectCard";
import Modal from "../components/Modal";

const Projects = () => {
  const [modal, setModal] = useState({ active: false, index: 0 });

  return (
    <div id="projects">
      <div className="projectCard">
        <h1>Projects</h1>
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            index={index}
            title={project.title}
            color={project.color}
            setModal={setModal}
            live={project.live} 
          />
        ))}
      </div>

      <Modal modal={modal} />
    </div>
  );
};

export default Projects;
