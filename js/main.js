// Nav links: remove smooth scroll, use default anchor behavior
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('header');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    // Only close mobile nav, do not prevent default or scroll manually
    closeMobileNav();
  });
});

// Highlight active nav link on scroll
function setActiveNavLink() {
  const scrollPos = window.scrollY + header.offsetHeight + 10;
  let foundActive = false;
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (!foundActive && scrollPos >= sectionTop && scrollPos < sectionBottom) {
        link.classList.add('active');
        foundActive = true;
      } else {
        link.classList.remove('active');
      }
    } else {
      link.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', setActiveNavLink);
window.addEventListener('DOMContentLoaded', setActiveNavLink);
window.addEventListener('resize', setActiveNavLink);

// Hamburger menu logic
const navToggle = document.querySelector('.nav-toggle');
const navLinksContainer = document.getElementById('nav-links');

function openMobileNav() {
  navLinksContainer.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
}
function closeMobileNav() {
  navLinksContainer.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle) {
  navToggle.addEventListener('click', function() {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

// Close nav on resize if desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 600) {
    closeMobileNav();
  }
});

// === Fade-in/Slide-up Animations ===
function animateOnScroll() {
  const animatedEls = document.querySelectorAll('[data-animate]');
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });
  animatedEls.forEach(el => {
    observer.observe(el);
  });
}
window.addEventListener('DOMContentLoaded', animateOnScroll);

// === Dark Mode Toggle ===
const darkToggle = document.querySelector('.dark-toggle');
const darkToggleIcon = document.querySelector('.dark-toggle-icon');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Draggable functionality variables
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let toggleStartX = 0;
let toggleStartY = 0;
let animationId = null;

function setDarkMode(enabled) {
  document.body.classList.toggle('dark-theme', enabled);
  localStorage.setItem('darkMode', enabled ? '1' : '0');
  setDarkToggleIcon(enabled);
}

function setDarkToggleIcon(isDark) {
  if (!darkToggleIcon) return;
  darkToggleIcon.innerHTML = isDark
    ? `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none"><path d="M21.64 13.07A9 9 0 0 1 12 3a1 1 0 0 0-1 1v.25A8 8 0 1 0 20.75 13a1 1 0 0 0 .89-1.13Z" fill="currentColor"/></svg>`
    : `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5.75" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
}

function getStoredDarkMode() {
  const stored = localStorage.getItem('darkMode');
  if (stored === '1') return true;
  if (stored === '0') return false;
  return prefersDark;
}

function getStoredTogglePosition() {
  const stored = localStorage.getItem('togglePosition');
  if (stored) {
    return JSON.parse(stored);
  }
  return { x: window.innerWidth - 70, y: 20 }; // Default position
}

function saveTogglePosition(x, y) {
  localStorage.setItem('togglePosition', JSON.stringify({ x, y }));
}

function setTogglePosition(x, y) {
  if (!darkToggle) return;
  
  // Ensure toggle stays within viewport bounds
  const toggleSize = 50;
  const minX = 0;
  const maxX = window.innerWidth - toggleSize;
  const minY = 0;
  const maxY = window.innerHeight - toggleSize;
  
  x = Math.max(minX, Math.min(maxX, x));
  y = Math.max(minY, Math.min(maxY, y));
  
  darkToggle.style.left = x + 'px';
  darkToggle.style.top = y + 'px';
  darkToggle.style.right = 'auto';
  
  return { x, y };
}

function checkEdgeMinimize(x) {
  const edgeThreshold = 50;
  const isAtEdge = x <= edgeThreshold || x >= (window.innerWidth - edgeThreshold);
  
  if (isAtEdge && !darkToggle.classList.contains('minimized')) {
    darkToggle.classList.add('minimized');
  } else if (!isAtEdge && darkToggle.classList.contains('minimized')) {
    darkToggle.classList.remove('minimized');
  }
}

function startDrag(e) {
  if (darkToggle.classList.contains('minimized')) return;
  
  isDragging = true;
  darkToggle.classList.add('dragging');
  
  // Get initial mouse/touch position
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  
  dragStartX = clientX;
  dragStartY = clientY;
  
  // Get initial toggle position
  const rect = darkToggle.getBoundingClientRect();
  toggleStartX = rect.left;
  toggleStartY = rect.top;
  
  // Prevent default to avoid text selection
  e.preventDefault();
}

function drag(e) {
  if (!isDragging) return;
  
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  
  const deltaX = clientX - dragStartX;
  const deltaY = clientY - dragStartY;
  
  const newX = toggleStartX + deltaX;
  const newY = toggleStartY + deltaY;
  
  setTogglePosition(newX, newY);
  checkEdgeMinimize(newX);
  
  e.preventDefault();
}

function endDrag(e) {
  if (!isDragging) return;
  
  isDragging = false;
  darkToggle.classList.remove('dragging');
  
  // Save final position
  const rect = darkToggle.getBoundingClientRect();
  saveTogglePosition(rect.left, rect.top);
  
  // Check if it was just a click (minimal movement)
  const clientX = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
  const clientY = e.type.includes('touch') ? e.changedTouches[0].clientY : e.clientY;
  
  const deltaX = Math.abs(clientX - dragStartX);
  const deltaY = Math.abs(clientY - dragStartY);
  
  // If minimal movement, treat as click for dark mode toggle
  if (deltaX < 5 && deltaY < 5) {
    setDarkMode(!document.body.classList.contains('dark-theme'));
  }
}

if (darkToggle) {
  // Initialize dark mode and position
  setDarkMode(getStoredDarkMode());
  const savedPosition = getStoredTogglePosition();
  setTogglePosition(savedPosition.x, savedPosition.y);
  checkEdgeMinimize(savedPosition.x);
  
  // Mouse events
  darkToggle.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  
  // Touch events
  darkToggle.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', endDrag, { passive: false });
  
  // Handle window resize to keep toggle in bounds
  window.addEventListener('resize', () => {
    const rect = darkToggle.getBoundingClientRect();
    const newPosition = setTogglePosition(rect.left, rect.top);
    saveTogglePosition(newPosition.x, newPosition.y);
    checkEdgeMinimize(newPosition.x);
  });
  
  // Handle minimized state hover
  darkToggle.addEventListener('mouseenter', () => {
    if (darkToggle.classList.contains('minimized')) {
      darkToggle.classList.remove('minimized');
    }
  });
  
  darkToggle.addEventListener('mouseleave', () => {
    const rect = darkToggle.getBoundingClientRect();
    checkEdgeMinimize(rect.left);
  });
}

// === Enhanced Page-like Section Scrolling for Mobile ===
const sectionIds = ['about', 'projects', 'skills', 'achievements', 'contact'];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
let currentSectionIndex = 0;
let isPageSnapping = false;
let lastScrollTime = 0;

function scrollToSection(index) {
  if (index < 0 || index >= sections.length) return;
  isPageSnapping = true;
  currentSectionIndex = index;
  
  // Faster, smoother scrolling for mobile
  const isMobile = window.innerWidth <= 768;
  const scrollBehavior = isMobile ? 'smooth' : 'smooth';
  
  sections[index].scrollIntoView({ 
    behavior: scrollBehavior, 
    block: 'start',
    inline: 'nearest'
  });
  
  // Shorter timeout for more responsive feel on mobile
  const timeout = isMobile ? 400 : 600;
  setTimeout(() => { isPageSnapping = false; }, timeout);
}

// Desktop only: Enhanced wheel event handling for slide scrolling
window.addEventListener('wheel', (e) => {
  const isMobile = window.innerWidth <= 768;
  
  // Disable forced scrolling on mobile - allow natural scroll
  if (isMobile) return;
  
  const throttleTime = 300;
  
  // Prevent multiple triggers on single scroll gesture
  const now = Date.now();
  if (now - lastScrollTime < throttleTime) return;
  lastScrollTime = now;
  
  if (isPageSnapping) return;
  
  const direction = e.deltaY > 0 ? 1 : -1; // 1 = down, -1 = up
  let nextIndex = currentSectionIndex + direction;
  
  // Respect bounds: don't scroll beyond first/last section
  if (nextIndex < 0 || nextIndex >= sections.length) return;
  
  scrollToSection(nextIndex);
  e.preventDefault();
}, { passive: false });

// Desktop only: Enhanced keyboard navigation
window.addEventListener('keydown', (e) => {
  const isMobile = window.innerWidth <= 768;
  
  // Disable forced keyboard scrolling on mobile
  if (isMobile) return;
  
  if (isPageSnapping) return;
  
  if (["PageDown", "ArrowDown"].includes(e.key)) {
    if (currentSectionIndex < sections.length - 1) {
      scrollToSection(currentSectionIndex + 1);
      e.preventDefault();
    }
  } else if (["PageUp", "ArrowUp"].includes(e.key)) {
    if (currentSectionIndex > 0) {
      scrollToSection(currentSectionIndex - 1);
      e.preventDefault();
    }
  }
});

// Desktop only: Update current section index on scroll
window.addEventListener('scroll', () => {
  const isMobile = window.innerWidth <= 768;
  
  // Disable section tracking on mobile
  if (isMobile) return;
  
  if (isPageSnapping) return;
  
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  
  // Determine which section is most visible
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + scrollY;
    const sectionCenter = sectionTop + (rect.height / 2);
    const viewportCenter = scrollY + (viewportHeight / 2);
    
    if (Math.abs(sectionCenter - viewportCenter) < viewportHeight / 3) {
      currentSectionIndex = index;
    }
  });
});

// Initialize current section index on page load
window.addEventListener('DOMContentLoaded', () => {
  currentSectionIndex = 0;
});

// === Contact Form Toggle ===
const emailToggleBtn = document.getElementById('emailToggleBtn');
const contactForm = document.getElementById('contactForm');

if (emailToggleBtn && contactForm) {
  emailToggleBtn.addEventListener('click', function() {
    // Hide the email toggle button
    emailToggleBtn.style.display = 'none';
    
    // Show the contact form
    contactForm.classList.remove('hidden');
    
    // Focus on the first input for accessibility
    const firstInput = contactForm.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  });
}

// === WIP Project Card Overlay ===
document.addEventListener('click', function(e) {
  const card = e.target.closest('.project-card[data-wip="true"]');
  if (!card) return;
  e.preventDefault();
  card.classList.toggle('wip-active');
}); 