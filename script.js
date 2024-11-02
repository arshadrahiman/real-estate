import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkA4ZFEo4Blsvas5Fw1lFXFds1fTAYB9I",
  authDomain: "real-estate-bcba5.firebaseapp.com",
  projectId: "real-estate-bcba5",
  storageBucket: "real-estate-bcba5.firebasestorage.app",
  messagingSenderId: "124509100933",
  appId: "1:124509100933:web:d452f19f3559e9350c02ec",
  measurementId: "G-RP3HW8GMVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentIndex = 0;

// Load the carousel data once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  loadCarouselData();

  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');

  if (nextButton && prevButton) {
    nextButton.onclick = nextSlide;
    prevButton.onclick = prevSlide;
  }

  window.addEventListener('resize', () => showSlide(currentIndex));
});

// Function to load carousel data from Firestore
async function loadCarouselData() {
  try {
    const recentPostRef = collection(db, 'recentPost');
    const querySnapshot = await getDocs(recentPostRef);
    const data = querySnapshot.docs.map(doc => doc.data());
    
    console.log("Fetched data from Firestore:", data); // Log the data
    renderCarousel(data);
    showSlide(0); // Initialize carousel view
  } catch (error) {
    console.error("Failed to load carousel data:", error);
  }
}

// Function to render carousel
function renderCarousel(data) {
  const carouselContainer = document.querySelector('.carousel-images');
  carouselContainer.innerHTML = ''; // Clear any existing content

  data.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img 
        alt="${item.title}" 
        loading="lazy" 
        width="382" 
        height="248" 
        decoding="async" 
        data-nimg="1" 
        class="w-100 cover" 
        src="${item.image}" 
        style="color: transparent; height: 253px;"
      >
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


// Function to determine images per slide based on screen width
function getImagesPerSlide() {
  if (window.innerWidth < 480) return 1;
  if (window.innerWidth < 768) return 2;
  return 3;
}

// Function to show slide based on the index
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

// Next and previous slide functions
function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}
