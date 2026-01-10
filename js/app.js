/**
 * ============================================
 * BIREENA ATITHI - Application Logic
 * ============================================
 * Handles Navigation, Routing, and Components
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Initialize Core UI
    if (typeof initSidebar === 'function') initSidebar();
    if (typeof initDropdowns === 'function') initDropdowns();

    // Initialize Router
    initRouter();
    
    // Initial Component Load
    initActiveLink();
    initTestimonialSlider();
    initCounterAnimation();
    if (typeof window.initPricingToggle === 'function') window.initPricingToggle();
  });

  // ============================================
  // SPA ROUTER
  // ============================================
  function initRouter() {
    // Intercept all link clicks
    document.body.addEventListener('click', function(e) {
      if (e.target.closest('a')) {
        var link = e.target.closest('a');
        var href = link.getAttribute('href');
        
        // Skip null, external, anchors, tel/mailto
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        
        // Handle internal relative links (starting with / or just filename)
        // We assume any clean link is internal to our SPA
        e.preventDefault();
        navigateTo(href);
      }
    });

    // Handle browser Back/Forward logic
    window.addEventListener('popstate', function() {
      loadRoute(window.location.pathname);
    });

    // Handle initial load
    loadRoute(window.location.pathname);
  }

  function navigateTo(url) {
    history.pushState(null, null, url);
    loadRoute(url);
  }

  function loadRoute(path) {
    // Normalize path: /billing -> billing
    var route = path.replace(/^\//, '') || 'home';
    if (route === 'index.html' || route === '') route = 'home';
    
    // Remove .html extension if present for cleaner lookup (optional)
    route = route.replace('.html', '');

    // Construct section path
    var sectionPath = 'sections/' + route + '.html';

    loadContent(sectionPath, route);
  }

  function loadContent(url, routeName) {
    var main = document.getElementById('main-content') || document.querySelector('main');
    if (!main) return;
    
    main.style.opacity = '0.5';
    main.style.transition = 'opacity 0.2s';

    fetch(url)
      .then(response => {
          if (!response.ok) throw new Error('Section not found');
          return response.text();
      })
      .then(html => {
          main.innerHTML = html;
          // Re-initialize specific page scripts
          if (routeName === 'pricing' && typeof window.initPricingToggle === 'function') {
              window.initPricingToggle();
          }
          // Re-run component initializers that might depend on new content
          initTestimonialSlider(); 
          initCounterAnimation();
          
          // Scroll to top
          window.scrollTo(0, 0);
      })
      .catch(err => {
          console.warn('Load failed:', err);
          // Fallback to 404 or Home if needed, or show error
          main.innerHTML = '<div class="container" style="padding:100px 0;text-align:center;"><h1>404</h1><p>Page not found.</p></div>';
      })
      .finally(() => {
          main.style.opacity = '1';
          initActiveLink(); // Update nav state
      });
  }

  // ============================================
  // COMPONENTS
  // ============================================
  
  function initActiveLink() {
      var currentPath = window.location.pathname;
      var links = document.querySelectorAll('.nav-menu a, .nav-secondary a');
      
      links.forEach(l => {
          l.classList.remove('active');
          var href = l.getAttribute('href');
          // Exact match or partial match logic could go here
          if (href === currentPath || href === '/' + currentPath.replace(/^\//, '')) {
              l.classList.add('active');
          }
      });
  }

  function initTestimonialSlider() {
    var slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    // Basic logic if needed, extracted from old index.js if present
  }

  function initCounterAnimation() {
    var counters = document.querySelector('.counter-section');
    if (!counters) return;
    // Basic logic if needed
  }

})();
