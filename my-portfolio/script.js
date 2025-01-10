// script.js

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
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
const themeToggleButtons = document.querySelectorAll('.theme-toggle');
const body = document.body;

// Initialize theme based on default state
themeToggleButtons.forEach(button => {
  if (body.classList.contains('dark-mode')) {
    button.textContent = 'Light Mode';
  } else {
    button.textContent = 'Dark Mode';
  }

  // Add event listener to each toggle button
  button.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Update all toggle button texts
    themeToggleButtons.forEach(btn => {
      if (body.classList.contains('dark-mode')) {
        btn.textContent = 'Light Mode';
      } else {
        btn.textContent = 'Dark Mode';
      }
    });
  });
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
