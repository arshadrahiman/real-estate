let currentIndex = 0;
const imagesPerSlide = 4;
const imageWidth = document.querySelector('.card').offsetWidth; // Calculate width based on a single image
const carouselImages = document.querySelector('.carousel-images');
const totalSlides = Math.ceil(document.querySelectorAll('.carousel-images .card').length / imagesPerSlide);

function showSlide(index) {
    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }
    const offset = -currentIndex * (imageWidth * imagesPerSlide); // Move by four images' width at once
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
