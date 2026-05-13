/**
 * TONA CORPORATION WEBSITE - MAIN JAVASCRIPT
 * Pure vanilla JavaScript - no dependencies
 */

(function() {
  'use strict';

  // Mobile Menu Toggle
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.mobile-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', function() {
        menu.classList.toggle('open');
      });
    }
  }

  // Header Scroll Effect
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function handleScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Active Nav Link
  function initActiveNavLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath && currentPath.includes(linkPath) && linkPath !== '/') {
        link.classList.add('active');
      } else if (linkPath === '/' && currentPath === '/') {
        link.classList.add('active');
      }
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initHeaderScroll();
    initActiveNavLinks();
  });

})();
