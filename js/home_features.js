// ============================================
// TESTIMONIAL SLIDER (From original index.js)
// ============================================
window.initTestimonialSlider = function() {
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

  // Click events for dots
  for (var i = 0; i < dots.length; i++) {
    (function(idx) {
        dots[idx].addEventListener('click', function() {
            currentSlide = idx;
            showSlide(currentSlide);
            // Reset timer
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
    })(i);
  }

  // Auto play
  clearInterval(autoSlideInterval); // clear previous if any
  autoSlideInterval = setInterval(nextSlide, 5000);
  
  // Initial
  showSlide(0);
};

// ============================================
// COUNTER ANIMATION (From original index.js)
// ============================================
window.initCounterAnimation = function() {
  var counters = document.querySelectorAll('.counter-number');
  if (counters.length === 0) return;

  var options = {
    threshold: 0.5
  };

  var observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'));
        var duration = 2000; // 2 seconds
        var stepTime = 20;
        var steps = duration / stepTime;
        var increment = target / steps;
        var custom = el.innerText;
        
        var current = 0;
        var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                el.innerText = target + '+'; // customize if needed
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current) + '+';
            }
        }, stepTime);
        
        observer.unobserve(el);
      }
    });
  }, options);

  counters.forEach(counter => {
    observer.observe(counter);
  });
};
