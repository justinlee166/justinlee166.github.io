import { experience } from '../data/experience.js';

function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container section-layout">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2 id="experience-title">Work experience</h2>
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-item" key={`${item.company}-${item.dates}`}>
              <div className="experience-item__topline">
                <h3>{item.title}</h3>
                {item.dates ? <span>{item.dates}</span> : null}
              </div>
              <div className="experience-item__meta">
                <strong>{item.company}</strong>
                <span>{item.location}</span>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
