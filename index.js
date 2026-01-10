/**
 * ============================================
 * BIREENA ATITHI - Navigation System
 * ============================================
 * Senior Frontend Developer Implementation
 * 
 * Features:
 * - Mobile sidebar with smooth slide animation
 * - Dropdown expand/collapse (Petpooja style)
 * - Desktop hover behavior unchanged
 * - Full accessibility support
 * - Production-ready, optimized code
 * ============================================
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initSidebar();
    initDropdowns();
    initTestimonialSlider();
    initCounterAnimation();
  }

  // ============================================
  // CONFIGURATION
  // ============================================
  
  const CONFIG = {
    mobileBreakpoint: 900,  // px - matches CSS breakpoint
    dropdownCloseDelay: 200, // ms - delay before closing on desktop
    animationDuration: 300   // ms - for smooth transitions
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Check if current viewport is mobile
   * @returns {boolean}
   */
  function isMobile() {
    return window.innerWidth <= CONFIG.mobileBreakpoint;
  }

  /**
   * Prevent event default and stop propagation
   * @param {Event} e 
   */
  function stopEvent(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // ============================================
  // MOBILE SIDEBAR MODULE
  // ============================================

  function initSidebar() {
    const openBtn = document.getElementById('openMenu');
    const closeBtn = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebarNav');
    const overlay = document.getElementById('menuOverlay');

    if (!sidebar) return;

    /**
     * Open sidebar with animation
     */
    function open() {
      sidebar.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.classList.add('no-scroll');
      sidebar.setAttribute('aria-hidden', 'false');
      
      // Focus management for accessibility
      if (closeBtn) closeBtn.focus();
    }

    /**
     * Close sidebar with animation
     */
    function close() {
      sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
      sidebar.setAttribute('aria-hidden', 'true');
      
      // Close all dropdowns when sidebar closes
      document.querySelectorAll('.dropdown.open').forEach(d => {
        d.classList.remove('open');
        const panel = d.querySelector('.dropdown-panel');
        if (panel) panel.setAttribute('aria-hidden', 'true');
        const toggle = d.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
      
      // Return focus to open button
      if (openBtn) openBtn.focus();
    }

    // EVENT: Open button click
    if (openBtn) {
      openBtn.addEventListener('click', function(e) {
        stopEvent(e);
        open();
      });
    }

    // EVENT: Close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        stopEvent(e);
        close();
      });
    }

    // EVENT: Overlay click - close sidebar
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        stopEvent(e);
        close();
      });
    }

    // EVENT: Prevent clicks inside sidebar from closing it
    sidebar.addEventListener('click', function(e) {
      // IMPORTANT: Stop propagation so document click doesn't fire
      e.stopPropagation();
    });

    // EVENT: Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        close();
      }
    });

    // EVENT: Close on window resize to desktop
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        if (!isMobile() && sidebar.classList.contains('active')) {
          close();
        }
      }, 100);
    });
  }

  // ============================================
  // DROPDOWN MODULE
  // ============================================

  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const closeTimers = new Map();

    dropdowns.forEach(function(dropdown) {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const panel = dropdown.querySelector('.dropdown-panel');

      if (!toggle || !panel) return;

      // Set initial ARIA attributes
      toggle.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');

      /**
       * Open this dropdown
       */
      function openDropdown() {
        // On desktop, close other dropdowns first
        if (!isMobile()) {
          closeAllDropdowns();
        }
        
        dropdown.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
      }

      /**
       * Close this dropdown
       */
      function closeDropdown() {
        dropdown.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
      }

      /**
       * Toggle dropdown state
       */
      function toggleDropdown() {
        if (dropdown.classList.contains('open')) {
          closeDropdown();
        } else {
          openDropdown();
        }
      }

      /**
       * Close all dropdowns
       */
      function closeAllDropdowns() {
        dropdowns.forEach(function(d) {
          d.classList.remove('open');
          const p = d.querySelector('.dropdown-panel');
          const t = d.querySelector('.dropdown-toggle');
          if (p) p.setAttribute('aria-hidden', 'true');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }

      // ----------------------------------------
      // CLICK EVENT - Works on both mobile & desktop
      // ----------------------------------------
      toggle.addEventListener('click', function(e) {
        // CRITICAL: Prevent default behavior
        e.preventDefault();
        // CRITICAL: Stop propagation to prevent document click handler
        e.stopPropagation();
        
        // Cancel any pending close timer
        const timer = closeTimers.get(dropdown);
        if (timer) {
          clearTimeout(timer);
          closeTimers.delete(dropdown);
        }

        toggleDropdown();
      });

      // ----------------------------------------
      // DESKTOP ONLY - Hover behavior
      // ----------------------------------------
      
      // Mouse enter - open immediately
      dropdown.addEventListener('mouseenter', function() {
        if (isMobile()) return; // Skip on mobile
        
        // Cancel any pending close
        const timer = closeTimers.get(dropdown);
        if (timer) {
          clearTimeout(timer);
          closeTimers.delete(dropdown);
        }
        
        openDropdown();
      });

      // Mouse leave - close with delay
      dropdown.addEventListener('mouseleave', function() {
        if (isMobile()) return; // Skip on mobile
        
        const timer = setTimeout(function() {
          closeDropdown();
          closeTimers.delete(dropdown);
        }, CONFIG.dropdownCloseDelay);
        
        closeTimers.set(dropdown, timer);
      });

      // ----------------------------------------
      // Prevent panel clicks from closing dropdown
      // ----------------------------------------
      panel.addEventListener('click', function(e) {
        // Don't stop propagation for actual links
        // but do stop it for the panel itself
        if (e.target === panel || e.target.closest('.panel-list')) {
          e.stopPropagation();
        }
      });
    });

    // ----------------------------------------
    // DOCUMENT CLICK - Close dropdowns on outside click
    // ----------------------------------------
    document.addEventListener('click', function(e) {
      // Only on desktop
      if (isMobile()) return;
      
      // Check if click is outside all dropdowns
      const clickedDropdown = e.target.closest('.dropdown');
      if (!clickedDropdown) {
        dropdowns.forEach(function(d) {
          d.classList.remove('open');
          const p = d.querySelector('.dropdown-panel');
          const t = d.querySelector('.dropdown-toggle');
          if (p) p.setAttribute('aria-hidden', 'true');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // ============================================
  // TESTIMONIAL SLIDER MODULE
  // ============================================

  function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval;

    /**
     * Show slide at given index
     * @param {number} index 
     */
    function showSlide(index) {
      // Normalize index
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;

      // Update slides
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });

      // Update dots
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
      });

      currentIndex = index;
    }

    /**
     * Start autoplay
     */
    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(function() {
        showSlide(currentIndex + 1);
      }, 5000);
    }

    /**
     * Stop autoplay
     */
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    }

    // Dot click handlers
    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        showSlide(parseInt(dot.dataset.slide) || index);
        startAutoplay(); // Reset timer
      });
    });

    // Start autoplay
    startAutoplay();
  }

  // ============================================
  // COUNTER ANIMATION MODULE
  // ============================================

  function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.testimonial-stats');
    
    if (!statsSection || counters.length === 0) return;

    let animated = false;

    /**
     * Animate all counters
     */
    function animate() {
      if (animated) return;
      animated = true;

      counters.forEach(function(counter) {
        const target = parseFloat(counter.dataset.target) || 0;
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(target * easeOut);
          
          counter.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = target + suffix;
          }
        }

        requestAnimationFrame(update);
      });
    }

    // Use Intersection Observer
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(statsSection);
    } else {
      // Fallback for older browsers
      animate();
    }
  }

})();
