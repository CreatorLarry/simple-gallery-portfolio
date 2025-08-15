// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Navbar blur/shadow on scroll
const nav = document.getElementById("siteNav");
const onScroll = () => {
  if (window.scrollY > 10) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Smooth internal link scrolling (native is fine; this adds focus handling)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId.length > 1) {
      const el = document.querySelector(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }
    }
  });
});

// Simple Lightbox via Bootstrap Modal
const lightboxModal = new bootstrap.Modal("#lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Get all gallery items
const galleryLinks = document.querySelectorAll(".gallery-link");
let currentIndex = 0;

// Create array of gallery items with data
const galleryItems = Array.from(galleryLinks).map(link => {
  return {
    src: link.getAttribute("data-img"),
    alt: link.getAttribute("data-alt") || ""
  };
});

// Function to update the lightbox with current image
function updateLightbox(index) {
  if (index < 0) index = galleryItems.length - 1;
  if (index >= galleryItems.length) index = 0;
  
  currentIndex = index;
  const item = galleryItems[currentIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
}

// Next image function
function nextImage() {
  updateLightbox(currentIndex + 1);
}

// Previous image function
function prevImage() {
  updateLightbox(currentIndex - 1);
}

// Event listeners for navigation buttons
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  prevImage();
});
nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  nextImage();
});

// Event listener for clicking gallery links
document.addEventListener("click", (e) => {
  const link = e.target.closest(".gallery-link");
  if (!link) return;

  e.preventDefault();
  const index = Array.from(galleryLinks).indexOf(link);
  updateLightbox(index);
  lightboxModal.show();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // Check if modal is shown by checking if the modal element has the 'show' class
  const modalElement = document.getElementById("lightboxModal");
  if (!modalElement.classList.contains("show")) return;
  
  if (e.key === "ArrowLeft") {
    prevImage();
  } else if (e.key === "ArrowRight") {
    nextImage();
  }
});
