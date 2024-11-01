let currentIndex = 0;

function showSlide(index) {
  const carouselImages = document.querySelector('.carousel-images');
  const totalSlides = document.querySelectorAll('.carousel-images .card').length;
  
  if (index >= totalSlides) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = totalSlides - 1;
  } else {
    currentIndex = index;
  }

  const offset = -currentIndex * 800; // width of each card
  carouselImages.style.transform = `translateX(${offset}px)`;
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

// Auto slide every 3 seconds
let autoSlideInterval = setInterval(nextSlide, 3000);

// Reset interval on manual slide change
function resetInterval() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 3000);
}

// Attach reset function to manual slide changes
document.querySelector('.next').onclick = function() {
  nextSlide();
  resetInterval();
};
document.querySelector('.prev').onclick = function() {
  prevSlide();
  resetInterval();
};
