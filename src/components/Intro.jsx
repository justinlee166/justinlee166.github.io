import ProfileLinks from './ProfileLinks.jsx';

function Intro() {
  return (
    <section className="intro" id="top" aria-labelledby="intro-title">
      <div className="container">
        <h1 id="intro-title">Justin Lee</h1>
        <p className="intro-role">Software Engineer</p>
        <p className="intro-summary">
          Backend, distributed systems, and building things that make sense.
        </p>
        <ProfileLinks />
      </div>
    </section>
  );
}

export default Intro;
