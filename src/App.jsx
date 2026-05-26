import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Intro from './components/Intro.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Resume from './components/Resume.jsx';
import LifePage from './components/LifePage.jsx';
import Footer from './components/Footer.jsx';

function normalizePath(pathname) {
  return pathname === '/life' ? '/life' : '/';
}

function getInitialPath() {
  const params = new URLSearchParams(window.location.search);
  const redirectedPath = params.get('redirect');

  if (redirectedPath) {
    const path = normalizePath(redirectedPath);
    window.history.replaceState({}, '', path);
    return path;
  }

  return normalizePath(window.location.pathname);
}

function App() {
  const [route, setRoute] = useState(getInitialPath);

  useEffect(() => {
    const handlePopState = () => setRoute(normalizePath(window.location.pathname));

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goToRoute = (path) => {
    const normalizedPath = normalizePath(path);

    if (window.location.pathname !== normalizedPath) {
      window.history.pushState({}, '', normalizedPath);
    }

    setRoute(normalizedPath);
    window.scrollTo({ top: 0 });
  };

  const showPortfolioSection = (item) => {
    if (item.route) {
      goToRoute(item.route);
      return;
    }

    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }

    setRoute('/');
    window.setTimeout(() => {
      document.getElementById(item.sectionId)?.scrollIntoView({ block: 'start' });
    }, 0);
  };

  return (
    <div className="site-shell">
      <Header onNavigate={showPortfolioSection} />
      {route === '/life' ? (
        <LifePage onBackHome={() => goToRoute('/')} />
      ) : (
        <main>
          <Intro />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Resume />
        </main>
      )}
      <Footer />
    </div>
  );
}

export default App;
