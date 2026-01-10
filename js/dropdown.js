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
      if (dropdown.hasAttribute('data-init')) return; // Avoid re-binding

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

      dropdown.setAttribute('data-init', 'true');
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
  if (!document.body.hasAttribute('data-dropdown-click-init')) {
      document.addEventListener('click', function(e) {
        // Only apply on desktop
        if (window.innerWidth <= 900) return;
        
        // If click is not inside any dropdown, close all
        if (!e.target.closest('.dropdown')) {
            var allOpen = document.querySelectorAll('.dropdown.open');
            for (var k = 0; k < allOpen.length; k++) {
                closeDropdown(allOpen[k]);
            }
        }
      });
      document.body.setAttribute('data-dropdown-click-init', 'true');
  }

  /**
   * Handle touch events on mobile
   * Prevent touchstart from closing dropdowns/sidebar
   */
  var allDropdownPanels = document.querySelectorAll('.dropdown-panel');
  for (var p = 0; p < allDropdownPanels.length; p++) {
    if (!allDropdownPanels[p].hasAttribute('data-touch-init')) {
        allDropdownPanels[p].addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
        allDropdownPanels[p].setAttribute('data-touch-init', 'true');
    }
  }
}
