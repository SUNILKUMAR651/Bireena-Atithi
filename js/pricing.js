/**
 * Pricing page interactions
 * - Billing period toggle (1 month / 6 months / 1 year)
 * - Updates card prices without changing landing page styles
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initPricingToggle();
  });

// Expose init function globally so router can call it
window.initPricingToggle = function() {
  var toggle = document.querySelector('.pricing-toggle');
  if (!toggle) return;

  var buttons = toggle.querySelectorAll('.pricing-toggle-btn');
  var indicator = toggle.querySelector('.pricing-toggle-indicator');
  var cards = document.querySelectorAll('.pricing-card');

  function formatNumber(value) {
      var num = Number(value);
      if (!isFinite(num)) return String(value);
      return num.toLocaleString('en-IN');
    }

    function setActiveButton(activeBtn) {
      for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        var isActive = btn === activeBtn;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      }

      if (!indicator) return;

      // Move indicator under the active button
      var left = activeBtn.offsetLeft;
      var width = activeBtn.offsetWidth;
      indicator.style.transform = 'translateX(' + left + 'px)';
      indicator.style.width = width + 'px';
    }

    function updatePrices(period) {
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var amountEl = card.querySelector('.amount');
        var termEl = card.querySelector('.term');

        if (!amountEl || !termEl) continue;

        var raw = card.getAttribute('data-' + period);
        amountEl.textContent = formatNumber(raw);

        if (period === 'month') termEl.textContent = '/month';
        else if (period === 'halfyear') termEl.textContent = '/6 months';
        else termEl.textContent = '/year';
      }
    }

    function onToggleClick(e) {
      e.preventDefault();

      var btn = e.currentTarget;
      var period = btn.getAttribute('data-period');
      if (!period) return;

      setActiveButton(btn);
      updatePrices(period);
    }

    // Bind
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', onToggleClick);
    }

    // Init default (year)
    var defaultBtn = toggle.querySelector('.pricing-toggle-btn.is-active') || buttons[0];
    if (defaultBtn) {
      setActiveButton(defaultBtn);
      updatePrices(defaultBtn.getAttribute('data-period') || 'year');
    }

    // Reposition indicator on resize
    window.addEventListener('resize', function () {
      var active = toggle.querySelector('.pricing-toggle-btn.is-active');
      if (active) setActiveButton(active);
    });
  }
})();

// Auto-initialize on page load for initial visit
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initPricingToggle);
} else {
  window.initPricingToggle();
}
