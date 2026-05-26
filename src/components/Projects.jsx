import { featuredProject, projects } from '../data/projects.js';

function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container section-layout">
        <div className="section-heading">
          <p className="eyebrow">Projects</p>
          <h2 id="projects-title">Projects</h2>
        </div>
        <div className="projects-content">
          <div className="project-group">
            <h3 className="project-group-title">Featured Project</h3>
            <article className="featured-project">
              <h4>{featuredProject.title}</h4>
              <p className="project-stack">{featuredProject.stack}</p>
              <p>{featuredProject.description}</p>
              <a className="project-button" href={featuredProject.link.href}>
                {featuredProject.link.label}
              </a>
            </article>
          </div>

          <div className="project-group">
            <h3 className="project-group-title">Selected Projects</h3>
            <div className="project-list">
              {projects.map((project) => (
                <article className="project-row" key={project.title}>
                  <h4>{project.title}</h4>
                  <p className="project-stack">{project.stack}</p>
                  <p>{project.description}</p>
                  <a className="project-button" href={project.link.href}>
                    {project.link.label}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
