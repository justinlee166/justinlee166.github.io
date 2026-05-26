const navItems = [
  { label: 'About', sectionId: 'about' },
  { label: 'Experience', sectionId: 'experience' },
  { label: 'Projects', sectionId: 'projects' },
  { label: 'Skills', sectionId: 'skills' },
  { label: 'Resume', sectionId: 'resume' },
  { label: 'Life', route: '/life' },
];

function Header({ onNavigate }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="brand" type="button" onClick={() => onNavigate({ sectionId: 'top' })} aria-label="Justin Lee home">
          Justin Lee
        </button>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button type="button" onClick={() => onNavigate(item)} key={item.label}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
