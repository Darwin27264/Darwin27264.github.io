// script.js

// Smooth scrolling for nav links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      // Adjust if you want a different offset from the floating nav
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu after clicking
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });
});

// Dark Mode Toggle
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

// Initialize theme based on default state
if (body.classList.contains('dark-mode')) {
  themeToggleBtn.textContent = 'Light Mode';
} else {
  themeToggleBtn.textContent = 'Dark Mode';
}

themeToggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  // Update button text
  if (body.classList.contains('dark-mode')) {
    themeToggleBtn.textContent = 'Light Mode';
  } else {
    themeToggleBtn.textContent = 'Dark Mode';
  }
});

// Reactive Cursor
const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
  customCursor.style.top = `${e.clientY}px`;
  customCursor.style.left = `${e.clientX}px`;
});

const interactiveElements = document.querySelectorAll('a, button, .card-full');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    customCursor.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    customCursor.classList.remove('active');
  });
});

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});
