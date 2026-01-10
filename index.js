/**
 * ============================================
 * BIREENA ATITHI - Navigation System
 * ============================================
 * Mobile sidebar with dropdown functionality
 * Same behavior as desktop - dropdowns expand on click
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

    function openSidebar() {
      sidebar.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.classList.add('no-scroll');
    }

    function closeSidebar() {
      sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
      
      // Close all dropdowns when sidebar closes
      var allDropdowns = document.querySelectorAll('.dropdown.open');
      for (var i = 0; i < allDropdowns.length; i++) {
        allDropdowns[i].classList.remove('open');
        var panel = allDropdowns[i].querySelector('.dropdown-panel');
        if (panel) panel.setAttribute('aria-hidden', 'true');
      }
    }

    // Open sidebar
    if (openBtn) {
      openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openSidebar();
      });
    }

    // Close sidebar
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeSidebar();
      });
    }

    // Close on overlay click
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeSidebar();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebar();
      }
    });

    // Close sidebar on resize to desktop
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

    for (var i = 0; i < dropdowns.length; i++) {
      (function(dropdown) {
        var toggle = dropdown.querySelector('.dropdown-toggle');
        var panel = dropdown.querySelector('.dropdown-panel');

        if (!toggle || !panel) return;

        // Set initial state
        panel.setAttribute('aria-hidden', 'true');

        // CLICK handler for dropdown toggle
        toggle.addEventListener('click', function(e) {
          // IMPORTANT: Prevent default and stop propagation
          e.preventDefault();
          e.stopPropagation();

          var isOpen = dropdown.classList.contains('open');

          if (isOpen) {
            // Close this dropdown
            dropdown.classList.remove('open');
            panel.setAttribute('aria-hidden', 'true');
          } else {
            // Close other dropdowns first (on mobile)
            if (window.innerWidth <= 900) {
              for (var j = 0; j < dropdowns.length; j++) {
                if (dropdowns[j] !== dropdown) {
                  dropdowns[j].classList.remove('open');
                  var p = dropdowns[j].querySelector('.dropdown-panel');
                  if (p) p.setAttribute('aria-hidden', 'true');
                }
              }
            }
            // Open this dropdown
            dropdown.classList.add('open');
            panel.setAttribute('aria-hidden', 'false');
          }
        });

        // DESKTOP ONLY: Hover behavior
        dropdown.addEventListener('mouseenter', function() {
          if (window.innerWidth <= 900) return;
          dropdown.classList.add('open');
          panel.setAttribute('aria-hidden', 'false');
        });

        dropdown.addEventListener('mouseleave', function() {
          if (window.innerWidth <= 900) return;
          dropdown.classList.remove('open');
          panel.setAttribute('aria-hidden', 'true');
        });

        // Prevent clicks inside panel from bubbling
        panel.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      })(dropdowns[i]);
    }

    // Close dropdowns when clicking outside (desktop only)
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 900) return;
      
      if (!e.target.closest('.dropdown')) {
        for (var k = 0; k < dropdowns.length; k++) {
          dropdowns[k].classList.remove('open');
          var p = dropdowns[k].querySelector('.dropdown-panel');
          if (p) p.setAttribute('aria-hidden', 'true');
        }
      }
    });
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
