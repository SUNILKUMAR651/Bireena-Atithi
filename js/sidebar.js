// ============================================
// MOBILE SIDEBAR FUNCTIONALITY
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
    if (!openBtn.hasAttribute('data-init')) {
        openBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openSidebar();
        });
        openBtn.setAttribute('data-init', 'true');
    }
  }

  // Close sidebar on X button click
  if (closeBtn) {
    if (!closeBtn.hasAttribute('data-init')) {
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
        closeBtn.setAttribute('data-init', 'true');
    }
  }

  // IMPORTANT: Do NOT close sidebar when clicking outside/overlay.
  // Sidebar closes only via the X button (and Escape key).
  if (overlay) {
    if(!overlay.hasAttribute('data-init')) {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        overlay.setAttribute('data-init', 'true');
    }
  }

  /**
   * CRITICAL: Prevent clicks inside sidebar from closing it
   * This stops event propagation so document click handler doesn't fire
   */
  if (!sidebar.hasAttribute('data-init')) {
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
      sidebar.setAttribute('data-init', 'true');
  }

  // Close sidebar on Escape key
  if (!document.body.hasAttribute('data-sidebar-init')) {
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
      });
      document.body.setAttribute('data-sidebar-init', 'true');
  }

  // Close sidebar on resize to desktop (cleanup)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 900 && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });

  // Expose closeSidebar for other scripts if needed
  window.closeSidebar = closeSidebar;
}
