// Research cards functionality
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.research-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });
});

// Photo Gallery Carousel functionality
const track = document.getElementById('carousel-track');
const totalImages = track.children.length;
const visibleImages = 2;
let currentSlide = 0;

function nextSlide() {
  currentSlide++;
  if (currentSlide > totalImages - visibleImages) {
    currentSlide = 0;
  }
  track.style.transform = `translateX(-${currentSlide * 350}px)`;
}

setInterval(nextSlide, 6000);

// Card visibility animations
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate once only
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% of card is visible
  });

  cards.forEach(card => observer.observe(card));
});

// Research card visibility animations
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.research-card');
  cards.forEach(card => card.classList.add('hidden')); // start hidden

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('hidden');
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
});