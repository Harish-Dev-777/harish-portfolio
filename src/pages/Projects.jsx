import { memo } from "react";
import { projects } from "../constants/data";
import "../styles/Projects.css";
import ProjectCard from "../components/ProjectCard";
import SEO from "../components/SEO";
import { pageMetadata } from "../utils/seo";

const Projects = () => {
  return (
    <section id="projects">
      <SEO
        title={pageMetadata.projects.title}
        description={pageMetadata.projects.description}
        keywords={pageMetadata.projects.keywords}
      />
      <div className="titleContainer">
        <h1>Projects</h1>
      </div>
      <div className="projectCard">
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            title={project.title}
            src={project.src}
            color={project.color}
            live={project.live}
          />
        ))}
      </div>
    </section>
  );
};

export default memo(Projects);
