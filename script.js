let currentIndex = 0;

async function loadCarouselData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    renderCarousel(data);
    showSlide(0); // Initialize carousel view
  } catch (error) {
    console.error("Failed to load carousel data:", error);
  }
}

function renderCarousel(data) {
  const carouselContainer = document.querySelector('.carousel-images');
  carouselContainer.innerHTML = ''; // Clear any existing content

  data.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="container">
        <h3><a href="#">${item.title}</a></h3>
        <p>${item.location}</p>
        <div class="card-text">
          <span class="text"><i class="fa-solid fa-bed"></i> ${item.beds} Beds</span>
          <span class="text"><i class="fa-solid fa-bath"></i> ${item.baths} Bath</span>
          <span class="text"><i class="fa-solid fa-ruler-combined"></i> ${item.size}</span>
        </div>
        <hr>
        <div class="card-footer">
          <h4>${item.propertyType}</h4>
          <h4>${item.price}</h4>
        </div>
      </div>
    `;
    carouselContainer.appendChild(card);
  });
}

function getImagesPerSlide() {
  if (window.innerWidth < 480) return 1;
  if (window.innerWidth < 768) return 2;
  return 3;
}

function showSlide(index) {
  const imagesPerSlide = getImagesPerSlide();
  const imageWidth = document.querySelector('.card').offsetWidth;
  const carouselImages = document.querySelector('.carousel-images');
  const totalSlides = Math.ceil(document.querySelectorAll('.carousel-images .card').length / imagesPerSlide);

  if (index >= totalSlides) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = totalSlides - 1;
  } else {
    currentIndex = index;
  }
  const offset = -currentIndex * (imageWidth * imagesPerSlide);
  carouselImages.style.transform = `translateX(${offset}px)`;
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

document.querySelector('.next').onclick = nextSlide;
document.querySelector('.prev').onclick = prevSlide;

// Update slide on resize
window.addEventListener('resize', () => showSlide(currentIndex));

// Load data and initialize carousel
loadCarouselData();
