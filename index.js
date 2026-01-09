document.addEventListener('DOMContentLoaded', function () {
	const toggles = document.querySelectorAll('.dropdown-toggle');

	function closeAll() {
		// Only close all on desktop
		if (window.innerWidth > 900) {
			document.querySelectorAll('.dropdown-panel').forEach(p => p.setAttribute('aria-hidden', 'true'));
			document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
		}
	}

	function closeAllMobile() {
		document.querySelectorAll('.dropdown-panel').forEach(p => p.setAttribute('aria-hidden', 'true'));
		document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
	}

	// Use pointerenter/pointerleave with a short delay to avoid flicker
	const closeTimers = new Map();

	toggles.forEach(btn => {
		const id = btn.getAttribute('data-dropdown');
		const panel = document.getElementById(id);
		const parent = btn.closest('.dropdown');

		function openPanel() {
			if (window.innerWidth > 900) {
				closeAll();
			}
			panel.setAttribute('aria-hidden', 'false');
			parent.classList.add('open');
		}

		function closePanel() {
			panel.setAttribute('aria-hidden', 'true');
			parent.classList.remove('open');
		}

		function scheduleClose() {
			// small delay to allow pointer to move between button and panel
			const t = setTimeout(() => {
				panel.setAttribute('aria-hidden', 'true');
				parent.classList.remove('open');
				closeTimers.delete(parent);
			}, 200);
			closeTimers.set(parent, t);
		}

		function cancelScheduledClose() {
			const t = closeTimers.get(parent);
			if (t) {
				clearTimeout(t);
				closeTimers.delete(parent);
			}
		}

		btn.addEventListener('click', (e) => {
			const isOpen = panel.getAttribute('aria-hidden') === 'false';
			if (isOpen) {
				closePanel();
			} else {
				openPanel();
			}
			e.stopPropagation();
		});

		// Keep open while pointer is inside parent (includes panel because it's a child)
		parent.addEventListener('pointerenter', () => {
			if (window.innerWidth > 900) {
				cancelScheduledClose();
				openPanel();
			}
		});
		parent.addEventListener('pointerleave', () => {
			if (window.innerWidth > 900) {
				scheduleClose();
			}
		});
	});

	// Close when clicking outside (only on desktop)
	document.addEventListener('click', (e) => {
		if (window.innerWidth > 900) {
			closeAll();
		}
	});

	// Prevent closing when clicking inside sidebar on mobile
	document.getElementById('sidebarNav')?.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	// Close on Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			if (window.innerWidth <= 900) {
				closeAllMobile();
			} else {
				closeAll();
			}
		}
	});

	// Close dropdowns when resizing into small screens to avoid stuck open panels
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			if (window.innerWidth <= 900) {
				document.querySelectorAll('.dropdown-panel[aria-hidden="false"]').forEach(panel => {
					panel.setAttribute('aria-hidden', 'true');
					const p = panel.closest('.dropdown');
					if (p) p.classList.remove('open');
				});
			}
		}, 150);
	});
});
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  let index = 0;

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[i].classList.add("active");
    dots[i].classList.add("active");
    index = i;
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      showSlide(dot.dataset.slide);
    });
  });

  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 5000);
	const openBtn = document.getElementById("openMenu");
	const closeBtn = document.getElementById("closeMenu");
	const nav = document.getElementById("sidebarNav");
	const overlay = document.getElementById("menuOverlay");
	const pageBody = document.body;

	if (openBtn && closeBtn && nav && overlay) {
		const navLinks = nav.querySelectorAll("a");

		const openNav = () => {
			nav.classList.add("active");
			overlay.classList.add("active");
			pageBody.classList.add("no-scroll");
		};

		const closeNav = () => {
			nav.classList.remove("active");
			overlay.classList.remove("active");
			pageBody.classList.remove("no-scroll");
		};

		openBtn.addEventListener("click", openNav);
		closeBtn.addEventListener("click", closeNav);
		overlay.addEventListener("click", closeNav);
		navLinks.forEach(link => link.addEventListener("click", closeNav));

		window.addEventListener("resize", () => {
			if (window.innerWidth > 900) {
				closeNav();
			}
		});
	}

  // ============ COUNTER ANIMATION ============
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
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

      updateCounter();
    });
    
    countersAnimated = true;
  }

  // Intersection Observer to trigger animation when stats section is visible
  const statsSection = document.querySelector('.testimonial-stats');
  
  if (statsSection) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    }, observerOptions);

    statsObserver.observe(statsSection);
  }
