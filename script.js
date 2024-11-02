import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

  if (nextButton) nextButton.onclick = nextSlide;
  if (prevButton) prevButton.onclick = prevSlide;

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
  if (!carouselContainer) {
    console.error("Carousel container not found.");
    return;
  }

  carouselContainer.innerHTML = ''; // Clear any existing content

  data.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img 
        alt="${item.title || 'Property Image'}" 
        loading="lazy" 
        width="382" 
        height="248" 
        decoding="async" 
        data-nimg="1" 
        class="w-100 cover" 
        src="${item.image || 'default.jpg'}" 
        style="color: transparent; height: 253px;"
      >
      <div class="container">
        <h3><a href="#">${item.title || 'Untitled'}</a></h3>
        <p>${item.location || 'Unknown location'}</p>
        <div class="card-text">
          <span class="text"><i class="fa-solid fa-bed"></i> ${item.beds || 0} Beds</span>
          <span class="text"><i class="fa-solid fa-bath"></i> ${item.baths || 0} Bath</span>
          <span class="text"><i class="fa-solid fa-ruler-combined"></i> ${item.size || 'N/A'}</span>
        </div>
        <hr>
        <div class="card-footer">
          <h4>${item.propertyType || 'Unknown Type'}</h4>
          <h4>${item.price || 'Price Not Available'}</h4>
        </div>
      </div>
    `;
    carouselContainer.appendChild(card);
  });
}

// Function to add property listings to Firestore
async function addPropertyListings(properties) {
  const propertiesCollection = collection(db, "recentPost");

  for (const property of properties) {
    try {
      const docRef = await addDoc(propertiesCollection, property);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}

// Sample data to post
const propertiesData = [
  {
    image: "https://picsum.photos/800/200?random=1",
    title: "Godown for sale at Edappally, tollbooth",
    location: "Unnichira Junction, Thykkavu, Edappally, Kochi",
    beds: 3,
    baths: 3,
    size: "1800 sqft",
    propertyType: "Godown/Warehouse",
    price: "₹30/sqft"
  },
  {
    image: "https://picsum.photos/800/200?random=2",
    title: "Office Space for sale at Edappally, Kalamassery",
    location: "Edappally, Kochi",
    beds: 4,
    baths: 2,
    size: "2500 sqft",
    propertyType: "Office",
    price: "₹50/sqft"
  },
  {
    image: "https://picsum.photos/800/200?random=3",
    title: "Warehouse available at Kalamassery.Cusat",
    location: "Thykkavu, Edappally, Kochi",
    beds: 2,
    baths: 2,
    size: "1200 sqft",
    propertyType: "Warehouse",
    price: "₹25/sqft"
  },
  {
    image: "https://picsum.photos/800/200?random=4",
    title: "Commercial space at Edappally",
    location: "Near Lulu Mall, Edappally, Kochi",
    beds: 3,
    baths: 3,
    size: "1500 sqft",
    propertyType: "Commercial",
    price: "₹45/sqft"
  }
];

// Call the function to add data (uncomment to run)
// addPropertyListings(propertiesData);

// Function to determine images per slide based on screen width
function getImagesPerSlide() {
  if (window.innerWidth < 480) return 1; // Mobile
  if (window.innerWidth < 768) return 2; // Tablet
  return 3; // Desktop
}

// Function to show slide based on the index
function showSlide(index) {
  const imagesPerSlide = getImagesPerSlide();
  const carouselImages = document.querySelector('.carousel-images');
  const totalCards = document.querySelectorAll('.carousel-images .card').length;
  const totalSlides = Math.ceil(totalCards / imagesPerSlide);

  // Update current index for proper pagination
  if (index >= totalSlides) {
    currentIndex = 0; // Loop back to the first slide
  } else if (index < 0) {
    currentIndex = totalSlides - 1; // Loop back to the last slide
  } else {
    currentIndex = index;
  }

  // Calculate the offset based on current index
  const offset = -currentIndex * (carouselImages.offsetWidth / imagesPerSlide);
  carouselImages.style.transform = `translateX(${offset}px)`;
  
  updatePagination(totalSlides); // Update pagination dots
}

function updatePagination(totalSlides) {
  const paginationContainer = document.querySelector('.pagination-controls .pagination-dot');
  paginationContainer.innerHTML = ''; // Clear existing dots

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.backgroundColor = i === currentIndex ? '#28a745' : '#ccc';
    dot.style.borderRadius = '50%';
    dot.style.display = 'inline-block';
    dot.style.margin = '0 5px'; // Spacing between dots
    paginationContainer.appendChild(dot);
  }
}


// Next and previous slide functions
function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}
