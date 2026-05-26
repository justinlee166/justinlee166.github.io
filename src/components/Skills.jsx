import { skills } from '../data/skills.js';

function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container section-layout">
        <div className="section-heading">
          <p className="eyebrow">Skills</p>
          <h2 id="skills-title">Skills</h2>
        </div>
        <div className="skills-list">
          {skills.map((skillGroup) => (
            <div className="skill-row" key={skillGroup.group}>
              <h3>{skillGroup.group}</h3>
              <ul className="skill-tags" aria-label={`${skillGroup.group} skills`}>
                {skillGroup.items.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
