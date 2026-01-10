/**
 * Bireena Atithi - Mobile-First Navigation System
 * ================================================
 * Features:
 * - Smooth sidebar slide animation
 * - Dropdown expand/collapse on mobile
 * - Desktop hover behavior preserved
 * - Accessibility support (aria attributes)
 * - Production-ready code
 */

document.addEventListener('DOMContentLoaded', function () {
  
  // ============================================
  // MOBILE SIDEBAR NAVIGATION
  // ============================================
  
  const openBtn = document.getElementById("openMenu");
  const closeBtn = document.getElementById("closeMenu");
  const sidebar = document.getElementById("sidebarNav");
  const overlay = document.getElementById("menuOverlay");
  const body = document.body;

  /**
   * Open the mobile sidebar
   */
  function openSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.add("active");
    overlay.classList.add("active");
    body.classList.add("no-scroll");
    sidebar.setAttribute("aria-hidden", "false");
  }

  /**
   * Close the mobile sidebar
   */
  function closeSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("no-scroll");
    sidebar.setAttribute("aria-hidden", "true");
    
    // Close all dropdowns when sidebar closes
    closeAllDropdowns();
  }

  // Sidebar open/close event listeners
  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSidebar();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeSidebar();
    });
  }

  // Close sidebar when clicking overlay
  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // Close sidebar on window resize (desktop)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeSidebar();
    }
  });

  // ============================================
  // DROPDOWN NAVIGATION SYSTEM
  // ============================================

  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const closeTimers = new Map();

  /**
   * Close all dropdown panels
   */
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-panel').forEach(panel => {
      panel.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.classList.remove('open');
    });
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Open a specific dropdown panel
   * @param {HTMLElement} dropdown - The dropdown container
   * @param {HTMLElement} panel - The dropdown panel
   */
  function openDropdown(dropdown, panel) {
    // On desktop, close other dropdowns first
    if (window.innerWidth > 900) {
      closeAllDropdowns();
    }
    
    panel.setAttribute('aria-hidden', 'false');
    dropdown.classList.add('open');
    
    // Update aria-expanded on toggle button
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  /**
   * Close a specific dropdown panel
   * @param {HTMLElement} dropdown - The dropdown container
   * @param {HTMLElement} panel - The dropdown panel
   */
  function closeDropdown(dropdown, panel) {
    panel.setAttribute('aria-hidden', 'true');
    dropdown.classList.remove('open');
    
    // Update aria-expanded on toggle button
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Toggle dropdown open/close state
   * @param {HTMLElement} dropdown - The dropdown container
   * @param {HTMLElement} panel - The dropdown panel
   */
  function toggleDropdown(dropdown, panel) {
    const isOpen = panel.getAttribute('aria-hidden') === 'false';
    
    if (isOpen) {
      closeDropdown(dropdown, panel);
    } else {
      openDropdown(dropdown, panel);
    }
  }

  // Initialize each dropdown toggle
  dropdownToggles.forEach(toggle => {
    const dropdownId = toggle.getAttribute('data-dropdown');
    const panel = document.getElementById(dropdownId);
    const dropdown = toggle.closest('.dropdown');

    if (!panel || !dropdown) return;

    // Set initial aria attributes
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', dropdownId);

    /**
     * CLICK EVENT - Works for both mobile and desktop
     * Prevents default behavior and toggles dropdown
     */
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Cancel any scheduled close
      const timer = closeTimers.get(dropdown);
      if (timer) {
        clearTimeout(timer);
        closeTimers.delete(dropdown);
      }

      toggleDropdown(dropdown, panel);
    });

    /**
     * DESKTOP ONLY - Hover to open
     * Uses pointer events for better touch/mouse handling
     */
    dropdown.addEventListener('pointerenter', () => {
      if (window.innerWidth > 900) {
        // Cancel any scheduled close
        const timer = closeTimers.get(dropdown);
        if (timer) {
          clearTimeout(timer);
          closeTimers.delete(dropdown);
        }
        openDropdown(dropdown, panel);
      }
    });

    /**
     * DESKTOP ONLY - Mouse leave to close with delay
     * Small delay allows moving between toggle and panel
     */
    dropdown.addEventListener('pointerleave', () => {
      if (window.innerWidth > 900) {
        const timer = setTimeout(() => {
          closeDropdown(dropdown, panel);
          closeTimers.delete(dropdown);
        }, 200);
        closeTimers.set(dropdown, timer);
      }
    });
  });

  /**
   * Close dropdowns when clicking outside (desktop only)
   * Mobile sidebar handles its own click behavior
   */
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 900) {
      // Check if click is outside any dropdown
      const isInsideDropdown = e.target.closest('.dropdown');
      if (!isInsideDropdown) {
        closeAllDropdowns();
      }
    }
  });

  /**
   * Prevent clicks inside sidebar from bubbling up
   * This stops sidebar from closing when clicking inside
   */
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      // Only stop propagation, don't prevent default
      // This allows links inside to work
      e.stopPropagation();
    });
  }

  /**
   * Handle clicks on panel links
   * Close sidebar only for real navigation links
   */
  document.querySelectorAll('.panel-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // If it's a real link (not # or empty), close sidebar on mobile
      if (href && href !== '#' && href !== '') {
        if (window.innerWidth <= 900) {
          // Small delay to show click feedback
          setTimeout(() => {
            closeSidebar();
          }, 100);
        }
      }
      
      // Don't prevent default - let the link navigate
    });
  });

  /**
   * Keyboard accessibility
   * Close dropdowns/sidebar on Escape key
   */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      
      // Also close sidebar on mobile
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    }
  });

  // ============================================
  // TESTIMONIAL SLIDER
  // ============================================

  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let slideInterval;

  /**
   * Show a specific slide
   * @param {number} index - Slide index to show
   */
  function showSlide(index) {
    if (slides.length === 0) return;
    
    // Normalize index
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Remove active class from all
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    // Add active class to current
    slides[index].classList.add("active");
    if (dots[index]) {
      dots[index].classList.add("active");
    }
    
    currentSlide = index;
  }

  /**
   * Auto-advance slides
   */
  function startSlideshow() {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
  }

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(parseInt(dot.dataset.slide) || index);
      
      // Reset auto-advance timer
      clearInterval(slideInterval);
      startSlideshow();
    });
  });

  // Start slideshow if slides exist
  if (slides.length > 0) {
    startSlideshow();
  }

  // ============================================
  // COUNTER ANIMATION
  // ============================================

  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  /**
   * Animate counter numbers
   */
  function animateCounters() {
    if (countersAnimated) return;
    
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target')) || 0;
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const fps = 60;
      const increment = target / (duration / (1000 / fps));
      let current = 0;

      const updateCounter = () => {
        current += increment;
        
        if (current < target) {
          counter.textContent = Math.floor(current) + suffix;
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
    
    countersAnimated = true;
  }

  /**
   * Intersection Observer for counter animation
   * Triggers when stats section comes into view
   */
  const statsSection = document.querySelector('.testimonial-stats');
  
  if (statsSection && counters.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          // Stop observing after animation
          statsObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    statsObserver.observe(statsSection);
  }

});
