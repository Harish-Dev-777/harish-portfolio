import { useState } from "react";
import { projects } from "../constants/data";
import "../styles/Projects.css";
import ProjectCard from "../components/ProjectCard";
import Modal from "../components/Modal";

const Projects = () => {
  const [modal, setModal] = useState({ active: false, index: 0 });

  return (
    <section id="projects">
      <div className="titleContainer">
        <h1>Projects</h1>
      </div>
      <div className="projectCard">
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
    </section>
  );
};

export default Projects;
