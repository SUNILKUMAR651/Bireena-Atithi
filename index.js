/**
 * ============================================
 * BIREENA ATITHI - Navigation System
 * ============================================
 * Mobile sidebar with dropdown functionality
 * Petpooja-style navigation behavior
 * 
 * Features:
 * - Smooth sidebar slide animation
 * - Dropdown expand/collapse with animation
 * - Sidebar stays open while interacting
 * - Closes only on X button or overlay click
 * - Desktop hover behavior preserved
 * ============================================
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initDropdowns();
    initTestimonialSlider();
    initCounterAnimation();
  });

  // ============================================
  // MOBILE SIDEBAR
  // ============================================
  function initSidebar() {
    var openBtn = document.getElementById('openMenu');
    var closeBtn = document.getElementById('closeMenu');
    var sidebar = document.getElementById('sidebarNav');
    var overlay = document.getElementById('menuOverlay');

    if (!sidebar) return;

    /**
     * Opens the sidebar with animation
     * - Adds 'active' class to sidebar and overlay
     * - Prevents body scroll
     */
    function openSidebar() {
      sidebar.classList.add('active');
      sidebar.setAttribute('aria-hidden', 'false');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      if (overlay) overlay.classList.add('active');
      document.body.classList.add('no-scroll');
    }

    /**
     * Closes the sidebar with animation
     * - Removes 'active' class from sidebar and overlay
     * - Restores body scroll
     * - Closes all open dropdowns
     */
    function closeSidebar() {
      sidebar.classList.remove('active');
      sidebar.setAttribute('aria-hidden', 'true');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
      
      // Close all dropdowns when sidebar closes
      var allDropdowns = document.querySelectorAll('.dropdown.open');
      for (var i = 0; i < allDropdowns.length; i++) {
        allDropdowns[i].classList.remove('open');
        var toggle = allDropdowns[i].querySelector('.dropdown-toggle');
        var panel = allDropdowns[i].querySelector('.dropdown-panel');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (panel) panel.setAttribute('aria-hidden', 'true');
      }
    }

    // Open sidebar on hamburger click
    if (openBtn) {
      openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openSidebar();
      });
    }

    // Close sidebar on X button click
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeSidebar();
      });

      // Mobile: close immediately on tap
      closeBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeSidebar();
      }, { passive: false });
    }

    // IMPORTANT: Do NOT close sidebar when clicking outside/overlay.
    // Sidebar closes only via the X button (and Escape key).
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
    }

    /**
     * CRITICAL: Prevent clicks inside sidebar from closing it
     * This stops event propagation so document click handler doesn't fire
     */
    sidebar.addEventListener('click', function(e) {
      // Only stop propagation, don't prevent default (allow links to work)
      e.stopPropagation();
    });

    /**
     * CRITICAL: Prevent touch events inside sidebar from closing it
     * Important for mobile touch interactions
     */
    sidebar.addEventListener('touchstart', function(e) {
      e.stopPropagation();
    }, { passive: true });

    sidebar.addEventListener('touchend', function(e) {
      e.stopPropagation();
    }, { passive: true });

    // Close sidebar on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebar();
      }
    });

    // Close sidebar on resize to desktop (cleanup)
    window.addEventListener('resize', function() {
      if (window.innerWidth > 900 && sidebar.classList.contains('active')) {
        closeSidebar();
      }
    });
  }

  // ============================================
  // DROPDOWN FUNCTIONALITY
  // ============================================
  function initDropdowns() {
    var dropdowns = document.querySelectorAll('.dropdown');

    function getPanel(dropdown, toggle) {
      var targetId = toggle ? toggle.getAttribute('data-dropdown') : null;
      if (targetId) {
        var byId = document.getElementById(targetId);
        if (byId) return byId;
      }
      return dropdown ? dropdown.querySelector('.dropdown-panel') : null;
    }

    for (var i = 0; i < dropdowns.length; i++) {
      (function(dropdown) {
        var toggle = dropdown.querySelector('.dropdown-toggle');
        var panel = getPanel(dropdown, toggle);

        if (!toggle || !panel) return;

        // Set initial ARIA attributes for accessibility
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-haspopup', 'true');
        var controlsId = toggle.getAttribute('data-dropdown');
        if (controlsId) toggle.setAttribute('aria-controls', controlsId);
        panel.setAttribute('aria-hidden', 'true');

        /**
         * Toggle dropdown open/close state
         * - Prevents default to stop navigation
         * - Stops propagation to prevent sidebar close
         */
        toggle.addEventListener('click', function(e) {
          // CRITICAL: Prevent default navigation and stop bubbling
          e.preventDefault();
          e.stopPropagation();

          // Re-resolve panel (safe if DOM changed)
          panel = getPanel(dropdown, toggle);
          if (!panel) return;

          var isOpen = dropdown.classList.contains('open');

          if (isOpen) {
            // Close this dropdown
            closeDropdown(dropdown);
          } else {
            // Open this dropdown
            openDropdown(dropdown);
          }
        });

        // DESKTOP ONLY: Hover behavior (mouse enter/leave)
        dropdown.addEventListener('mouseenter', function() {
          if (window.innerWidth <= 900) return; // Skip on mobile
          panel = getPanel(dropdown, toggle);
          if (!panel) return;
          openDropdown(dropdown);
        });

        dropdown.addEventListener('mouseleave', function() {
          if (window.innerWidth <= 900) return; // Skip on mobile
          panel = getPanel(dropdown, toggle);
          if (!panel) return;
          closeDropdown(dropdown);
        });

        /**
         * Prevent clicks inside dropdown panel from:
         * 1. Closing the dropdown
         * 2. Closing the sidebar
         * But allow link clicks to navigate
         */
        panel.addEventListener('click', function(e) {
          e.stopPropagation();
          // Don't prevent default - allow links to work
        });

      })(dropdowns[i]);
    }

    /**
     * Helper: Open a dropdown
     */
    function openDropdown(dropdown) {
      var toggle = dropdown.querySelector('.dropdown-toggle');
      var panel = getPanel(dropdown, toggle);
      
      dropdown.classList.add('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      if (panel) panel.setAttribute('aria-hidden', 'false');
    }

    /**
     * Helper: Close a dropdown
     */
    function closeDropdown(dropdown) {
      var toggle = dropdown.querySelector('.dropdown-toggle');
      var panel = getPanel(dropdown, toggle);
      
      dropdown.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (panel) panel.setAttribute('aria-hidden', 'true');
    }

    // Close dropdowns when clicking outside (DESKTOP ONLY)
    document.addEventListener('click', function(e) {
      // Only apply on desktop
      if (window.innerWidth <= 900) return;
      
      // If click is not inside any dropdown, close all
      if (!e.target.closest('.dropdown')) {
        for (var k = 0; k < dropdowns.length; k++) {
          closeDropdown(dropdowns[k]);
        }
      }
    });

    /**
     * Handle touch events on mobile
     * Prevent touchstart from closing dropdowns/sidebar
     */
    var allDropdownPanels = document.querySelectorAll('.dropdown-panel');
    for (var p = 0; p < allDropdownPanels.length; p++) {
      allDropdownPanels[p].addEventListener('touchstart', function(e) {
        e.stopPropagation();
      }, { passive: true });
    }
  }

  // ============================================
  // TESTIMONIAL SLIDER
  // ============================================
  function initTestimonialSlider() {
    var slides = document.querySelectorAll('.testi-slide');
    var dots = document.querySelectorAll('.slider-dot');
    var currentSlide = 0;
    var totalSlides = slides.length;
    var autoSlideInterval;

    if (totalSlides === 0) return;

    function showSlide(index) {
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
      }

      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Dot click handlers
    for (var i = 0; i < dots.length; i++) {
      (function(index) {
        dots[index].addEventListener('click', function() {
          stopAutoSlide();
          currentSlide = index;
          showSlide(currentSlide);
          startAutoSlide();
        });
      })(i);
    }

    // Start auto slide
    showSlide(0);
    startAutoSlide();
  }

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function initCounterAnimation() {
    var counters = document.querySelectorAll('.stat-number');
    var hasAnimated = false;

    if (counters.length === 0) return;

    function animateCounter(element) {
      var target = parseInt(element.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      var duration = 2000;
      var startTime = null;

      function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var current = Math.floor(progress * target);
        element.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(updateCounter);
    }

    function checkCounters() {
      if (hasAnimated) return;

      var statsSection = document.querySelector('.stats-strip');
      if (!statsSection) return;

      var rect = statsSection.getBoundingClientRect();
      var isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        hasAnimated = true;
        for (var i = 0; i < counters.length; i++) {
          animateCounter(counters[i]);
        }
      }
    }

    // Check on scroll and load
    window.addEventListener('scroll', checkCounters);
    checkCounters();
  }

})();
