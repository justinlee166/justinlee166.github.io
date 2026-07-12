function About() {
  const education = [
    {
      school: 'Stony Brook University',
      dates: '2026 – 2027',
      degree: 'MS Applied Mathematics & Statistics',
      track: 'Statistics Track',
    },
    {
      school: 'Stony Brook University',
      dates: '2023 – 2026',
      degree: 'BS Computer Science, Applied Mathematics & Statistics',
      track: 'Machine Learning Concentration',
    },
  ];

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container section-layout">
        <div className="section-heading">
          <p className="eyebrow">About</p>
          <h2 id="about-title">About</h2>
        </div>
        <div className="text-stack">
          <p>
            I’ve always liked working closer to the backend side of things -- APIs, infrastructure,
            system logic, and figuring out why something broke. Lately I’ve been more interested in
            distributed systems, reliability, and how real products stay stable when a lot is
            happening behind the scenes.
          </p>
          <p>Outside of engineering, I love watching Knicks basketball. Go Knicks!!</p>

          <div className="education-block" aria-labelledby="education-title">
            <h3 id="education-title">Education</h3>
            <div className="education-list">
              {education.map((item) => (
                <article className="education-item" key={`${item.school}-${item.dates}`}>
                  <div className="education-item__topline">
                    <h4>{item.school}</h4>
                    <span>{item.dates}</span>
                  </div>
                  <p>{item.degree}</p>
                  {item.track ? <p>{item.track}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
