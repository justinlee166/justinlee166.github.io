// Nav links: handle navigation for both mobile and desktop
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('header');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    const href = link.getAttribute('href');
    const targetSection = document.querySelector(href);
    if (targetSection) {
      // Use ScrollManager's sections to find index
      const sectionIndex = (typeof scrollManager !== 'undefined' && scrollManager.sections)
        ? scrollManager.sections.indexOf(targetSection)
        : -1;
      if (sectionIndex !== -1 && typeof scrollToSection === 'function') {
        scrollToSection(sectionIndex);
      } else {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }
    
    // Close mobile nav
    closeMobileNav();
  });
});

// Navigation tracking now handled by ScrollManager class

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

// Old animation system removed - now handled by ScrollManager

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

// === Enhanced Page-like Section Scrolling with Unified Scroll Manager ===
class ScrollManager {
  constructor() {
    this.sectionIds = ['about', 'projects', 'skills', 'achievements', 'contact'];
    this.sections = this.sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    this.currentSectionIndex = 0;
    this.isPageSnapping = false;
    this.lastScrollTime = 0;
    this.wheelTimeout = null;
    this.scrollProgressBar = document.querySelector('.scroll-progress-bar');
    this.scrollDirectionIndicator = document.querySelector('.scroll-direction-indicator');
    this.directionText = document.querySelector('.direction-text');
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateScrollProgress();
    // Initial nav link setup
    this.setActiveNavLink();
    // Ensure initial seam state is correct
    this.toggleScrollingClass(false);
    this.setupActiveSectionObservers();
  }
  
  setupEventListeners() {
    // Let CSS scroll-snap handle wheel/trackpad scrolling
    
    // Keyboard navigation
    window.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Scroll tracking
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    
    // Initial setup
    window.addEventListener('DOMContentLoaded', () => {
      this.currentSectionIndex = 0;
      this.setActiveNavLink();
      this.handleScrollAnimations();
    });
    
    window.addEventListener('resize', () => {
      this.setActiveNavLink();
    });
  }
  
  handleWheel(e) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    
    // Use requestAnimationFrame for smoother performance
    if (this.wheelTimeout) {
      cancelAnimationFrame(this.wheelTimeout);
    }
    
    this.wheelTimeout = requestAnimationFrame(() => {
      const throttleTime = 200;
      const now = Date.now();
      if (now - this.lastScrollTime < throttleTime) return;
      this.lastScrollTime = now;
      
      if (this.isPageSnapping) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      let nextIndex = this.currentSectionIndex + direction;
      
      if (nextIndex < 0 || nextIndex >= this.sections.length) return;
      
      this.scrollToSection(nextIndex);
      this.showScrollDirection(direction > 0 ? 'Down' : 'Up');
      e.preventDefault();
    });
  }
  
  handleKeydown(e) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    
    if (this.isPageSnapping) return;
    
    if (["PageDown", "ArrowDown"].includes(e.key)) {
      if (this.currentSectionIndex < this.sections.length - 1) {
        this.scrollToSection(this.currentSectionIndex + 1);
        this.showScrollDirection('Down');
        e.preventDefault();
      }
    } else if (["PageUp", "ArrowUp"].includes(e.key)) {
      if (this.currentSectionIndex > 0) {
        this.scrollToSection(this.currentSectionIndex - 1);
        this.showScrollDirection('Up');
        e.preventDefault();
      }
    }
  }
  
  handleScroll() {
    // Mark as scrolling to show transition seam only while moving
    this.toggleScrollingClass(true);
    this.clearScrollTimeout();
    this.scrollIdleTimeout = setTimeout(() => {
      this.toggleScrollingClass(false);
      this.updateActiveSectionBySnapLine();
    }, 160);
    if (this.isPageSnapping) return;
    this.updateScrollProgress();
    this.updateCurrentSection();
    this.handleScrollAnimations();
  }

  clearScrollTimeout() {
    if (this.scrollIdleTimeout) {
      clearTimeout(this.scrollIdleTimeout);
      this.scrollIdleTimeout = null;
    }
  }

  toggleScrollingClass(isScrolling) {
    if (isScrolling) {
      document.body.classList.add('is-scrolling');
    } else {
      document.body.classList.remove('is-scrolling');
    }
  }
  
  updateScrollProgress() {
    if (!this.scrollProgressBar) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    this.scrollProgressBar.style.transform = `scaleX(${scrollPercent / 100})`;
  }
  
  updateCurrentSection() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    this.sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const sectionCenter = sectionTop + (rect.height / 2);
      const viewportCenter = scrollY + (viewportHeight / 2);
      
      if (Math.abs(sectionCenter - viewportCenter) < viewportHeight / 3) {
        this.currentSectionIndex = index;
      }
    });
    
    // Update active nav link
    this.setActiveNavLink();
  }
  
  setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeSection = this.sections[this.currentSectionIndex];
    if (!activeSection) return;
    const activeLink = Array.from(navLinks).find(l => l.getAttribute('href') === `#${activeSection.id}`);
    if (activeLink) activeLink.classList.add('active');
  }
  
  showScrollDirection(direction) {
    if (!this.scrollDirectionIndicator || !this.directionText) return;
    
    this.directionText.textContent = direction;
    this.scrollDirectionIndicator.classList.add('show');
    
    setTimeout(() => {
      this.scrollDirectionIndicator.classList.remove('show');
    }, 1000);
  }
  
  scrollToSection(index) {
    if (index < 0 || index >= this.sections.length) return;
    
    this.isPageSnapping = true;
    this.currentSectionIndex = index;
    
    this.sections[index].scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    });
    closeMobileNav();
    // After smooth scroll, confirm active section based on snap line
    setTimeout(() => {
      this.isPageSnapping = false;
      this.updateActiveSectionBySnapLine();
    }, 600);
  }

  setupActiveSectionObservers() {
    // Use scrollend when supported, fallback to debounced update
    const onRest = () => this.updateActiveSectionBySnapLine();
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', onRest);
    } else {
      // Already debounced in handleScroll; also ensure after resize and hash changes
      window.addEventListener('hashchange', onRest);
      window.addEventListener('resize', () => {
        clearTimeout(this._resizeTO);
        this._resizeTO = setTimeout(onRest, 150);
      });
    }
    // Initial compute post-load
    window.addEventListener('load', onRest);
  }

  updateActiveSectionBySnapLine() {
    const headerHeight = (document.querySelector('header')?.offsetHeight || 0);
    const snapLineY = headerHeight; // top snap line under fixed header
    let bestIndex = 0;
    let bestDistance = Infinity;
    this.sections.forEach((section, idx) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top - snapLineY);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = idx;
      }
    });
    if (bestIndex !== this.currentSectionIndex) {
      this.currentSectionIndex = bestIndex;
    }
    this.setActiveNavLink();
  }
  
  setupMobileScrollPrevention() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      document.addEventListener('wheel', this.preventMobileWheel.bind(this), { passive: false });
    } else {
      document.removeEventListener('wheel', this.preventMobileWheel.bind(this));
    }
  }
  
  preventMobileWheel(e) {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    
    e.preventDefault();
    e.stopPropagation();
  }
  
  handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-fade-in, .scroll-scale-in, .scroll-slide-left, .scroll-slide-right');
    
    animatedElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Trigger animation when element is 20% visible
      if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
        element.classList.add('visible');
      }
    });
  }
}

// Initialize scroll manager
const scrollManager = new ScrollManager();

function scrollToSection(index) {
  // Use the scroll manager's method
  scrollManager.scrollToSection(index);
}

// Mobile wheel prevention is now handled by the ScrollManager class

// Event listeners are now handled by the ScrollManager class

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