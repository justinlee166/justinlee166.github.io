function LifePage({ onBackHome }) {
  return (
    <main className="life-page">
      <section className="container life-content" aria-labelledby="life-title">
        <img
          className="knicks-image"
          src="/assets/knicks-msg.jpg"
          alt="New York Knicks game at Madison Square Garden"
        />
        <h1 id="life-title">KNICKS 2026 CHAMPIONS &lt;3</h1>
        <button className="project-button life-back" type="button" onClick={onBackHome}>
          Back home
        </button>
      </section>
    </main>
  );
}

export default LifePage;
