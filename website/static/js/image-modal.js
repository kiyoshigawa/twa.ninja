// This is to allow modal popup images on the blog posts (and elsewhere)

"use strict";

const modalHTML = `
  <div id="image-modal" class="modal-backdrop">
    <div class="modal-container">
      <button class="modal-close" aria-label="Close">×</button>
      <img class="modal-image" src="" alt="">
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

function openModal(imageUrl, altText) {
  const modal = document.getElementById('image-modal');
  const modalImg = modal.querySelector('.modal-image');
  modalImg.src = imageUrl;
  modalImg.alt = altText;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('image-modal');
  const modalImg = modal.querySelector('.modal-image');
  modal.classList.remove('active');
  modalImg.src = '';
}

document.querySelector('.modal-close').addEventListener('click', closeModal);

document.getElementById('image-modal').addEventListener('click', function(event) {
  if (event.target === this) {
    closeModal();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// This runs once when the page loads.
// It finds all links with class "image_link" and attaches a click listener to each.
// When clicked, it opens the full-size image in the modal instead of navigating.

document.querySelectorAll('a.image_link').forEach(function(link) {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const img = link.querySelector('img');
    openModal(link.href, img ? img.alt : '');
  });
});
