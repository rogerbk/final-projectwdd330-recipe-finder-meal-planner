import { initFeaturedRecipes } from './featuredRecipes.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initFeaturedRecipes();

  // Hamburger menu functionality
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
});
