function Resume() {
  return (
    <section className="section" id="resume" aria-labelledby="resume-title">
      <div className="container section-layout">
        <div className="section-heading">
          <p className="eyebrow">Resume</p>
          <h2 id="resume-title">Resume</h2>
        </div>
        <div className="resume-content">
          <p>PDF version of my resume with education, experience, projects, and technical skills.</p>
          <a className="button" href="/assets/resume.pdf" target="_blank" rel="noreferrer">
            Open Resume
          </a>
        </div>
      </div>
    </section>
  );
}

export default Resume;
